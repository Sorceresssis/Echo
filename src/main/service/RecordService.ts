import { error } from "node:console"
import LibraryDao, { QueryRecordsSortRule } from "../dao/libraryDao"
import FileManager from "../util/FileManager"

const infoStatusFilterMap = new Map<string, string[]>()
export default class RecordService {
    private libraryDao: LibraryDao

    constructor(libraryId: number) {
        this.libraryDao = new LibraryDao(libraryId)
    }

    public queryRecordDetail(id: number): VO.RecordDetail | undefined {
        const record = this.libraryDao.queryRecordById(id) as VO.RecordDetail
        if (!record) { return void 0 }

        record.authors = this.libraryDao.queryAuthorsByRecordId(id)
        record.tags = this.libraryDao.queryTagsByRecordId(id)
        record.series = this.libraryDao.querySeriesByRecordId(id)

        const extra = this.libraryDao.queryRecordExtraByRecordId(id)
        if (extra) {
            record.intro = extra.intro
            record.info = extra.info
        }
        return record
    }

    public queryRecordRecmds(options: DTO.QueryRecordRecommendationsOptions) {
        const defaultSortRule: QueryRecordsSortRule[] = [
            { field: 'id', order: 'ASC' },
            { field: 'title', order: 'ASC' },
            { field: 'rate', order: 'DESC' },]
        const sortRule: QueryRecordsSortRule[] = []
        switch (options.sortField) {
            case 'time':
                sortRule.push({ field: 'id', order: options.order })
                break
            case 'title':
                sortRule.push({ field: 'title', order: options.order })
                break
            case 'rate':
                sortRule.push({ field: 'rate', order: options.order })
                break
            default:
                throw error('invalid sort field')
        }
        defaultSortRule.forEach((rule) => {
            if (rule.field !== sortRule[0].field) {
                sortRule.push(rule)
            }
        })
        const page = this.libraryDao.queryRecordsByKeyword(
            options.keyword.trim(),
            sortRule,
            this.generateFilters(options.filters),
            (options.pn - 1) * options.ps,
            options.ps,
            {
                type: options.type,
                authorId: options.authorId,
            },
        ) as DTO.Page<VO.RecordRecommendation>
        // 添加作者和标签
        page.rows.forEach((record) => {
            record.authors = this.libraryDao.queryAuthorsByRecordId(record.id)
            record.tags = this.libraryDao.queryTagsByRecordId(record.id)
        })
        return page
    }

    private generateFilters(input: boolean[]): string[] {
        const key = input.toString()
        if (infoStatusFilterMap.has(key)) {
            return infoStatusFilterMap.get(key) as string[]
        }

        const result: string[] = []
        const current: string[] = new Array(input.length)
        this.generateFilter(input, 0, current, result)
        infoStatusFilterMap.set(key, result)

        return result
    }

    private generateFilter(input: boolean[], index: number, current: string[], result: string[]): void {
        if (index === input.length) {
            result.push(current.join(''))
            return
        }
        // 如果是0，既可以是0，也可以是1，如果是1，只能是1
        if (input[index]) {
            current[index] = '1'
            this.generateFilter(input, index + 1, current, result)
        } else {
            current[index] = '0'
            this.generateFilter(input, index + 1, current, result)
            current[index] = '1'
            this.generateFilter(input, index + 1, current, result)
        }
    }

    public close() {
        this.libraryDao.destroy()
    }
}