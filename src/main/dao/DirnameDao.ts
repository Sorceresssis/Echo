import { injectable, inject } from "inversify"
import DI_TYPES, { type DILibrary } from "../DI/DITypes"
import DynamicSqlBuilder, { SortRule } from "../util/DynamicSqlBuilder"

export type QueryDirnamesSortRule = {
    field: 'path' | 'id',
    order: 'ASC' | 'DESC'
}

@injectable()
class DirnameDao {
    private lib: DILibrary

    public constructor(@inject(DI_TYPES.Library) lib: DILibrary) {
        this.lib = lib
    }

    public queryDirnameIdByPath(path: string): number | undefined {
        return this.lib.dbConnection.prepare('SELECT id FROM dirname WHERE path = ?;').pluck().get(path) as number | undefined
    }

    public queryDirnamesByKeyword(
        keyword: string,
        sort: QueryDirnamesSortRule[],
        offset: number,
        rowCount: number
    ): Dao.Page<Domain.Dirname> {
        const sql = new DynamicSqlBuilder()
        const sortRule: SortRule[] = []

        sql.append('SELECT COUNT(id) OVER () AS total_count, id, path FROM dirname')
        if (keyword !== '') {
            this.lib.dbConnection.registerSQLFnRegexp(keyword)
            sql.append('WHERE REGEXP(path) > 0')
            sortRule.push({ field: 'REGEXP(path)', order: 'DESC' })
        }
        sortRule.push(...sort)
        sql.appendOrderSQL(sortRule).appendLimitSQL(offset, rowCount)

        const rows = this.lib.dbConnection.all(sql.getSql(), ...sql.getParams())
        const total = rows.length > 0 ? rows[0].total_count : 0
        rows.forEach(row => { delete row.total_count })

        return {
            total: total,
            rows: rows
        }
    }

    public updateDirnamePathById(id: PrimaryKey, path: string): number {
        return this.lib.dbConnection.run("UPDATE dirname SET path = ? WHERE id = ?;", path, id).changes
    }

    public insertDirname(path: string): PrimaryKey {
        return this.lib.dbConnection.run("INSERT INTO dirname(path) VALUES(?);", path).lastInsertRowid
    }

    public deleteDirnameById(id: PrimaryKey): number {
        return this.lib.dbConnection.run('DELETE FROM dirname WHERE id = ?;', id).changes
    }
}


export default DirnameDao