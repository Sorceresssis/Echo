import LibraryDao from "../dao/libraryDBDao"
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

    private handleCover(newCover: string, originCover: string): string | null {
        if (newCover !== originCover) {
            try {
                if (originCover.length) {       // 删除旧的图片, 但是删除的过程中可能会出错(没有权限,文件被占用等)
                    fm.unlinkIfExistsSync(originCover)
                }
                if (newCover.length) {          // 保存新的图片
                    const imageService = new ImageService(newCover)
                    return imageService.handleRecordCover() || null
                }
                return null
            } catch {
                return null
            }
        }
        else {
            return path.basename(newCover) || null // 要取basename, 因为会把绝对路径保存到数据库 
        }
    }

    public static getTagAuthorSum(dao: LibraryDao, recordId: PrimaryKey) {
        const authors = dao.queryAuthorsByRecordId(recordId, false)
        const tags = dao.queryTagsByRecordId(recordId)
        return tags.map(tag => tag.title).concat(authors.map(author => author.name)).join(' ')
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

    public edit(formData: DTO.EditRecordForm): Result {
        if ((formData.dirname.trim() !== '' && !fm.isLegalAbsolutePath(formData.dirname))
            || (formData.basename.trim() !== '' && !fm.isLegalFileName(formData.basename))) {
            return Result.error('illegal path')
        }

        const record = {} as Entity.Record
        record.id = formData.id
        record.title = formData.title.trim()
        record.rate = formData.rate
        record.cover = this.handleCover(formData.cover, formData.originCover)
        record.hyperlink = formData.hyperlink.trim() || null
        record.basename = formData.basename.trim() || null
        record.infoStatus = this.generateInfoStatus(record.cover, record.hyperlink, record.basename)
        record.tagAuthorSum = null

        const recordExtra = {} as Entity.RecordExtra
        recordExtra.info = formData.info.trim()
        recordExtra.intro = formData.intro.trim()

        this.libraryDao.executeInTransaction(() => {
            // record 和 recordExtra 表
            if (formData.dirname.trim() !== '') {
                formData.dirname = path.resolve(formData.dirname)
                record.dirnameId = this.libraryDao.queryDirnameIdByPath(formData.dirname) || this.libraryDao.addDirname(formData.dirname)
            }
            else {
                record.dirnameId = 0
            }
            if (record.id === 0) {
                recordExtra.id = record.id = this.libraryDao.addRecord(record)
                this.libraryDao.addRecordExtra(recordExtra)
            }
            else {
                recordExtra.id = record.id
                this.libraryDao.updateRecord(record)
                this.libraryDao.updateRecordExtra(recordExtra)
            }

            // tag, author, series 表
            const addTagIds = formData.addTags.map(
                title => this.libraryDao.queryTagIdByTitle(title) || this.libraryDao.addTag(title)
            )
            const addSeriesIds = formData.addSeries.map(
                name => this.libraryDao.querySeriesIdByName(name) || this.libraryDao.addSeries(name)
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
            this.libraryDao.updateRecordTagAuthorSum(record.id, ManageRecordSerivce.getTagAuthorSum(this.libraryDao, record.id))
        })

        return Result.success()
    }

    public addBatch(formData: DTO.EditRecordForm, distinct: boolean): Result {
        if (!fm.isFolderExists(formData.batchDir)) {
            return Result.error('folder not exists')
        }

        const record = {} as Entity.Record
        record.id = formData.id
        record.rate = formData.rate
        record.hyperlink = formData.hyperlink.trim() || null
        record.cover = this.handleCover(formData.cover, formData.originCover)
        record.infoStatus = this.generateInfoStatus(record.cover, record.hyperlink, 'batch')

        const recordExtra = {} as Entity.RecordExtra
        recordExtra.info = formData.info.trim()
        recordExtra.intro = formData.intro.trim()

        this.libraryDao.executeInTransaction(() => {
            const addTagIds = formData.addTags.map(
                title => this.libraryDao.queryTagIdByTitle(title) || this.libraryDao.addTag(title)
            )
            const addSeriesIds = formData.addSeries.map(
                name => this.libraryDao.querySeriesIdByName(name) || this.libraryDao.addSeries(name)
            )

            record.tagAuthorSum = null
            formData.batchDir = path.resolve(formData.batchDir)
            record.dirnameId = this.libraryDao.queryDirnameIdByPath(formData.batchDir) || this.libraryDao.addDirname(formData.batchDir)
            const dirContents = fm.dirContentsWithType(formData.batchDir)
            dirContents.forEach((item, index) => {
                record.title = item.type === 'file' ? path.parse(item.name).name : item.name
                if (distinct && this.libraryDao.queryRecordIdByTitle(record.title)) return // 如果存在，跳过
                record.basename = item.name
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

                if (index === 0) {
                    record.tagAuthorSum = ManageRecordSerivce.getTagAuthorSum(this.libraryDao, record.id)
                    this.libraryDao.updateRecordTagAuthorSum(record.id, record.tagAuthorSum)
                }
            })
        })
        return Result.success()
    }

    public close() {
        this.libraryDao.destroy()
    }
}  