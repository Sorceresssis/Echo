import { injectable, inject } from "inversify"
import InjectType from "../provider/injectType"
import { type LibraryEnv } from "../provider/container"
import DynamicSqlBuilder, { SortRule } from "../utils/DynamicSqlBuilder"
import { type DBPageQueryOptions, PagedResult } from "../pojo/page"

export type QueryTagsSortRule = {
    field: 'title' | 'id',
    order: 'ASC' | 'DESC'
}

@injectable()
class TagDao {
    public constructor(
        @inject(InjectType.LibraryEnv) private libEnv: LibraryEnv
    ) { }

    public queryTagIdByTitle(title: string): Entity.PK | undefined {
        const sql = "SELECT id FROM tag WHERE title = ?;"
        return this.libEnv.db.prepare(sql).pluck().get(title) as Entity.PK
    }

    public queryTagsByRecordId(recordId: Entity.PK): Entity.Tag[] {
        const sql = `
            SELECT t.id, t.title 
            FROM tag t 
                JOIN record_tag rt ON t.id = rt.tag_id 
            WHERE rt.record_id = ? 
            ORDER BY rt.id;
        `
        return this.libEnv.db.all(sql, recordId)
    }

    public queryTagsByKeyword(
        keyword: string,
        sort: QueryTagsSortRule[],
        pageOptions: DBPageQueryOptions
    ): PagedResult<Entity.Tag> {
        const sql = new DynamicSqlBuilder()
        const sortRule: SortRule[] = []

        sql.append('SELECT COUNT(id) OVER () AS total_count, id, title FROM tag')
        if (keyword !== '') {
            this.libEnv.db.registerSQLFnRegexp(keyword)
            sql.append('WHERE REGEXP(title) > 0')
            sortRule.push({ field: 'REGEXP(title)', order: 'DESC' })
        }
        sortRule.push(...sort)
        sql.appendOrderSQL(sortRule).appendLimitSQL(pageOptions.pn, pageOptions.ps)

        const rows = this.libEnv.db.all<any[], Entity.Tag & { total_count?: number }>(sql.getSql(), ...sql.getParams())
        const totalCount = rows[0]?.total_count || 0
        rows.forEach(row => { delete row.total_count })

        return new PagedResult(rows, pageOptions.pn, pageOptions.ps, totalCount)
    }

    public update(id: Entity.PK, title: string): number {
        const sql = "UPDATE tag SET title = ? WHERE id = ?;"
        return this.libEnv.db.run(sql, title, id).changes
    }

    public insertTag(title: string): Entity.PK {
        const sql = "INSERT INTO tag(title) VALUES(?);"
        return this.libEnv.db.run(sql, title).lastInsertRowid as Entity.PK
    }

    public deleteTagById(id: Entity.PK): number {
        const sql = "DELETE FROM tag WHERE id = ?;"
        return this.libEnv.db.run(sql, id).changes
    }
}


export default TagDao