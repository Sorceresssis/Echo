import { injectable, inject } from "inversify"
import InjectType from "../provider/injectType"
import { type LibraryEnv } from "../provider/container"
import DynamicSqlBuilder, { SortRule } from "../util/DynamicSqlBuilder"

export type QueryDirnamesSortRule = {
    field: 'path' | 'id',
    order: 'ASC' | 'DESC'
}

@injectable()
class DirnameDao {
    public constructor(
        @inject(InjectType.LibraryEnv) private libEnv: LibraryEnv
    ) { }

    public queryDirnameIdByPath(path: string): number | undefined {
        return this.libEnv.db.prepare('SELECT id FROM dirname WHERE path = ?;').pluck().get(path) as number | undefined
    }

    public queryDirnamesByKeyword(
        keyword: string,
        sort: QueryDirnamesSortRule[],
        offset: number,
        rowCount: number
    ): DAO.AllQueryResult<Domain.Dirname> {
        const sql = new DynamicSqlBuilder()
        const sortRule: SortRule[] = []

        sql.append('SELECT COUNT(id) OVER () AS total_count, id, path FROM dirname')
        if (keyword !== '') {
            this.libEnv.db.registerSQLFnRegexp(keyword)
            sql.append('WHERE REGEXP(path) > 0')
            sortRule.push({ field: 'REGEXP(path)', order: 'DESC' })
        }
        sortRule.push(...sort)
        sql.appendOrderSQL(sortRule).appendLimitSQL(offset, rowCount)

        const rows = this.libEnv.db.all(sql.getSql(), ...sql.getParams())
        const total = rows.length > 0 ? rows[0].total_count : 0
        rows.forEach(row => { delete row.total_count })

        return {
            total: total,
            rows: rows
        }
    }

    public updateDirnamePathById(id: PrimaryKey, path: string): number {
        return this.libEnv.db.run("UPDATE dirname SET path = ? WHERE id = ?;", path, id).changes
    }

    public insertDirname(path: string): PrimaryKey {
        return this.libEnv.db.run("INSERT INTO dirname(path) VALUES(?);", path).lastInsertRowid
    }

    public deleteDirnameById(id: PrimaryKey): number {
        return this.libEnv.db.run('DELETE FROM dirname WHERE id = ?;', id).changes
    }
}


export default DirnameDao