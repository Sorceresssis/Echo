import fs from "fs"
import { injectable, inject } from "inversify"
import InjectType from "../provider/injectType"
import DIContainer, { type LibraryEnv } from "../provider/container"
import fm from "../utils/FileManager"
import ImageService from "./ImageService"
import type AuthorDao from "../dao/AuthorDao"
import { type QueryAuthorsSortRule } from "../dao/AuthorDao"
import type RecordAuthorDao from "../dao/RecordAuthorDao"
import type RecordService from "./RecordService"
import { DBPageQueryOptions, PagedResult } from "../pojo/page"

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

        author.record_count = this.recordAuthorDao.queryCountOfRecordsByAuthorId(authorId)

        // 获得完整的头像路径
        const authorImagesDirPathConstructor = this.libEnv.genAuthorImagesDirPathConstructor(author.id)
        const {
            avatar,
            sampleImages
        } = authorImagesDirPathConstructor.findAvatarAndSampleImageFilePaths()

        author.avatar = avatar
        author.sample_images = sampleImages

        return author
    }

    public queryAuthorRecmds(options: RP.QueryAuthorRecommendationsOptions): PagedResult<VO.AuthorRecommendation> {
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
        sortRule.push(...defaultSortRule.filter(rule => rule.field !== sortRule[0].field))
        const pagedResult = this.authorDao.queryAuthorsByKeyword(
            options.keyword.trim(),
            sortRule,
            new DBPageQueryOptions(options.pn, options.ps),
            void 0
        ) as PagedResult<VO.AuthorRecommendation>

        pagedResult.results.forEach(row => {
            row.avatar = this.libEnv.genAuthorImagesDirPathConstructor(row.id).findAvatarImageFilePath()
            row.record_count = this.recordAuthorDao.queryCountOfRecordsByAuthorId(row.id)
            row.masterpieces = DIContainer.get<RecordService>(InjectType.RecordService).queryAuthorMasterpieces(row.id)
        })

        return pagedResult
    }

    public queryAuthorsProfileByRecordId(recordId: number): VO.AuthorProfile[] {
        const authors = this.authorDao.queryAuthorsProfileByRecordId(recordId) as VO.AuthorProfile[]
        authors.forEach(author => {
            author.avatar = this.libEnv.genAuthorImagesDirPathConstructor(author.id).findAvatarImageFilePath()
        })
        return authors
    }

    public async editAuthor(formData: RP.EditAuthorFormData): Promise<void> {
        formData.name = formData.name.trim()
        formData.intro = formData.intro.trim()
        if (formData.newAvatar) {
            formData.newAvatar = formData.newAvatar.trim()
        }
        const opType = formData.id === 0 ? 'add' : 'edit'

        const author = this.authorDao.recordExtraWriteModelFactory(
            formData.name,
            formData.id,
            formData.intro
        )

        this.libEnv.db.transactionExec(() => {
            if (opType === 'add') {
                author.id = this.authorDao.insert(author)
            } else {
                const oldAuthor = this.authorDao.queryAuthorById(author.id)
                if (oldAuthor === void 0) throw Error('author not found')

                this.authorDao.update(author)
                if (oldAuthor.name !== author.name) {
                    // 更新冗余字段tagAuthorSum
                    this.updateRecordTagAuthorSumOfAuthor(author.id)
                }
            }
        })

        // 处理图片
        const authorImagesDirPathConstructor = this.libEnv.genAuthorImagesDirPathConstructor(author.id)

        if (formData.newAvatar) {
            if (opType === 'edit') {
                // NOTE newAvatar指向的就是oldAvatar的情况下。所以要先创建新的然后删除旧的
                const oldAvatar = authorImagesDirPathConstructor.findAvatarImageFilePath()
                await ImageService.handleAuthorAvatar(formData.newAvatar, authorImagesDirPathConstructor.getNewAvatarImageFilePath())
                if (oldAvatar) fm.unlinkIfExistsSync(oldAvatar)
            } else {
                await ImageService.handleAuthorAvatar(formData.newAvatar, authorImagesDirPathConstructor.getNewAvatarImageFilePath())
            }
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
    }

    public deleteAuthor(authorId: number): void {
        const author = this.authorDao.queryAuthorById(authorId)
        if (author === void 0) return

        this.libEnv.db.transactionExec(() => {
            this.authorDao.deleteById(authorId) // 删除作者
            this.updateRecordTagAuthorSumOfAuthor(authorId) // 更新字段tagAuthorSum, 不能先删除关联，否则无法更新冗余字段
            // TODO  Role 连接 。recordAuthorRoleDao.
            this.recordAuthorDao.deleteByAuthorId(authorId) // 删除关联
            // 删除图像
            fm.rmdirRecursive(this.libEnv.genAuthorImagesDirPathConstructor(authorId).getImagesDirPath())
        })
    }

    private updateRecordTagAuthorSumOfAuthor(authorId: Entity.PK): void {
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