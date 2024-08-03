import { injectable, inject } from "inversify"
import InjectType from "../provider/injectType"
import { type LibraryEnv } from "../provider/container"
import DynamicSqlBuilder, { SortRule } from "../utils/DynamicSqlBuilder"
import { DBPageQueryOptions, PagedResult } from "../pojo/page"

export type QueryAuthorsSortRule = {
    field: 'name' | 'id',
    order: 'ASC' | 'DESC'
}

@injectable()
class AuthorDao {
    public constructor(
        @inject(InjectType.LibraryEnv) private libEnv: LibraryEnv
    ) { }

    public authorWriteModelFactory(name: string, id?: Entity.PK, intro?: string): DAO.Author_W {
        return {
            id: id ?? 0,
            name,
            intro: intro ?? '',
        }
    }

    public queryAuthorById(id: Entity.PK): DAO.Author_R | undefined {
        const sql = `
            SELECT id, name, intro,
                DATETIME(create_time, 'localtime') AS create_time,
                DATETIME(update_time, 'localtime') AS update_time
            FROM author WHERE id = ?;`
        return this.libEnv.db.prepare<any[], DAO.Author_R>(sql).get(id)
    }

    public queryAuthorsProfileByRecordId(recordId: Entity.PK): DAO.AuthorProfile_R[] {
        const sql = "SELECT a.id, a.name FROM author a JOIN record_author ra ON a.id = ra.author_id WHERE ra.record_id = ?"
        return this.libEnv.db.prepare<any[], DAO.AuthorProfile_R>(sql).all(recordId)
    }

    public queryAuthorByName(name: string): Entity.Author | undefined {
        const sql = "SELECT id, name, intro FROM author WHERE name = ?;"
        return this.libEnv.db.get(sql, name)
    }

    public queryAuthorsByKeyword(
        keyword: string,
        sort: QueryAuthorsSortRule[],
        pageOptions: DBPageQueryOptions,
        roleId?: number // undefined = all roles, 0 = unSetRole, > 0 = specific role
    ): PagedResult<DAO.AuthorProfile_R> {
        const sql = new DynamicSqlBuilder()
        const sortRule: SortRule[] = []
        const whereRule: string[] = []
        const groupRule: string[] = []

        sql.append('SELECT COUNT(a.id) OVER () AS total_count, a.id, a.name, a.intro FROM author a')
        if (keyword !== '') {
            this.libEnv.db.registerSQLFnRegexp(keyword)
            whereRule.push('REGEXP(a.name) > 0')
            sortRule.push({ field: 'REGEXP(a.name)', order: 'DESC' })
        }

        if (roleId !== void 0) {
            if (roleId) {
                sql.append("JOIN record_author_role rar ON a.id = rar.author_id")
                whereRule.push('rar.role_id = ?')
                sql.appendParam(roleId)
                groupRule.push('a.id')
            } else { // 0
                sql.append("LEFT JOIN record_author_role rar ON a.id = rar.author_id")
                whereRule.push('rar.role_id IS NULL')
            }
        }
        sql.appendWhereSQL(whereRule)
        sql.appendGroupBySQL(groupRule)
        sort.forEach((rule) => {
            sortRule.push({ field: rule.field, order: rule.order, table: 'a' })
        })
        sql.appendOrderSQL(sortRule)
            .appendLimitSQL(pageOptions.pn, pageOptions.ps)

        const rows = this.libEnv.db
            .prepare<any[], DAO.AuthorProfile_R & { total_count?: number }>(sql.getSql())
            .all(...sql.getParams())

        const totalCount = rows[0]?.total_count || 0
        rows.forEach(row => { delete row.total_count })

        return new PagedResult(rows, pageOptions.pn, pageOptions.ps, totalCount)
    }

    public update(author: DAO.Author_W): number {
        const sql = "UPDATE author SET name=?, intro=?, update_time=CURRENT_TIMESTAMP WHERE id = ?;"
        return this.libEnv.db.prepare(sql).run(author.name, author.intro, author.id).changes
    }

    public insert(author: DAO.Author_W): Entity.PK {
        const sql = "INSERT INTO author(name, intro) VALUES(?,?);"
        return this.libEnv.db.prepare(sql).run(author.name, author.intro).lastInsertRowid as Entity.PK
    }

    public deleteById(id: Entity.PK): number {
        const sql = "DELETE FROM author WHERE id = ?;"
        return this.libEnv.db.prepare(sql).run(id).changes
    }
}


export default AuthorDao