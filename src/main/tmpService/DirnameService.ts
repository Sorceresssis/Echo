import nodePath from "path"
import fm, { isLegalAbsolutePath } from "../util/FileManager"
import Result from "../util/Result"
import { injectable, inject } from "inversify"
import DI_TYPES, { DILibrary } from "../DI/DITypes"
import DirnameDao, { QueryDirnamesSortRule } from "../dao/DirnameDao"
import RecordDao from "../dao/RecordDao"

@injectable()
class DirnameService {
    public constructor(
        @inject(DI_TYPES.Library) private library: DILibrary,
        @inject(DI_TYPES.DirnameDao) private dirnameDao: DirnameDao,
        @inject(DI_TYPES.RecordDao) private recordDao: RecordDao
    ) { }

    public queryDirnameDetails(options: DTO.QueryDirnameDetailsOptions): DTO.Page<VO.DirnameDetail> {
        const defaultSortRule: QueryDirnamesSortRule[] = [
            { field: 'path', order: 'ASC' },
            { field: 'id', order: 'DESC' },
        ]

        const sortRule: QueryDirnamesSortRule[] = []
        switch (options.sortField) {
            case 'path':
                sortRule.push({ field: 'path', order: options.order })
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

        const page = this.dirnameDao.queryDirnamesByKeyword(
            options.keyword.trim(),
            sortRule,
            (options.pn - 1) * options.ps,
            options.ps
        ) as DTO.Page<VO.DirnameDetail>

        page.rows.forEach(row => {
            row.recordCount = this.recordDao.queryCountOfRecordsByDirnameId(row.id)
        })

        return page
    }

    public editDirname(id: number, path: string): Result {
        // 不是一个合法的绝对路径
        if (!fm.isLegalAbsolutePath(path)) return Result.error('invalid absolute path')

        path = nodePath.resolve(path)
        const existId = this.dirnameDao.queryDirnameIdByPath(path) // 查询是否已经存在

        this.library.dbConnection.transaction(() => {
            if (existId && id !== existId) {
                this.recordDao.updateRecordDirnameIdByDirnameId(id, existId)
                this.dirnameDao.deleteDirnameById(id)
            } else {
                this.dirnameDao.updateDirnamePathById(id, path)
            }
        })
        return Result.success()
    }

    public deleteDirname(id: number): void {
        this.library.dbConnection.transaction(() => {
            this.dirnameDao.deleteDirnameById(id)
            this.recordDao.updateRecordDirnameIdByDirnameId(id, 0) // 将dirname_id置为0
        })
    }

    public startsWithReplacePath(target: string, replace: string): Result {
        if (isLegalAbsolutePath(target) && isLegalAbsolutePath(replace)) {

        }
        return Result.error('路径不合法')
    }
}


export default DirnameService