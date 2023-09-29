import { injectable, inject, LazyServiceIdentifer } from "inversify"
import DIContainer from "../DI/DIContainer"
import DI_TYPES, { DILibrary } from "../DI/DITypes"
import TagDao, { QueryTagsSortRule } from "../dao/TagDao"
import RecordTagDao from "../dao/RecordTagDao"
import RecordService from "./RecordService"

@injectable()
class TagService {
    private library: DILibrary
    private tagDao: TagDao
    private recordTagDao: RecordTagDao
    private recordService: RecordService

    public constructor(
        @inject(DI_TYPES.Library) library: DILibrary,
        @inject(DI_TYPES.TagDao) tagDao: TagDao,
        @inject(DI_TYPES.RecordTagDao) recordTagDao: RecordTagDao,
        @inject(new LazyServiceIdentifer(() => DI_TYPES.RecordService)) recordService: RecordService,
    ) {
        this.library = library
        this.tagDao = tagDao
        this.recordTagDao = recordTagDao
        this.recordService = recordService
    }

    public queryTagDetails(options: DTO.QueryTagDetailsOptions): DTO.Page<VO.TagDetail> {
        const defaultSortRule: QueryTagsSortRule[] = [
            { field: 'title', order: 'ASC' },
            { field: 'id', order: 'DESC' },
        ]

        const sortRule: QueryTagsSortRule[] = []
        switch (options.sortField) {
            case 'title':
                sortRule.push({ field: 'title', order: options.order })
                break
            case 'time':
                sortRule.push({ field: 'id', order: options.order })
                break
            default:
                throw Error('invalid sort field')
        }
        defaultSortRule.forEach(rule => {
            if (rule.field !== sortRule[0].field) {
                sortRule.push(rule)
            }
        })

        const page = this.tagDao.queryTagsByKeyword(
            options.keyword.trim(),
            sortRule,
            (options.pn - 1) * options.ps,
            options.ps,
        ) as DTO.Page<VO.TagDetail>

        page.rows.forEach(row => {
            row.recordCount = this.recordTagDao.queryCountOfRecordsByTagId(row.id)
        })

        return page
    }

    public editTag(id: number, title: string): void {
        title = title.trim()
        if (title === '') throw Error('tag can not be empty')

        // 查询是否已经存在
        const existId = this.tagDao.queryTagIdByTitle(title)

        this.library.dbConnection.transaction(() => {
            // id !== existId 的判断是为了防止修改的值和原值一样，导致被删除
            if (existId && id !== existId) {
                // 如果已经存在，就把record_tag中的tag_id重定向到existId
                this.recordTagDao.updateTagIdOfRecordTag(existId, id)
                this.tagDao.deleteTagById(id)
                this.updateRecordTagAuthorSumOfTag(existId) // 更新冗余字段
            } else {
                this.tagDao.updateTagTitle(id, title) // 如果不存在，就直接更新
                this.updateRecordTagAuthorSumOfTag(id) // 更新冗余字段
            }
        })
    }

    public deleteTag(id: number) {
        this.library.dbConnection.transaction(() => {
            this.tagDao.deleteTagById(id)
            this.updateRecordTagAuthorSumOfTag(id)
            this.recordTagDao.deleteRecordTagByTagId(id)
        })
    }

    private updateRecordTagAuthorSumOfTag(tagId: PrimaryKey): void {
        const rowCount = 150
        let recordIds = this.recordTagDao.queryRecordIdsByTagId(tagId, 0, rowCount)
        while (recordIds.length) {
            recordIds.forEach(id => this.recordService.updateRecordTagAuthorSum(id))

            if (recordIds.length < rowCount) break
            recordIds = this.recordTagDao.queryRecordIdsByTagId(tagId, 0, rowCount)
        }
    }
}


export default TagService