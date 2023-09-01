import { error } from "node:console"
import { unlinkSync, isLegalAbsolutePath } from "../util/FileManager"
import ImageService from "../service/ImageService"
import LibraryDao, { QueryAuthorsSortRule } from "../dao/libraryDao"

export default class AuthorService {
    private libraryId: number
    private libraryDao: LibraryDao

    constructor(libraryId: number) {
        this.libraryId = libraryId
        this.libraryDao = new LibraryDao(libraryId)
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
                throw error('invalid sort field')
        }
        defaultSortRule.forEach((rule) => {
            if (rule.field !== sortRule[0].field) {
                sortRule.push(rule)
            }
        })

        const { rows, total } = this.libraryDao.queryAuthorsByKeyword(
            options.keyword.trim(),
            sortRule,
            (options.pn - 1) * options.ps,
            options.ps
        )
        const page = {} as DTO.Page<VO.AuthorRecommendation>
        page.rows = rows.map((row) => {
            return {
                id: row.id,
                name: row.name,
                avatar: row.avatar,
                worksCount: this.libraryDao.queryCountOfRecordsByAuthorId(row.id),
                intro: row.intro,
                masterpieces: this.libraryDao.queryRecordsOfOrderRateByAuthor(row.id)
            } as VO.AuthorRecommendation
        })
        page.total = total
        return page
    }

    public queryAuthorDetail(authorId: number): VO.AuthorDetail | undefined {
        const author = this.libraryDao.queryAuthor(authorId) as VO.AuthorDetail
        if (author) {
            author.recordCount = this.libraryDao.queryCountOfRecordsByAuthorId(authorId)
            return author
        }
        return
    }

    public deleteAuthor(authorId: number) {
        const author = this.libraryDao.queryAuthor(authorId)
        if (author?.avatar) {
            unlinkSync(author.avatar)
        }
        this.libraryDao.executeInTransaction(() => {
            this.libraryDao.deleteAuthor(authorId) // 删除作者
            this.libraryDao.deleteRecordAuthorByAuthorId(authorId) // 删除关联
        })
    }

    public editAuthor(formData: DTO.EditAuthorForm) {
        const author: Entity.Author = {
            id: formData.id,
            name: formData.name.trim(),
            avatar: formData.avatar.length ? formData.avatar : null,
            intro: formData.intro.trim(),
        }
        if (formData.avatar !== formData.originAvatar) {
            // 删除旧的头像
            if (formData.originAvatar.length) {
                unlinkSync(formData.originAvatar)
            }
            if (author.avatar) {
                // 保存新的头像
                const imageService = new ImageService(formData.avatar, this.libraryId)
                const avatar = imageService.handleAuthorAvatar()
                if (avatar) {
                    author.avatar = avatar
                }
            }
        }
        // 判断添加还是修改
        formData.id === 0 ? this.libraryDao.addAuthor(author) : this.libraryDao.editAuthor(author)
    }

    public close() {
        this.libraryDao.destroy()
    }
}