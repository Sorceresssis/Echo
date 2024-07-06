import { injectable, inject } from "inversify"
import InjectType from "../provider/injectType"
import { type LibraryEnv } from "../provider/container"
import DynamicSqlBuilder, { SortRule } from "../util/DynamicSqlBuilder"

export type QueryTagsSortRule = {
    field: 'title' | 'id',
    order: 'ASC' | 'DESC'
}

@injectable()
class TagDao {
    private libEnv: LibraryEnv

    public constructor(@inject(InjectType.LibraryEnv) libEnv: LibraryEnv) {
        this.libEnv = libEnv
    }

    public queryTagIdByTitle(title: string): number | undefined {
        return this.libEnv.db.prepare('SELECT id FROM tag WHERE title = ?;').pluck().get(title) as number | undefined
    }

    public queryTagsByRecordId(recordId: PrimaryKey): Domain.Tag[] {
        return this.libEnv.db.all('SELECT t.id, t.title FROM tag t JOIN record_tag rt ON t.id = rt.tag_id WHERE rt.record_id = ? ORDER BY rt.id;', recordId)
    }

    public queryTagsByKeyword(
        keyword: string,
        sort: QueryTagsSortRule[],
        offset: number,
        rowCount: number
    ): DAO.AllQueryResult<Domain.Tag> {
        const sql = new DynamicSqlBuilder()
        const sortRule: SortRule[] = []

        sql.append('SELECT COUNT(id) OVER () AS total_count, id, title FROM tag')
        if (keyword !== '') {
            this.libEnv.db.registerSQLFnRegexp(keyword)
            sql.append('WHERE REGEXP(title) > 0')
            sortRule.push({ field: 'REGEXP(title)', order: 'DESC' })
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

    public updateTagTitle(id: PrimaryKey, title: string): number {
        return this.libEnv.db.run("UPDATE tag SET title = ? WHERE id = ?;", title, id).changes
    }

    public insertTag(title: string): PrimaryKey {
        return this.libEnv.db.run("INSERT INTO tag(title) VALUES(?);", title).lastInsertRowid
    }

    public deleteTagById(id: PrimaryKey): number {
        return this.libEnv.db.run("DELETE FROM tag WHERE id = ?;", id).changes
    }
}


export default TagDao