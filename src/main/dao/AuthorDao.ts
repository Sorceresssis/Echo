import { injectable, inject } from "inversify"
import DI_TYPES, { type DILibrary } from "../DI/DITypes"
import DynamicSqlBuilder, { SortRule } from "../util/DynamicSqlBuilder"

export type QueryAuthorsSortRule = {
    field: 'name' | 'id',
    order: 'ASC' | 'DESC'
}

@injectable()
class AuthorDao {
    private lib: DILibrary

    public constructor(@inject(DI_TYPES.Library) lib: DILibrary) {
        this.lib = lib
    }

    public queryAuthorById(id: PrimaryKey): Domain.Author | undefined {
        return this.lib.dbConnection.get(`SELECT id, name, avatar, intro, DATETIME(gmt_create, 'localtime') AS createTime,
        DATETIME(gmt_modified, 'localtime') AS modifiedTime FROM author WHERE id = ?;` , id)
    }

    public queryAuthorsByKeyword(
        keyword: string,
        sort: QueryAuthorsSortRule[],
        offset: number,
        rowCount: number,
    ): Dao.Page<Domain.Author> {
        const sql = new DynamicSqlBuilder()
        const sortRule: SortRule[] = []

        sql.append('SELECT COUNT(id) OVER () AS total_count, id, name, avatar, intro FROM author')
        if (keyword !== '') {
            this.lib.dbConnection.registerSQLFnRegexp(keyword)
            sql.append('WHERE REGEXP(name) > 0')
            sortRule.push({ field: 'REGEXP(name)', order: 'DESC' })
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

    public queryAuthorsByRecordId(id: PrimaryKey): Domain.AuthorProfile[] {
        return this.lib.dbConnection.all('SELECT a.id, a.name, a.avatar FROM author a JOIN record_author ra ON a.id = ra.author_id WHERE ra.record_id = ? ORDER BY ra.id;', id)
    }

    public updateAuthor(author: Entity.Author): number {
        return this.lib.dbConnection.run("UPDATE author SET name=?, avatar=?, intro=?, gmt_modified=CURRENT_TIMESTAMP WHERE id = ?;",
            author.name, author.avatar, author.intro, author.id).changes
    }

    public insertAuthor(author: Entity.Author): PrimaryKey {
        return this.lib.dbConnection.run("INSERT INTO author(name, avatar, intro) VALUES(?,?,?);", author.name, author.avatar, author.intro).lastInsertRowid
    }

    public deleteAuthorById(id: PrimaryKey): number {
        return this.lib.dbConnection.run(`DELETE FROM author WHERE id = ?; `, id).changes
    }
}


export default AuthorDao