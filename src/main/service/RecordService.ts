import LibraryDao, { QueryRecordsSortRule } from "../dao/libraryDao"
import tokenizer from "../util/tokenizer"

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
            { field: 'title', order: 'ASC' },
        ]
        const sortRule: QueryRecordsSortRule[] = []
        switch (options.sortField) {
            case 'title':
        }
        console.log(this.generateFilters(options.filters))


        // this.libraryDao.queryRecordsByKeyword(
        //     options.keyword.trim(),
        //     sortRule,
        //     this.generateFilters(options.filters),
        //     (options.pn - 1) * options.ps,
        //     options.ps,
        //     {
        //         type: options.type,
        //         authorId: options.authorId,
        //     },
        // )
        return {
            total: 0,
            rows: [],
        }
    }

    private generateFilters(input: boolean[]): string[] {
        console.log(infoStatusFilterMap.size)

        const key = input.toString()
        if (infoStatusFilterMap.has(key)) {
            return infoStatusFilterMap.get(key) as string[]
        }
        // Filters generater statuses
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
            this.generateFilter(input, ++index, current, result)
        } else {
            current[index] = '0'
            this.generateFilter(input, ++index, current, result)
            current[index] = '1'
            this.generateFilter(input, ++index, current, result)
        }
    }

    public close() {
        this.libraryDao.destroy()
    }
}