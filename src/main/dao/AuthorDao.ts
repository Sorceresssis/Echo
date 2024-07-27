import { injectable, inject } from "inversify"
import InjectType from "../provider/injectType"
import { type LibraryEnv } from "../provider/container"
import DynamicSqlBuilder, { SortRule } from "../util/DynamicSqlBuilder"

export type QueryAuthorsSortRule = {
    field: 'name' | 'id',
    order: 'ASC' | 'DESC'
}

@injectable()
class AuthorDao {
    public constructor(
        @inject(InjectType.LibraryEnv) private libEnv: LibraryEnv
    ) { }

    public authorEntityFactory(name: string, id?: PrimaryKey, intro?: string): Entity.Author {
        return {
            id: id ?? 0,
            name,
            intro: intro ?? '',
        }
    }

    public queryAuthorById(id: PrimaryKey): Domain.Author | undefined {
        return this.libEnv.db.get(`SELECT id, name, intro, DATETIME(gmt_create, 'localtime') AS createTime,
        DATETIME(gmt_modified, 'localtime') AS modifiedTime FROM author WHERE id = ?;` , id)
    }

    public queryAuthorByName(name: string): Entity.Author | undefined {
        return this.libEnv.db.get(`SELECT id, name, intro FROM author WHERE name = ?;`, name)
    }

    public queryAuthorsByKeyword(
        keyword: string,
        sort: QueryAuthorsSortRule[],
        role: number,
        offset: number,
        rowCount: number,
    ): DAO.AllQueryResult<Domain.Author> {
        const sql = new DynamicSqlBuilder()
        const sortRule: SortRule[] = []

        sql.append('SELECT COUNT(id) OVER () AS total_count, id, name, intro FROM author')
        if (keyword !== '') {
            this.libEnv.db.registerSQLFnRegexp(keyword)
            sql.append('WHERE REGEXP(name) > 0')
            sortRule.push({ field: 'REGEXP(name)', order: 'DESC' })
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

    public queryAuthorsAndRoleByRecordId(id: PrimaryKey): VO.RecordAuthorProfile[] {
        return this.libEnv.db.all(`SELECT a.id, a.name, ra.role FROM author a JOIN record_author ra ON a.id = ra.author_id WHERE ra.record_id = ?`, id)
    }

    public updateAuthor(author: Entity.Author): number {
        return this.libEnv.db.run("UPDATE author SET name=?, intro=?, gmt_modified=CURRENT_TIMESTAMP WHERE id = ?;",
            author.name, author.intro, author.id).changes
    }

    public insertAuthor(author: Entity.Author): PrimaryKey {
        return this.libEnv.db.run("INSERT INTO author(name, intro) VALUES(?,?);", author.name, author.intro).lastInsertRowid
    }

    public deleteAuthorById(id: PrimaryKey): number {
        return this.libEnv.db.run(`DELETE FROM author WHERE id = ?; `, id).changes
    }
}


export default AuthorDao