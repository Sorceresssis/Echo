import { injectable, inject } from "inversify"
import DIContainer from "../DI/DIContainer"
import DI_TYPES from "../DI/DITypes"
import RecordDao from "../dao/RecordDao"
import AuthorService from "./AuthorService"

// const infoStatusFilterMap = new Map<string, string[]>()

@injectable()
class RecordService {
    private infoStatusFilterMap: Map<string, string[]>

    private recordDao: RecordDao
    private authorService: AuthorService

    public constructor(
        @inject(RecordDao) recordDao: RecordDao,
        @inject(AuthorService) authorService: AuthorService,
    ) {
        this.infoStatusFilterMap = new Map<string, string[]>()

        this.recordDao = recordDao
        this.authorService = authorService

        // TODO  console.log() 测试单例
    }

    public queryRecordDetail(id: number): VO.RecordDetail | undefined {
        console.log('Di Ton', this.infoStatusFilterMap.size);
        this.infoStatusFilterMap.set(id.toString(), ['1', '2'])



        const record = this.recordDao.queryRecordById(id) as VO.RecordDetail | undefined
        if (record === void 0) return record

        // record.authors = 
        // record.tags =
        // record.series =

        // const extra = this.recordDao.queryRecordExtraByRecordId(id)
        // if (extra) {
        //     record.intro = extra.intro
        //     record.info = extra.info
        // }


        return record
    }

    public queryRecordRecmds(options: DTO.QueryRecordRecommendationsOptions) {
    }

    private generateFilters(input: boolean[]): string[] {
        const key = input.toString()
        if (this.infoStatusFilterMap.has(key)) {
            return this.infoStatusFilterMap.get(key) as string[]
        }

        const result: string[] = []
        const current: string[] = new Array(input.length)
        this.generateFilter(input, 0, current, result)
        this.infoStatusFilterMap.set(key, result)

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
        }
        else {
            current[index] = '0'
            this.generateFilter(input, index + 1, current, result)
            current[index] = '1'
            this.generateFilter(input, index + 1, current, result)
        }
    }

    public deleteRecycledRecord(recordIds: number[]): void {
    }

    public recycleRecord(recordIds: number[]): void {

    }

    public recoverRecycledRecord(recordIds: number[]): void {

    }

    public recycleRecordByAttribute(formData: DTO.DeleteRecordByAttributeForm): void {


    }
}


export default RecordService