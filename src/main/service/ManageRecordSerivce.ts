import LibraryDao from "../dao/libraryDao"
import path from "path"
import fm from "../util/FileManager"
import ImageService from "./ImageService"
import Result from "../util/Result"

export default class ManageRecordSerivce {
    private libraryId: number
    private libraryDao: LibraryDao

    constructor(libraryId: number) {
        this.libraryId = libraryId
        this.libraryDao = new LibraryDao(libraryId)
    }

    public edit(formData: DTO.EditRecordForm, options: DTO.EditRecordOptions): Result {
        // BUG undefined trim() 报错
        // 检查和处理数据 
        if (options.batch) {
            // 判断路径存在
            if (!fm.isFolderExists(formData.batchDir)) {
                return Result.error('folder not exists')
            }
        }
        else if (
            formData.dirname
            && formData.basename
            && !(fm.isLegalAbsolutePath(formData.dirname) && fm.isLegalFileName(formData.basename))
        ) {
            return Result.error('illegal path')
        }

        const record = {} as Entity.Record
        record.id = formData.id
        record.rate = formData.rate
        record.hyperlink = formData.hyperlink.trim() || null
        if (formData.cover !== formData.originCover) {
            // 删除旧
            if (formData.originCover.length) {
                fm.unlinkSync(formData.originCover)
            }
            // 保存新
            if (formData.cover.length) {
                const imageService = new ImageService(formData.cover, this.libraryId)
                record.cover = imageService.handleRecordCover() || null
            }
        }
        const recordExtra = {} as Entity.RecordExtra
        recordExtra.info = formData.info.trim()
        recordExtra.intro = formData.intro.trim()


        this.libraryDao.executeInTransaction(() => {
            // 把新增的标签，系列添加到数据库，并获取id
            const addTagIds = formData.addTags.map(title =>
                this.libraryDao.queryTagIdByTitle(title) || this.libraryDao.addTag(title)
            )
            const addSeriesIds = formData.addSeries.map(name =>
                this.libraryDao.querySeriesIdByName(name) || this.libraryDao.addSeries(name)
            )

            if (options.batch) {
                record.infoStatus = this.generateInfoStatus(record.cover, record.hyperlink, 'batch')
                formData.batchDir = path.resolve(formData.batchDir)
                record.dirnameId = this.libraryDao.queryDirnameIdByPath(formData.batchDir) || this.libraryDao.addDirname(formData.batchDir)

                const dirContents = fm.dirContentsWithType(formData.batchDir)
                dirContents.forEach(item => {
                    record.title = item.type === 'file' ? path.parse(item.name).name : item.name
                    record.basename = item.name
                    // 如果存在，跳过
                    if (options.distinct && this.libraryDao.queryRecordIdByTitle(record.title)) return

                    // 添加数据
                    recordExtra.id = record.id = this.libraryDao.addRecord(record)
                    this.libraryDao.addRecordExtra(recordExtra)
                    this.editRecordAttribute(
                        record.id,
                        formData.addAuthors,
                        formData.removeAuthors,
                        addTagIds,
                        formData.removeTags,
                        addSeriesIds,
                        formData.removeSeries
                    )
                })
            }
            else {
                record.title = formData.title.trim()
                record.basename = formData.basename.trim() || null
                record.infoStatus = this.generateInfoStatus(record.cover, record.hyperlink, record.basename)
                if (formData.dirname.trim()) {
                    formData.dirname = path.resolve(formData.dirname)
                    record.dirnameId = this.libraryDao.queryDirnameIdByPath(formData.dirname) || this.libraryDao.addDirname(formData.dirname)
                }
                else {
                    record.dirnameId = 0
                }

                // 判读是编辑还是新增
                if (record.id) {
                    this.libraryDao.updateRecord(record)
                    recordExtra.id = record.id
                    this.libraryDao.updateRecordExtra(recordExtra)
                }
                else {
                    recordExtra.id = record.id = this.libraryDao.addRecord(record)
                    this.libraryDao.addRecordExtra(recordExtra)
                }
                this.editRecordAttribute(
                    record.id,
                    formData.addAuthors,
                    formData.removeAuthors,
                    addTagIds,
                    formData.removeTags,
                    addSeriesIds,
                    formData.removeSeries
                )
            }
        })
        return Result.success()
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
        this.libraryDao.addRecordAuthor(recordId, addAuthorIds)
        this.libraryDao.deleteRecordAuthor(recordId, removeAuthorIds)

        this.libraryDao.addRecordTag(recordId, addTagIds)
        this.libraryDao.deleteRecordTag(recordId, removeTagIds)

        this.libraryDao.addRecordSeries(recordId, addSeriesIds)
        this.libraryDao.deleteRecordSeries(recordId, removeSeriesIds)
    }

    private generateInfoStatus(cover: string | null, hyperlink: string | null, basename: string | null) {
        return (cover ? '1' : '0') + (hyperlink ? '1' : '0') + (basename ? '1' : '0');
    }

    /**
     * 根据属性删除记录
     */
    public deleteByAttribute(formData: DTO.DeleteRecordByAttributeForm): void {
        // TODO 加入回收站不是真正删除
        // TODO 批量删除时， 如果，根据tag删除，只会删除tag的链接，其他的链接删除不了
        this.libraryDao.executeInTransaction(() => {
            formData.dirnamePath = formData.dirnamePath.trim()
            if (formData.dirnamePath.length) {
                const dirnameId = this.libraryDao.queryDirnameIdByPath(formData.dirnamePath)
                if (dirnameId) {
                    this.libraryDao.deleteRecordByDirnameId(dirnameId)
                    this.libraryDao.deleteDirname(dirnameId)
                }
            }
            formData.tagTitle = formData.tagTitle.trim()
            if (formData.tagTitle.length) {
                const tagId = this.libraryDao.queryTagIdByTitle(formData.tagTitle)
                if (tagId) {
                    this.libraryDao.deleteRecordByTagId(tagId)
                    this.libraryDao.deleteTag(tagId)
                }
            }
            formData.seriesName = formData.seriesName.trim()
            if (formData.seriesName.length) {
                const seriesId = this.libraryDao.querySeriesIdByName(formData.seriesName)
                if (seriesId) {
                    this.libraryDao.deleteRecordBySeriesId(seriesId)
                    this.libraryDao.deleteSeries(seriesId)
                }
            }
        })
    }

    public close() {
        this.libraryDao.destroy()
    }
}  