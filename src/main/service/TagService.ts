import { error } from "node:console"
import LibraryDao, { QueryTagsSortRule } from "../dao/libraryDBDao"
import ManageRecordSerivce from "./ManageRecordSerivce"

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

    public close() {
        this.libraryDao.destroy()
    }
}