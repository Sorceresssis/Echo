import path from "path"
import appConfig from "../app/config"
import { injectable, inject } from "inversify"
import DI_TYPES, { DILibrary } from "../DI/DITypes"
import RecordDao from "../dao/RecordDao"
import AuthorDao from "../dao/AuthorDao"
import TagDao from "../dao/TagDao"
import SeriesDao from "../dao/SeriesDao"


@injectable()
class RecordService {
    private infoStatusFilterMap: Map<string, string[]>

    private library: DILibrary
    private recordDao: RecordDao
    private authorDao: AuthorDao
    private tagDao: TagDao
    private seriesDao: SeriesDao

    public constructor(
        @inject(DI_TYPES.Library) library: DILibrary,
        @inject(DI_TYPES.RecordDao) recordDao: RecordDao,
        @inject(DI_TYPES.AuthorDao) authorDao: AuthorDao,
        @inject(DI_TYPES.TagDao) tagDao: TagDao,
        @inject(DI_TYPES.SeriesDao) seriesDao: SeriesDao,
    ) {
        this.infoStatusFilterMap = new Map<string, string[]>()

        this.library = library
        this.recordDao = recordDao
        this.authorDao = authorDao
        this.tagDao = tagDao
        this.seriesDao = seriesDao
    }

    public queryRecordDetail(id: number): VO.RecordDetail | undefined {
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

    // 查询作者的作品
    public queryAuthorMasterpieces(authorId: number): { id: number, title: string, cover: string | null }[] {
        const records = this.recordDao.queryRecordProfilesOfOrderRateByAuthor(authorId, 3)
        records.forEach(record => record.cover = this.getCoverFullPath(record.cover))
        return records
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

    public deleteRecycledRecord(recordIds: number[]): void {
    }

    public recycleRecord(recordIds: number[]): void {

    }

    public recoverRecycledRecord(recordIds: number[]): void {

    }

    public recycleRecordByAttribute(formData: DTO.DeleteRecordByAttributeForm): void {


    }

    public updateRecordTagAuthorSum(id: PrimaryKey, value?: string): void {
        if (value === void 0) { value = this.getTagAuthorSum(id) }
        this.recordDao.updateRecordTagAuthorSum(id, value)
    }

    public getTagAuthorSum(id: PrimaryKey): string {
        const authors = this.authorDao.queryAuthorsByRecordId(id)
        const tags = this.tagDao.queryTagsByRecordId(id)
        return authors.map(author => author.name).concat(tags.map(tag => tag.title)).join(' ')
    }
}


export default RecordService