import { error } from "node:console"
import LibraryDao, { QueryTagsSortRule } from "../dao/libraryDao"

export default class TagService {
    private libraryDao: LibraryDao

    constructor(libraryId: number) {
        this.libraryDao = new LibraryDao(libraryId)
    }

    queryTagDetails(options: DTO.QueryTagDetailsOptions): DTO.Page<VO.TagDetail> {
        const defaultSortRule: QueryTagsSortRule[] = [
            { field: 'title', order: 'ASC' },
            { field: 'id', order: 'DESC' },
        ]
        const sortRule: QueryTagsSortRule[] = []
        switch (options.sortField) {
            case 'title':
                sortRule.push({ field: 'title', order: options.order })
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

        const tags = this.libraryDao.queryTagsByKeyword(
            options.keyword.trim(),
            sortRule,
            (options.pn - 1) * options.ps,
            options.ps,
        ) as DTO.Page<VO.TagDetail>
        tags.rows.forEach((tag) => {
            tag.recordCount = this.libraryDao.queryCountOfRecordsByTagId(tag.id)
        })
        return tags
    }

    deleteTag(id: number) {
        this.libraryDao.executeInTransaction(() => {
            this.libraryDao.deleteTag(id)
            this.libraryDao.deleteRecordTagByTagId(id)
        })
    }

    editTag(id: number, newValue: string) {
        const newTag = newValue.trim()
        if (newTag === '') {
            throw new Error('tag can not be empty')
        }
        const existId = this.libraryDao.queryTagIdByTitle(newTag) // 查询是否已经存在

        // id !== existId 的判断是为了防止修改的值和原值一样，导致被删除
        if (existId && id !== existId) {
            // 如果已经存在，就把record_tag中的tag_id重定向到existId 
            this.libraryDao.executeInTransaction(() => {
                this.libraryDao.updateTagIdOfRecordTag(existId, id)
                this.libraryDao.deleteTag(id)
            })
        } else {
            // 如果不存在，就修改tag
            this.libraryDao.updateTag(id, newTag)
        }
    }


    public close() {
        this.libraryDao.destroy()
    }
}