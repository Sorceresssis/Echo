import path from "path"
import appConfig from "../app/config"
import fm from "../util/FileManager"
import { injectable, inject } from "inversify"
import DIContainer from "../DI/DIContainer"
import DI_TYPES, { type DILibrary } from "../DI/DITypes"
import i18n from "../locale"
import Result from "../util/Result"
import ImageService from "../service/ImageService"
import RecordDao, { QueryRecordsSortRule } from "../dao/RecordDao"
import RecordExtraDao from "../dao/RecordExtraDao"
import DirnameDao from "../dao/DirnameDao"
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
        @inject(DI_TYPES.DirnameDao) private dirnameDao: DirnameDao,
        @inject(DI_TYPES.AuthorDao) private authorDao: AuthorDao,
        @inject(DI_TYPES.RecordTagDao) private recordTagDao: RecordTagDao,
        @inject(DI_TYPES.TagDao) private tagDao: TagDao,
        @inject(DI_TYPES.RecordSeriesDao) private recordSeriesDao: RecordSeriesDao,
        @inject(DI_TYPES.SeriesDao) private seriesDao: SeriesDao,
        @inject(DI_TYPES.RecordAuthorDao) private recordAuthorDao: RecordAuthorDao,
    ) {
        this.infoStatusFilterMap = new Map<string, string[]>()
    }

    private getCoverFullPath(cover: string | null): string | null {
        return cover ? path.join(appConfig.getLibraryImagesDirPath(this.library.id), cover) : null
    }

    public queryRecordDetail(id: number): VO.RecordDetail | undefined {
        const record = this.recordDao.queryRecordById(id) as VO.RecordDetail | undefined
        if (record === void 0) return record

        record.cover = this.getCoverFullPath(record.cover)
        record.resourcePath = record.dirname && record.basename ? path.join(record.dirname, record.basename) : null
        record.authors = DIContainer.get<AuthorService>(DI_TYPES.AuthorService).queryAuthorsByRecordId(id)
        record.tags = this.tagDao.queryTagsByRecordId(id)
        record.series = this.seriesDao.querySeriesByRecordId(id)

        const extra = this.recordExtraDao.queryRecordExtraByRecordId(id)
        record.intro = extra?.intro || ''
        record.info = extra?.info || ''

        return record
    }

    public queryRecordRecmds(options: DTO.QueryRecordRecommendationsOptions): DTO.Page<VO.RecordRecommendation> {
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
                throw Error('invalid sort field')
        }
        defaultSortRule.forEach((rule) => {
            if (rule.field !== sortRule[0].field) {
                sortRule.push(rule)
            }
        })
        const page = this.recordDao.queryRecordsByKeyword(
            options.keyword.trim(),
            sortRule,
            this.generateFilters(options.filters),
            (options.pn - 1) * options.ps,
            options.ps,
            {
                type: options.type,
                authorId: options.authorId,
            },
        ) as DTO.Page<any>

        // 添加作者和标签
        page.rows.forEach(row => {
            row.cover = this.getCoverFullPath(row.cover)
            row.resourcePath = row.dirname && row.basename ? path.join(row.dirname, row.basename) : null
            delete row.dirname
            delete row.basename
            row.authors = DIContainer.get<AuthorService>(DI_TYPES.AuthorService).queryAuthorsByRecordId(row.id)
            row.tags = this.tagDao.queryTagsByRecordId(row.id)
        })

        return page
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

    // 查询作者的作品
    public queryAuthorMasterpieces(authorId: number): { id: number, title: string, cover: string | null }[] {
        const records = this.recordDao.queryRecordProfilesOfOrderRateByAuthor(authorId, 3)
        records.forEach(record => record.cover = this.getCoverFullPath(record.cover))
        return records
    }

    // 根据属性回收
    public recycleRecordByAttribute(formData: DTO.DeleteRecordByAttributeForm): void {
        this.library.dbConnection.transaction(() => {
            const dirnamePath = formData.dirnamePath.trim()
            const tagTitle = formData.tagTitle.trim()
            const seriesName = formData.seriesName.trim()

            let pn = 0
            const rowCount = 200
            let recordIds: number[]

            if (dirnamePath.length) {
                const dirnameId = this.dirnameDao.queryDirnameIdByPath(formData.dirnamePath)
                if (dirnameId) {
                    pn = 0
                    do {
                        recordIds = this.recordDao.queryRecordIdsByDirnameId(dirnameId, pn++ * rowCount, rowCount)
                        this.recordDao.updateRecordRecycledByIds(recordIds, 1)
                    } while (recordIds.length === rowCount)
                }
            }

            if (tagTitle.length) {
                const tagId = this.tagDao.queryTagIdByTitle(formData.tagTitle)
                if (tagId) {
                    pn = 0
                    do {
                        recordIds = this.recordTagDao.queryRecordIdsByTagId(tagId, pn++ * rowCount, rowCount)
                        this.recordDao.updateRecordRecycledByIds(recordIds, 1)
                    } while (recordIds.length === rowCount)
                }
            }

            if (seriesName.length) {
                const seriesId = this.seriesDao.querySeriesIdByName(formData.seriesName)
                if (seriesId) {
                    pn = 0
                    do {
                        recordIds = this.recordSeriesDao.queryRecordIdsBySeriesId(seriesId, pn++ * rowCount, rowCount)
                        this.recordDao.updateRecordRecycledByIds(recordIds, 1)
                    } while (recordIds.length === rowCount)
                }
            }
        })
    }

    public batchProcessing(type: DTO.RecordBatchProcessingType, recordIds: number[]) {
        switch (type) {
            case 'recycle':
                this.recycleRecord(recordIds)
                break
            case 'recover':
                this.recoverRecycledRecord(recordIds)
                break
            case 'delete_recycled':
                this.deleteRecycledRecord(recordIds)
                break
            case 'delete_recycled_all':
                this.deleteAllRecycledRecord()
                break
            default:
                throw Error('invalid type')
        }
    }

    public recycleRecord(recordIds: number[]): void {
        this.recordDao.updateRecordRecycledByIds(recordIds, 1)
    }

    public recoverRecycledRecord(recordIds: number[]): void {
        this.recordDao.updateRecordRecycledByIds(recordIds, 0)
    }

    public deleteRecycledRecord(recordIds: number[]): void {
        recordIds.forEach(id => this.library.dbConnection.transaction(() => {
            const record = this.recordDao.queryRecordById(id)
            if (record && this.recordDao.deleteRecordOfRecycledById(id) > 0) {
                // 如果删除record不成功，说明不存在或者没有被回收
                this.recordExtraDao.deleteRecordExtraById(id) // 删除extra
                this.recordAuthorDao.deleteRecordAuthorByRecordId(id) // author链接
                this.recordTagDao.deleteRecordTagByRecordId(id) // tag链接
                this.recordSeriesDao.deleteRecordSeriesByRecordId(id) // series链接

                //  删除图片
                try {
                    const p = this.getCoverFullPath(record.cover)
                    if (p) { fm.unlinkIfExistsSync(p) }
                } catch { }
            }
        }))
    }

    public deleteAllRecycledRecord(): void {
        const rowCount = 200
        let recordIds: number[]
        do {
            recordIds = this.recordDao.queryRecordIdsByRecycled(1, 0, rowCount)
            this.deleteRecycledRecord(recordIds)
        } while (rowCount === recordIds.length)
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

    private editRecordAttribute(
        recordId: PrimaryKey,
        addAuthorIds: PrimaryKey[],
        removeAuthorIds: PrimaryKey[],
        addTagIds: PrimaryKey[],
        removeTagIds: PrimaryKey[],
        addSeriesIds: PrimaryKey[],
        removeSeriesIds: PrimaryKey[],
    ) {
        this.recordAuthorDao.insertRecordAuthorByRecordIdAuthorIds(recordId, addAuthorIds)
        this.recordAuthorDao.deleteRecordAuthorByRecordIdAuthorIds(recordId, removeAuthorIds)

        this.recordTagDao.insertRecordTagByRecordIdTagIds(recordId, addTagIds)
        this.recordTagDao.deleteRecordTagByRecordIdTagIds(recordId, removeTagIds)

        this.recordSeriesDao.insertRecordSeriesByRecordIdSeriesIds(recordId, addSeriesIds)
        this.recordSeriesDao.deleteRecordSeriesByRecordIdSeriesIds(recordId, removeSeriesIds)
    }

    private generateInfoStatus(cover: string | null, hyperlink: string | null, basename: string | null) {
        return (cover ? '1' : '0') + (hyperlink ? '1' : '0') + (basename ? '1' : '0');
    }

    private handleCover(newImg: string, originImg: string): string | null {
        // 图片没有改变，返回原来的图片名
        if (newImg === originImg) return path.basename(newImg) || null

        // 图片改变了
        // 删除旧的图片
        if (originImg.length) {
            // 删除的过程中可能会出错(没有权限,文件被占用等)
            try { fm.unlinkIfExistsSync(originImg) } catch { }
        }
        // 保存新的图片, 返回新的图片名, 如果失败直接提醒用户原因，让用户解决问题
        if (newImg.length) {
            const imageService = new ImageService(this.library.id, newImg)
            return imageService.handleRecordCover() || null
        }

        return null
    }

    public editRecord(formData: DTO.EditRecordForm): Result {
        formData.dirname = formData.dirname.trim()
        formData.basename = formData.basename.trim()
        if ((formData.dirname !== '' && !fm.isLegalAbsolutePath(formData.dirname))
            || (formData.basename !== '' && !fm.isLegalFileName(formData.basename))) {
            return Result.error(i18n.global.t('resourcePathIllegal'))
        }

        const record = {} as Entity.Record
        record.id = formData.id
        record.title = formData.title.trim()
        record.rate = formData.rate
        record.cover = this.handleCover(formData.cover, formData.originCover)
        record.hyperlink = formData.hyperlink.trim() || null
        record.basename = formData.basename || null
        record.infoStatus = this.generateInfoStatus(record.cover, record.hyperlink, record.basename)
        record.tagAuthorSum = null

        const recordExtra: Entity.RecordExtra = {
            id: formData.id,
            info: formData.info,
            intro: formData.intro
        }

        this.library.dbConnection.transaction(() => {
            // 如果dirname存在返回id，不存在插入dirname表返回id
            if (formData.dirname === '') {
                record.dirnameId = 0
            } else {
                formData.dirname = path.resolve(formData.dirname)
                record.dirnameId = this.dirnameDao.queryDirnameIdByPath(formData.dirname) || this.dirnameDao.insertDirname(formData.dirname)
            }

            // record 和 recordExtra 表
            if (record.id === 0) {
                recordExtra.id = record.id = this.recordDao.insertRecord(record)
                this.recordExtraDao.insetRecordExtra(recordExtra)
            } else {
                this.recordDao.updateRecord(record)
                this.recordExtraDao.updateRecordExtra(recordExtra)
            }

            // tag, author, series 表
            const addTagIds = formData.addTags.map(
                title => this.tagDao.queryTagIdByTitle(title) || this.tagDao.insertTag(title)
            )
            const addSeriesIds = formData.addSeries.map(
                name => this.seriesDao.querySeriesIdByName(name) || this.seriesDao.insertSeries(name)
            )
            this.editRecordAttribute(
                record.id,
                formData.addAuthors,
                formData.removeAuthors,
                addTagIds,
                formData.removeTags,
                addSeriesIds,
                formData.removeSeries
            )

            // 等待record的属性都设置完毕,开始更新冗余字段tagAuthorSum
            this.updateRecordTagAuthorSum(record.id)
        })

        return Result.success()
    }

    public addBatchRecord(formData: DTO.EditRecordForm, distinct: boolean): Result {
        if (!fm.isFolderExists(formData.batchDir)) {
            return Result.error(i18n.global.t('folderNotExists')) // 文件夹不存在, 直接返回
        }

        // 准备数据
        const record = {} as Entity.Record
        record.id = formData.id
        record.rate = formData.rate
        record.hyperlink = formData.hyperlink.trim() || null
        record.cover = this.handleCover(formData.cover, formData.originCover)
        record.infoStatus = this.generateInfoStatus(record.cover, record.hyperlink, 'batch')
        record.tagAuthorSum = null

        const recordExtra: Entity.RecordExtra = {
            id: formData.id,
            info: formData.info,
            intro: formData.intro
        }

        this.library.dbConnection.transaction(() => {
            // 插入tag, series, author
            const addTagIds = formData.addTags.map(
                title => this.tagDao.queryTagIdByTitle(title) || this.tagDao.insertTag(title)
            )
            const addSeriesIds = formData.addSeries.map(
                name => this.seriesDao.querySeriesIdByName(name) || this.seriesDao.insertSeries(name)
            )

            formData.batchDir = path.resolve(formData.batchDir)
            record.dirnameId = this.dirnameDao.queryDirnameIdByPath(formData.batchDir) || this.dirnameDao.insertDirname(formData.batchDir)

            const dirContents = fm.dirContentsWithType(formData.batchDir)
            dirContents.forEach((item, index) => {
                // 如果是文件，去掉后缀
                record.title = item.type === 'file' ? path.parse(item.name).name : item.name
                // 如果存在，跳过
                if (distinct && this.recordDao.queryRecordIdByTitle(record.title)) return
                record.basename = item.name
                // 向record和recordExtra表插入数据
                recordExtra.id = record.id = this.recordDao.insertRecord(record)
                this.recordExtraDao.insetRecordExtra(recordExtra)

                // 得到了record的id，开始插入把关系链接起来
                this.editRecordAttribute(
                    record.id,
                    formData.addAuthors,
                    formData.removeAuthors,
                    addTagIds,
                    formData.removeTags,
                    addSeriesIds,
                    formData.removeSeries
                )

                // 因为是批量添加，所有的record的tagAuthorSum都是一样的，所以只需要在第一个record的时候更新一次
                if (index === 0) {
                    record.tagAuthorSum = this.getTagAuthorSum(record.id)
                    this.updateRecordTagAuthorSum(record.id, record.tagAuthorSum)
                }
            })
        })
        return Result.success()
    }
}


export default RecordService