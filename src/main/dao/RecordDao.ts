import { injectable, inject } from "inversify"
import InjectType from "../provider/injectType"
import { type LibraryEnv } from "../provider/container"
import DynamicSqlBuilder, { SortRule } from "../utils/DynamicSqlBuilder"
import { DBPageQueryOptions, PagedResult } from "../pojo/page"

export type QueryRecordsSortRule = {
    field: 'title' | 'rate' | 'id' | 'release_date',
    order: 'ASC' | 'DESC'
}

@injectable()
class RecordDao {
    public constructor(
        @inject(InjectType.LibraryEnv) private libEnv: LibraryEnv
    ) { }

    /**
     * 请提前进行 trim 操作
     */
    public recordWriteModelFactory(
        title: string,
        translated_title: string,
        rate: number,
        hyperlink: string | null,
        basename: string | null,
        release_date: string | null,
        info_status: string,
        tag_author_sum: string | null,
        search_text: string,
        dirname_id: Entity.PK,
        id: Entity.PK = 0,
    ): DAO.Record_W {
        return {
            id,
            title,
            translated_title,
            rate,
            hyperlink: hyperlink || null,
            basename: basename || null,
            release_date: release_date || null,
            info_status: info_status,
            tag_author_sum: tag_author_sum || null,
            search_text,
            dirname_id,
        }
    }

    public getRecordCountByDirnameId(dirnameId: Entity.PK): Entity.PK {
        const sql = "SELECT COUNT(id) FROM record WHERE dirname_id = ?;"
        return this.libEnv.db.prepare(sql).pluck().get(dirnameId) as Entity.PK
    }

    public getRecordById(id: number): DAO.Record_R | undefined {
        const sql = `
            SELECT r.id, r.title,
                r.translated_title,
                r.rate, r.hyperlink,
                r.release_date,
                d.path AS dirname,
                r.basename, r.search_text,
                DATETIME(create_time, 'localtime') AS create_time,
                DATETIME(update_time, 'localtime') AS update_time
            FROM record r LEFT JOIN dirname d ON r.dirname_id = d.id
            WHERE r.id = ?;
        `
        return this.libEnv.db.get(sql, id)
    }

    public getRecordsByKeyword(
        keyword: string,
        sort: QueryRecordsSortRule[],
        infoStatusFilter: string[],
        pageOptions: DBPageQueryOptions,
        options: {
            type: 'common' | 'recycled' | 'author' | 'series'
            authorId?: number,
            seriesId?: number
        },
    ): PagedResult<DAO.RecordExhibit_R> {
        const rowsSQL = new DynamicSqlBuilder()
        const sortRule: SortRule[] = []
        const whereSubSQL = []
        rowsSQL.append(`
            SELECT
                f.total_count,
                r.id, r.title, r.translated_title, r.rate, r.hyperlink,
                r.release_date, d.path AS dirname, r.basename,
                DATETIME(create_time, 'localtime') AS create_time,
                DATETIME(update_time, 'localtime') AS update_time
			FROM (SELECT COUNT(r.id) OVER () AS total_count, r.id
        `)

        if (keyword) {
            this.libEnv.db.registerSQLFnRegexp(keyword)
            rowsSQL.append(`, (REGEXP(r.title) + REGEXP(translated_title) + REGEXP(r.search_text) +
                CASE WHEN r.tag_author_sum IS NULL THEN 0 ELSE REGEXP(r.tag_author_sum) END) AS sore`)
            sortRule.push({ field: 'sore', order: 'DESC' })
            whereSubSQL.push('sore > 0')
        }

        rowsSQL.append('FROM record r')
        sort.forEach((rule) => {
            sortRule.push({ field: rule.field, order: rule.order, table: 'r' })
        })
        whereSubSQL.push(rowsSQL.generateInSQL('info_status', infoStatusFilter))
        switch (options.type) {
            case 'common':
                whereSubSQL.push('r.recycled = 0')
                break
            case 'author':
                rowsSQL.append('JOIN record_author ra ON r.id = ra.record_id')
                whereSubSQL.push('r.recycled = 0')
                whereSubSQL.push('ra.author_id = ?')
                rowsSQL.appendParam(options.authorId)
                break
            case 'recycled':
                whereSubSQL.push('r.recycled = 1')
                break
            case 'series':
                rowsSQL.append('JOIN record_series rs ON r.id = rs.record_id')
                whereSubSQL.push('r.recycled = 0')
                whereSubSQL.push('rs.series_id = ?')
                rowsSQL.appendParam(options.seriesId)
                break
            default:
                throw new Error('invalid type')
        }
        rowsSQL.appendWhereSQL(whereSubSQL)
            .appendOrderSQL(sortRule)
            .appendLimitSQL(pageOptions.pn, pageOptions.ps)
            .append(') f JOIN record r ON f.id = r.id LEFT JOIN dirname d ON r.dirname_id = d.id;')

        const results = this.libEnv.db.prepare<any[], DAO.RecordExhibit_R & { total_count?: number }>(rowsSQL.getSql()).all(...rowsSQL.getParams())
        const totalCount = results[0]?.total_count || 0 // 如果rows为空，total_count为null，这里要转换为0
        results.forEach(result => {
            delete result.total_count
        })
        return new PagedResult(results, pageOptions.pn, pageOptions.ps, totalCount)
    }

    public getRecordsOrderRateByAuthor(authorId: number, rn: number): DAO.RecordProfile_R[] {
        const resultsSql = `
            SELECT r.id, r.title, translated_title
            FROM record r
                JOIN record_author ra ON r.id = ra.record_id
            WHERE ra.author_id = ?
            ORDER BY rate DESC
            LIMIT ?,?;
        `
        return this.libEnv.db.all(resultsSql, authorId, 0, rn)
    }

    public queryIdsByRecycled(recycled: 0 | 1, pageOptions: DBPageQueryOptions): PagedResult<Entity.PK> {
        const resultsSql = "SELECT id FROM record WHERE recycled = ? LIMIT ?,?;"
        const totalCountSql = "SELECT COUNT(id) FROM record WHERE recycled = ?;"
        const results = this.libEnv.db.prepare<any[], number>(resultsSql).pluck().all(
            recycled, (pageOptions.pn - 1) * pageOptions.ps, pageOptions.ps
        )
        let totalCount = 0
        if (pageOptions.totalCountRequired) {
            totalCount = this.libEnv.db.prepare<any, number>(totalCountSql).pluck().get(recycled) ?? 0
        }
        return new PagedResult(results, pageOptions.pn, pageOptions.ps, totalCount);
    }

    public getIdsByDirnameId(dirnameId: Entity.PK, pageOptions: DBPageQueryOptions): PagedResult<Entity.PK> {
        const resultsSql = "SELECT id FROM record WHERE dirname_id = ? LIMIT ?,?;"
        const totalCountSql = "SELECT COUNT(id) FROM record WHERE dirname_id = ?;"
        const results = this.libEnv.db.prepare<any[], number>(resultsSql).pluck().all(
            dirnameId, (pageOptions.pn - 1) * pageOptions.ps, pageOptions.ps
        )
        let totalCount = 0
        if (pageOptions.totalCountRequired) {
            totalCount = this.libEnv.db.prepare<any, number>(totalCountSql).pluck().get(dirnameId) ?? 0
        }
        return new PagedResult(results, pageOptions.pn, pageOptions.ps, totalCount)
    }

    public getIdByDirnameIdAndBasename(dirnameId: Entity.PK, basename: string): number | undefined {
        const sql = "SELECT id FROM record WHERE dirname_id = ? AND basename = ?;"
        return this.libEnv.db.prepare<any[], number>(sql).pluck().get(dirnameId, basename)
    }

    public update(record: DAO.Record_W): number {
        const sql = `
            UPDATE record SET
                title=?, translated_title=?, rate=?,
                hyperlink=?, release_date=?,
                dirname_id=?, basename=?,
                info_status=?, search_text=?,
                update_time=CURRENT_TIMESTAMP
            WHERE id = ?;
        `
        return this.libEnv.db.run(sql,
            record.title, record.translated_title, record.rate,
            record.hyperlink, record.release_date, record.dirname_id,
            record.basename, record.info_status,
            record.search_text, record.id
        ).changes
    }

    public updateDirnameIdByDirnameId(dirnameId: Entity.PK, newDirnameId: Entity.PK): number {
        const sql = "UPDATE record SET dirname_id = ? WHERE dirname_id = ?;"
        return this.libEnv.db.run(sql, newDirnameId, dirnameId).changes
    }

    public updateRecycledByIds(ids: Entity.PK[], recycled: 0 | 1): void {
        const stmt = this.libEnv.db.prepare('UPDATE record SET recycled=? WHERE id = ?;')
        ids.forEach(id => stmt.run(recycled, id))
    }

    public updateTagAuthorSumById(id: Entity.PK, tagAuthorSum: string | null): number {
        const sql = "UPDATE record SET tag_author_sum=? WHERE id = ?;"
        return this.libEnv.db.run(sql, tagAuthorSum, id).changes
    }

    public insert(record: DAO.Record_W): Entity.PK {
        const sql = `
            INSERT INTO record(
                title, translated_title, rate,
                hyperlink, release_date,
                dirname_id, basename,
                info_status, search_text
            ) VALUES(?,?,?,?,?,?,?,?,?);
        `
        return this.libEnv.db.run(sql,
            record.title, record.translated_title, record.rate,
            record.hyperlink, record.release_date, record.dirname_id,
            record.basename, record.info_status, record.search_text
        ).lastInsertRowid as Entity.PK
    }

    public deleteRecycledById(id: Entity.PK): number {
        const sql = "DELETE FROM record WHERE recycled = 1 AND id = ?;"
        return this.libEnv.db.run(sql, id).changes
    }
}


export default RecordDao