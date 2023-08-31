import { error } from "console"
import LibraryDao, { QueryAuthorSortRule } from "../dao/libraryDao"
import tokenizer from "../util/tokenizer"
import { spawn } from "child_process"

export default class QueryAuthorService {
    libraryDao: LibraryDao

    constructor(libraryId: number) {
        this.libraryDao = new LibraryDao(libraryId)
    }

    public queryAuthorRecmds(options: DTO.QueryAuthorRecommendationsOptions): DTO.Page<VO.AuthorRecommendation> {
        const defaultSortRule = [
            { field: 'name', order: 'ASC' },
            { field: 'id', order: 'DESC' },
        ] as QueryAuthorSortRule[]

        const sortRule = [] as QueryAuthorSortRule[]
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
        defaultSortRule.forEach((rule, idx) => {
            if (idx !== 0) {
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
                worksCount: this.libraryDao.queryCountOfRecordsByAuthor(row.id),
                intro: row.intro,
                masterpieces: this.libraryDao.queryRecordsOfOrderRateByAuthor(row.id)
            } as VO.AuthorRecommendation
        })
        page.total = total
        return page
    }

    public close() {
        this.libraryDao.destroy()
    }
}