import path from "path"
import { error } from "console"
import fm from "../util/FileManager"
import LibraryDao, { QueryDirnamesSortRule } from "../dao/libraryDBDao"

export default class AuthorService {
    private libraryDao: LibraryDao

    constructor(libraryId: number) {
        this.libraryDao = new LibraryDao(libraryId)
    }

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
                throw error('invalid sort field')
        }
        defaultSortRule.forEach((rule) => {
            if (rule.field !== sortRule[0].field) {
                sortRule.push(rule)
            }
        })

        const dirnames = this.libraryDao.queryDirnamesByKeyword(
            options.keyword.trim(),
            sortRule,
            (options.pn - 1) * options.ps,
            options.ps
        ) as DTO.Page<VO.DirnameDetail>
        dirnames.rows.forEach((dirname) => {
            dirname.recordCount = this.libraryDao.queryCountOfRecordsByDirnameId(dirname.id)
        })
        return dirnames
    }

    public deleteDirname(id: number) {
        this.libraryDao.executeInTransaction(() => {
            this.libraryDao.deleteDirname(id)
            this.libraryDao.updateRecordDirnameIdToZeroByDirnameId(id)
        })
    }

    public editDirname(id: number, newValue: string) {
        if (!fm.isLegalAbsolutePath(newValue)) return false

        const newDirname = path.resolve(newValue)
        const existId = this.libraryDao.queryDirnameIdByPath(newDirname) // 查询是否已经存在

        if (existId && id !== existId) {
            this.libraryDao.executeInTransaction(() => {
                this.libraryDao.updateRecordDirnameId(existId, id)
                this.libraryDao.deleteDirname(id)
            })
        }
        else {
            this.libraryDao.updateDirname(id, newDirname)
        }
        return true
    }

    public close() {
        this.libraryDao.destroy()
    }
}