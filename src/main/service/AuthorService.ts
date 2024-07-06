import fs from "fs"
import { injectable, inject } from "inversify"
import InjectType from "../provider/injectType"
import DIContainer, { type LibraryEnv } from "../provider/container"
import fm from "../util/FileManager"
import ImageService from "./ImageService"
import AuthorDao, { QueryAuthorsSortRule } from "../dao/AuthorDao"
import RecordAuthorDao from "../dao/RecordAuthorDao"
import RecordService from "./RecordService"
import { isNotEmptyString } from "../util/common"

@injectable()
class AuthorService {
    public constructor(
        @inject(InjectType.LibraryEnv) private libEnv: LibraryEnv,
        @inject(InjectType.AuthorDao) private authorDao: AuthorDao,
        @inject(InjectType.RecordAuthorDao) private recordAuthorDao: RecordAuthorDao,
    ) {
    }

    public queryAuthorDetail(authorId: number): VO.AuthorDetail | undefined {
        const author = this.authorDao.queryAuthorById(authorId) as VO.AuthorDetail | undefined
        if (author === void 0) return author

        author.recordCount = this.recordAuthorDao.queryCountOfRecordsByAuthorId(authorId)

        // 获得完整的头像路径
        const authorImagesDirPathConstructor = this.libEnv.genAuthorImagesDirPathConstructor(author.id)
        const {
            avatar,
            sampleImages
        } = authorImagesDirPathConstructor.findAvatarAndSampleImageFilePaths()

        author.avatar = avatar
        author.sampleImages = sampleImages

        return author
    }

    public queryAuthorRecmds(options: DTO.QueryAuthorRecommendationsOptions): DTO.Page<VO.AuthorRecommendation> {
        const defaultSortRule: QueryAuthorsSortRule[] = [
            { field: 'name', order: 'ASC' },
            { field: 'id', order: 'DESC' },
        ]

        const sortRule: QueryAuthorsSortRule[] = []
        switch (options.sortField) {
            case 'name':
                sortRule.push({ field: 'name', order: options.order })
                break
            case 'time':
                sortRule.push({ field: 'id', order: options.order })
                break
            default:
                throw Error('invalid sort field')
        }
        defaultSortRule.forEach(rule => {
            if (rule.field !== sortRule[0].field) {
                sortRule.push(rule)
            }
        })
        const page = this.authorDao.queryAuthorsByKeyword(
            options.keyword.trim(),
            sortRule,
            (options.pn - 1) * options.ps,
            options.ps
        ) as DTO.Page<VO.AuthorRecommendation>

        page.rows.forEach(row => {
            row.avatar = this.libEnv.genAuthorImagesDirPathConstructor(row.id).findAvatarImageFilePath()
            row.worksCount = this.recordAuthorDao.queryCountOfRecordsByAuthorId(row.id)
            row.masterpieces = DIContainer.get<RecordService>(InjectType.RecordService).queryAuthorMasterpieces(row.id)
        })

        return page
    }

    public queryAuthorsByRecordId(recordId: number): VO.RecordAuthorProfile[] {
        const authors = this.authorDao.queryAuthorsAndRoleByRecordId(recordId)
        authors.forEach(author => author.avatar = this.libEnv.genAuthorImagesDirPathConstructor(author.id).findAvatarImageFilePath())
        return authors
    }

    public async editAuthor(formData: DTO.EditAuthorForm): Promise<void> {
        // 处理类型
        const opType = formData.id === 0 ? 'add' : 'edit'

        const author: Entity.Author = {
            id: formData.id,
            name: formData.name.trim(),
            intro: formData.intro.trim(),
        }

        this.libEnv.db.transactionExec(() => {
            if (opType === 'add') {
                author.id = this.authorDao.insertAuthor(author)
            } else {
                const oldAuthor = this.authorDao.queryAuthorById(author.id)
                this.authorDao.updateAuthor(author)

                if (oldAuthor?.name !== author.name) {
                    // 更新冗余字段tagAuthorSum
                    this.updateRecordTagAuthorSumOfAuthor(author.id)
                }
            }
        })

        // 处理图片
        const authorImagesDirPathConstructor = this.libEnv.genAuthorImagesDirPathConstructor(author.id)

        if (formData.newAvatar && isNotEmptyString(formData.newAvatar)) {
            if (opType === 'edit') {
                const oldAvatar = authorImagesDirPathConstructor.findAvatarImageFilePath()
                if (oldAvatar) fm.unlinkIfExistsSync(oldAvatar)
            }

            await ImageService.handleAuthorAvatar(formData.newAvatar, authorImagesDirPathConstructor.getNewAvatarImageFilePath())
        }
        formData.removeSampleImages.forEach(image => fm.unlinkIfExistsSync(image))

        // editSampleImages 里图片的顺序就是图片的展示顺序
        // 由于每个图片都有时间戳，所以不需要考虑下面的问题
        // 1: 添加新图片到一个位置，但是这个位置原本有一个图片，这样会覆盖原来的图片，
        // 2: 后面拖动的图片可能和刚添加的图片重名
        const editSampleImages = formData.editSampleImages
        for (let i = 0; i < editSampleImages.length; i++) {
            const { type, path, idx } = editSampleImages[i]
            if (type === 'add') {
                await ImageService.handleNormalImage(path, authorImagesDirPathConstructor.getNewSampleImageFilePath(idx))
            } else if (type === 'move') {
                fs.renameSync(path, authorImagesDirPathConstructor.getNewSampleImageFilePath(idx))
            }
        }

        // formData.editSampleImages.forEach(item => {
        //     if (item.type === 'add') {
        //         ImageService.handleNormalImage(item.path, authorImagesDirPathConstructor.getNewSampleImageFilePath(item.idx))
        //     } else if (item.type === 'move') {
        //         fs.renameSync(item.path, authorImagesDirPathConstructor.getNewSampleImageFilePath(item.idx))
        //     }
        // })
    }

    public deleteAuthor(authorId: number): void {
        const author = this.authorDao.queryAuthorById(authorId)
        if (author === void 0) return

        this.libEnv.db.transactionExec(() => {
            this.authorDao.deleteAuthorById(authorId) // 删除作者
            this.updateRecordTagAuthorSumOfAuthor(authorId) // 更新冗余字段tagAuthorSum, 不能先删除关联，否则无法更新冗余字段
            this.recordAuthorDao.deleteRecordAuthorByAuthorId(authorId) // 删除关联

            // 删除图像 
            fm.rmdirRecursive(this.libEnv.genAuthorImagesDirPathConstructor(authorId).getImagesDirPath())
        })
    }

    private updateRecordTagAuthorSumOfAuthor(authorId: PrimaryKey): void {
        let pn = 0
        const rowCount = 200
        let recordIds: number[]
        do {
            recordIds = this.recordAuthorDao.queryRecordIdsByAuthorId(authorId, pn++ * rowCount, rowCount)
            recordIds.forEach(id => DIContainer.get<RecordService>(InjectType.RecordService).updateRecordTagAuthorSum(id))
        } while (recordIds.length === rowCount)
    }
}


export default AuthorService