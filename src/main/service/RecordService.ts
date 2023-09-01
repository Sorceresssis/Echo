import LibraryDao from "../dao/libraryDao"
import tokenizer from "../util/tokenizer"

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

    public queryRecordRecmds() {
        //  回收的
        // 清空回收站，
        // 批量操作，加入回收站，删除，还原
        return []
    }

    private generateFilters(input: string[]): string[] {
        // Filters generater statuses
        const result: string[] = []
        const current: string[] = new Array(input.length)
        this.generateFilter(input, 0, current, result)
        return result
    }

    private generateFilter(input: string[], index: number, current: string[], result: string[]): void {
        if (index === input.length) {
            result.push(current.join(''))
            return
        }
        // 如果是0，既可以是0，也可以是1，如果是1，只能是1
        if (input[index] === '0') {
            current[index] = '0'
            this.generateFilter(input, ++index, current, result)
            current[index] = '1'
            this.generateFilter(input, ++index, current, result)
        } else if (input[index] === '1') {
            current[index] = '1'
            this.generateFilter(input, ++index, current, result)
        }
    }




    public close() {
        this.libraryDao.destroy()
    }
}