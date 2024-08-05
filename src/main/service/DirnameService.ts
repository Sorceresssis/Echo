import nodePath from "path"
import { injectable, inject } from "inversify"
import InjectType from "../provider/injectType"
import { type LibraryEnv } from "../provider/container"
import fm, { isLegalAbsolutePath } from "../utils/FileManager"
import i18n from "../locale"
import { QueryDirnamesSortRule } from "../dao/DirnameDao"
import ResponseResult from "../pojo/ResponseResult"
import type DirnameDao from "../dao/DirnameDao"
import type RecordDao from "../dao/RecordDao"
import { DBPageQueryOptions, PagedResult } from "../pojo/page"

@injectable()
class DirnameService {
    public constructor(
        @inject(InjectType.LibraryEnv) private libEnv: LibraryEnv,
        @inject(InjectType.DirnameDao) private dirnameDao: DirnameDao,
        @inject(InjectType.RecordDao) private recordDao: RecordDao
    ) { }

    public queryDirnameDetails(options: RP.QueryDirnameDetailsOptions): PagedResult<VO.DirnameDetail> {
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

        const pagedResult = this.dirnameDao.queryDirnamesByKeyword(
            options.keyword.trim(),
            sortRule,
            new DBPageQueryOptions(options.pn, options.ps)
        ) as PagedResult<VO.DirnameDetail>

        pagedResult.results.forEach(row => {
            row.record_count = this.recordDao.getRecordCountByDirnameId(row.id)
        })

        return pagedResult
    }

    public editDirname(id: number, path: string): ResponseResult<void> {
        // 不是一个合法的绝对路径
        if (!fm.isLegalAbsolutePath(path)) return ResponseResult.error(i18n.global.t('invalidAbsolutePath'))

        path = nodePath.resolve(path)
        const existId = this.dirnameDao.queryDirnameIdByPath(path) // 查询是否已经存在

        this.libEnv.db.transactionExec(() => {
            if (existId && id !== existId) {
                this.recordDao.updateDirnameIdByDirnameId(id, existId)
                this.dirnameDao.deleteDirnameById(id)
            } else {
                this.dirnameDao.updateDirnamePathById(id, path)
            }
        })
        return ResponseResult.success()
    }

    public deleteDirname(id: number): void {
        this.libEnv.db.transactionExec(() => {
            this.dirnameDao.deleteDirnameById(id)
            this.recordDao.updateDirnameIdByDirnameId(id, 0) // 将dirname_id置为0
        })
    }

    /**
     * 以目录为基本单位匹配不是以字符为基本单位匹配 F:\foor\b 是无法与 F:\foor\b 匹配的
     * 一下是C:\foo\bar\baz\qux 的匹配表
     * C:\foo\bar\baz\q     不符合
     * C:\foo\bar\baz\qux   符合
     * C:\                  符合
     * C:                   非法路径
     * @param target
     * @param replace
     */
    public startsWithReplacePath(target: string, replace: string): ResponseResult<void> {
        if (!isLegalAbsolutePath(target) || !isLegalAbsolutePath(replace)) {
            return ResponseResult.error(i18n.global.t('invalidAbsolutePath'))
        }

        // path.normalize()会保留尾部的分隔符，path.resolve()不保留尾部的分割符
        const normalizeTarget = nodePath.normalize(target + nodePath.sep) // 带尾部分隔符的标准化路径,来体现以文件夹为基本单位匹配
        const normalizeReplace = nodePath.normalize(replace)

        // 注册数据库函数NEED_REPLACE_DP用于判断是否需要替换
        this.libEnv.db.function('NEED_REPLACE_DP', (source: string) => {
            // F:\foo\与F:\foo\a和F:\foo都匹配
            const normalizeSource = nodePath.normalize(source + nodePath.sep)
            return normalizeSource.startsWith(normalizeTarget) ? 1 : 0
        })

        this.libEnv.db.function('REPLACE_DP', (source: string) => {
            // 都是经过标准化的路径，用substring直接截取不会出现问题
            return nodePath.resolve(normalizeReplace, nodePath.normalize(source).substring(normalizeTarget.length))
        })

        this.libEnv.db.run('UPDATE dirname SET path = REPLACE_DP(path) WHERE NEED_REPLACE_DP(path);')

        return ResponseResult.success()
    }
}


export default DirnameService