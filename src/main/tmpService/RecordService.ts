import path from "path"
import appConfig from "../app/config"
import { injectable, inject } from "inversify"
import DIContainer from "../DI/DIContainer"
import DI_TYPES, { DILibrary } from "../DI/DITypes"
import RecordDao from "../dao/RecordDao"
import RecordExtraDao from "../dao/RecordExtraDao"
import AuthorDao from "../dao/AuthorDao"
import RecordAuthorDao from "../dao/RecordAuthorDao"
import TagDao from "../dao/TagDao"
import RecordTagDao from "../dao/RecordTagDao"
import SeriesDao from "../dao/SeriesDao"
import RecordSeriesDao from "../dao/RecordSeriesDao"
import AuthorService from "./AuthorService"


@injectable()
class RecordService {
    private infoStatusFilterMap: Map<string, string[]>

    public constructor(
        @inject(DI_TYPES.Library) private library: DILibrary,
        @inject(DI_TYPES.RecordDao) private recordDao: RecordDao,
        @inject(DI_TYPES.RecordExtraDao) private recordExtraDao: RecordExtraDao,
        @inject(DI_TYPES.AuthorDao) private authorDao: AuthorDao,
        @inject(DI_TYPES.RecordTagDao) private recordTagDao: RecordTagDao,
        @inject(DI_TYPES.TagDao) private tagDao: TagDao,
        @inject(DI_TYPES.RecordSeriesDao) private recordSeriesDao: RecordSeriesDao,
        @inject(DI_TYPES.SeriesDao) private seriesDao: SeriesDao,
        @inject(DI_TYPES.RecordAuthorDao) private recordAuthorDao: RecordAuthorDao,
    ) {
        this.infoStatusFilterMap = new Map<string, string[]>()
    }

    public queryRecordDetail(id: number): VO.RecordDetail | undefined {
        const record = this.recordDao.queryRecordById(id) as VO.RecordDetail | undefined
        if (record === void 0) return record

        // record.authors = this.
        record.tags = this.tagDao.queryTagsByRecordId(id)
        // record.series = this.seriesDao.

        // const extra = this.recordDao.queryRecordExtraByRecordId(id)
        // if (extra) {
        //     record.intro = extra.intro
        //     record.info = extra.info
        // }


        return record
    }

    public queryRecordRecmds(options: DTO.QueryRecordRecommendationsOptions) {
    }

    // 查询作者的作品
    public queryAuthorMasterpieces(authorId: number): { id: number, title: string, cover: string | null }[] {
        const records = this.recordDao.queryRecordProfilesOfOrderRateByAuthor(authorId, 3)
        records.forEach(record => record.cover = this.getCoverFullPath(record.cover))
        return records
    }

    public deleteRecycledRecord(recordIds: number[]): void {
        recordIds.forEach(id => {
            this.library.dbConnection.transaction(() => {
                // if (this.recordDao)
            })
        })
    }

    public recycleRecord(recordIds: number[]): void {

    }

    public recoverRecycledRecord(recordIds: number[]): void {

    }

    public recycleRecordByAttribute(formData: DTO.DeleteRecordByAttributeForm): void {


    }

    public updateRecordTagAuthorSum(id: PrimaryKey, value?: string): void {
        if (value === void 0) { value = this.getTagAuthorSum(id) }
        this.recordDao.updateRecordTagAuthorSumById(id, value)
    }

    private getTagAuthorSum(id: PrimaryKey): string {
        const authors = this.authorDao.queryAuthorsByRecordId(id)
        const tags = this.tagDao.queryTagsByRecordId(id)
        return authors.map(author => author.name).concat(tags.map(tag => tag.title)).join(' ')
    }

    private getCoverFullPath(cover: string | null): string | null {
        return cover ? path.join(appConfig.getLibraryImagesDirPath(this.library.id), cover) : null
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
}


export default RecordService