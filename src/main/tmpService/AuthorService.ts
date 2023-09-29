import path from "path"
import { injectable, inject } from "inversify"
import DIContainer from "../DI/DIContainer"
import DI_TYPES, { DILibrary } from "../DI/DITypes"
import appConfig from "../app/config"
import fm from "../util/FileManager"
import ImageService from "../service/ImageService"
import AuthorDao from "../dao/AuthorDao"
import RecordAuthorDao from "../dao/RecordAuthorDao"
// import RecordService from "./RecordService"

@injectable()
class AuthorService {
    private library: DILibrary
    private authorDao: AuthorDao
    private recordAuthorDao: RecordAuthorDao
    // private recordService: RecordService

    public constructor(
        @inject(DI_TYPES.Library) library: DILibrary,
        @inject(AuthorDao) authorDao: AuthorDao,
        @inject(RecordAuthorDao) recordAuthorDao: RecordAuthorDao,
        // @inject(RecordService) recordService: RecordService,
    ) {
        this.library = library
        this.authorDao = authorDao
        this.recordAuthorDao = recordAuthorDao
        // this.recordService = recordService
    }

    public queryAuthorDetail(authorId: number): VO.AuthorDetail | undefined {
        const author = this.authorDao.queryAuthorById(authorId) as VO.AuthorDetail | undefined
        if (author === void 0) return author

        // 获得完整的头像路径
        if (author.avatar) {
            author.avatar = path.join(appConfig.getLibraryImagesDirPath(this.library.id), author.avatar)
        }
        author.recordCount = this.recordAuthorDao.queryCountOfRecordsByAuthorId(authorId)
        return author
    }

    public queryAuthorRecmds(options: DTO.QueryAuthorRecommendationsOptions): DTO.Page<VO.AuthorRecommendation> {

        return { total: 0, rows: [] }
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

    public deleteAuthor(authorId: number): void {
        const author = this.authorDao.queryAuthorById(authorId)
        if (author === void 0) return

        this.library.dbConnection.transaction(() => {
            this.authorDao.deleteAuthor(authorId) // 删除作者
            this.recordAuthorDao.deleteRecordAuthorByAuthorId(authorId) // 删除关联
            this.updateRecordTagAuthorSumOfAuthor(author.id) // 更新冗余字段tagAuthorSum
        })

        if (author.avatar) {
            try { fm.unlinkIfExistsSync(author.avatar) } catch { }
        }
    }

    private updateRecordTagAuthorSumOfAuthor(authorId: PrimaryKey) {
        const rowCount = 150
        let recordIds = this.recordAuthorDao.queryRecordIdsByAuthorId(authorId, 0, rowCount)
        while (recordIds.length) {
            // recordIds.forEach(id => this.recordService)

            if (recordIds.length < rowCount) break
            recordIds = this.recordAuthorDao.queryRecordIdsByAuthorId(authorId, 0, rowCount)
        }
    }
}

export default AuthorService