import path from "path"
import { injectable, inject, LazyServiceIdentifer } from "inversify"
import DI_TYPES, { DILibrary } from "../DI/DITypes"
import appConfig from "../app/config"
import fm from "../util/FileManager"
import ImageService from "../service/ImageService"
import AuthorDao, { QueryAuthorsSortRule } from "../dao/AuthorDao"
import RecordAuthorDao from "../dao/RecordAuthorDao"
import RecordService from "./RecordService"

@injectable()
class AuthorService {
    private library: DILibrary
    private authorDao: AuthorDao
    private recordAuthorDao: RecordAuthorDao
    private recordService: RecordService

    public constructor(
        @inject(DI_TYPES.Library) library: DILibrary,
        @inject(DI_TYPES.AuthorDao) authorDao: AuthorDao,
        @inject(DI_TYPES.RecordAuthorDao) recordAuthorDao: RecordAuthorDao,
        @inject(new LazyServiceIdentifer(() => DI_TYPES.RecordService)) recordService: RecordService,
    ) {
        this.library = library
        this.authorDao = authorDao
        this.recordAuthorDao = recordAuthorDao
        this.recordService = recordService
    }

    public queryAuthorDetail(authorId: number): VO.AuthorDetail | undefined {
        const author = this.authorDao.queryAuthorById(authorId) as VO.AuthorDetail | undefined
        if (author === void 0) return author

        // 获得完整的头像路径 
        author.avatar = this.getAvatarFullPath(author.avatar)
        author.recordCount = this.recordAuthorDao.queryCountOfRecordsByAuthorId(authorId)
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
            row.avatar = this.getAvatarFullPath(row.avatar)
            row.worksCount = this.recordAuthorDao.queryCountOfRecordsByAuthorId(row.id)
            row.masterpieces = this.recordService.queryAuthorMasterpieces(row.id)
        })

        return page
    }

    public editAuthor(formData: DTO.EditAuthorForm): void {
        const author: Entity.Author = {
            id: formData.id,
            name: formData.name.trim(),
            avatar: this.handleAvatar(formData.avatar, formData.originAvatar),
            intro: formData.intro.trim(),
        }

        this.library.dbConnection.transaction(() => {
            if (formData.id === 0) {
                this.authorDao.insertAuthor(author)
            } else {
                const oldAuthor = this.authorDao.queryAuthorById(author.id)
                this.authorDao.updateAuthor(author)

                if (oldAuthor?.name !== author.name) {
                    // 更新冗余字段tagAuthorSum
                    this.updateRecordTagAuthorSumOfAuthor(author.id)
                }
            }
        })
    }

    public deleteAuthor(authorId: number): void {
        const author = this.authorDao.queryAuthorById(authorId)
        if (author === void 0) return

        this.library.dbConnection.transaction(() => {
            this.authorDao.deleteAuthor(authorId) // 删除作者
            this.updateRecordTagAuthorSumOfAuthor(authorId) // 更新冗余字段tagAuthorSum, 不能先删除关联，否则无法更新冗余字段
            this.recordAuthorDao.deleteRecordAuthorByAuthorId(authorId) // 删除关联
        })

        if (author.avatar) {
            try { fm.unlinkIfExistsSync(author.avatar) } catch { }
        }
    }

    private handleAvatar(newImg: string, originImg: string): string | null {
        // 图片没有改变，返回原来的图片名
        if (newImg === originImg) return path.basename(newImg) || null

        // 图片改变了
        // 删除旧的图片
        if (originImg.length) {
            // 删除的过程中可能会出错(没有权限,文件被占用等)
            try { fm.unlinkIfExistsSync(originImg) } catch { }
        }
        // 保存新的图片, 返回新的图片名, 如果失败直接提醒用户原因，让用户解决问题
        if (newImg.length) {
            const imageService = new ImageService(newImg)
            return imageService.handleAuthorAvatar() || null
        }

        return null
    }

    private getAvatarFullPath(avatar: string | null): string | null {
        return avatar ? path.join(appConfig.getLibraryImagesDirPath(this.library.id), avatar) : null
    }

    private updateRecordTagAuthorSumOfAuthor(authorId: PrimaryKey): void {
        const rowCount = 150
        let recordIds = this.recordAuthorDao.queryRecordIdsByAuthorId(authorId, 0, rowCount)
        while (recordIds.length) {
            recordIds.forEach(id => this.recordService.updateRecordTagAuthorSum(id))

            if (recordIds.length < rowCount) break
            recordIds = this.recordAuthorDao.queryRecordIdsByAuthorId(authorId, 0, rowCount)
        }
    }
}


export default AuthorService