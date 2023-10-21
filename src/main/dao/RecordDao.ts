import { injectable, inject } from "inversify"
import DI_TYPES, { type DILibrary } from "../DI/DITypes"
import DynamicSqlBuilder, { SortRule } from "../util/DynamicSqlBuilder"

export type QueryRecordsSortRule = {
    field: 'title' | 'rate' | 'id',
    order: 'ASC' | 'DESC'
}

@injectable()
class RecordDao {
    private lib: DILibrary

    public constructor(@inject(DI_TYPES.Library) lib: DILibrary) {
        this.lib = lib
    }

    public queryCountOfRecords(): number {
        return this.lib.dbConnection.prepare('SELECT COUNT(id) FROM record;').pluck().get() as number
    }

    public queryCountOfRecordsByDirnameId(dirnameId: PrimaryKey): number {
        return this.lib.dbConnection.prepare('SELECT COUNT(id) FROM record WHERE dirname_id = ?;').pluck().get(dirnameId) as number
    }

    public queryRecordIdByTitle(title: string): PrimaryKey | undefined {
        return this.lib.dbConnection.prepare('SELECT id FROM record WHERE title = ?;').pluck().get(title) as PrimaryKey | undefined
    }

    public queryRecordById(id: number): Domain.Record | undefined {
        return this.lib.dbConnection.get(`
            SELECT r.id, r.title, r.rate, r.cover, r.hyperlink, d.path AS dirname, r.basename,
                   DATETIME(gmt_create, 'localtime') AS createTime,
                   DATETIME(gmt_modified, 'localtime') AS modifiedTime
            FROM record r LEFT JOIN dirname d ON r.dirname_id = d.id
            WHERE r.id = ?;`, id)
    }

    public queryRecordsByKeyword(
        keyword: string,
        sort: QueryRecordsSortRule[],
        infoStatusFilter: string[],
        offset: number,
        rowCount: number,
        options: {
            type: 'common' | 'recycled' | 'author' | 'series'
            authorId?: number,
            seriesId?: number
        },
    ): Dao.Page<Domain.Record> {
        const rowsSQL = new DynamicSqlBuilder()
        const sortRule: SortRule[] = []
        const whereSubSQL = []
        rowsSQL.append(`
            SELECT f.total_count, r.id, r.title, r.rate, r.cover, r.hyperlink, d.path AS dirname, r.basename,
            DATETIME(gmt_create, 'localtime') AS createTime, DATETIME(gmt_modified, 'localtime') AS modifiedTime
			FROM (SELECT COUNT(r.id) OVER () AS total_count, r.id`)
        if (keyword !== '') {
            this.lib.dbConnection.registerSQLFnRegexp(keyword)
            rowsSQL.append(', REGEXP(r.title) + CASE WHEN r.tag_author_sum IS NULL THEN 0 ELSE REGEXP(r.tag_author_sum) END AS sore')
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
            .appendLimitSQL(offset, rowCount)
            .append(') f JOIN record r ON f.id = r.id LEFT JOIN dirname d ON r.dirname_id = d.id;')

        const rows = this.lib.dbConnection.all(rowsSQL.getSql(), ...rowsSQL.getParams())
        const total = rows[0]?.total_count || 0 // 如果rows为空，total_count为null，这里要转换为0
        rows.forEach(row => {
            delete row.total_count
        })

        return {
            total: total,
            rows: rows
        }
    }

    public queryRecordProfilesOfOrderRateByAuthor(authorId: number, rowCount: number): Domain.RecordProfile[] {
        return this.lib.dbConnection.all('SELECT r.id, r.title, r.cover FROM record r JOIN record_author ra ON r.id = ra.record_id WHERE ra.author_id = ? ORDER BY rate DESC LIMIT ?;',
            authorId, rowCount)
    }

    public queryRecordIdsByRecycled(recycled: 0 | 1, offset: number, rowCount: number): number[] {
        return this.lib.dbConnection.prepare('SELECT id FROM record WHERE recycled = ? LIMIT ?,?;').pluck().all(recycled, offset, rowCount) as number[]
    }

    public queryRecordIdsByDirnameId(dirnameId: PrimaryKey, offset: number, rowCount: number): number[] {
        return this.lib.dbConnection.prepare('SELECT id FROM record WHERE dirname_id = ? LIMIT ?,?;').pluck().all(dirnameId, offset, rowCount) as number[]
    }

    public updateRecordDirnameIdByDirnameId(dirnameId: PrimaryKey, newDirnameId: PrimaryKey): number {
        return this.lib.dbConnection.run('UPDATE record SET dirname_id = ? WHERE dirname_id = ?;', newDirnameId, dirnameId).changes
    }

    public updateRecordRecycledByIds(ids: PrimaryKey[], recycled: 0 | 1): void {
        const stmt = this.lib.dbConnection.prepare('UPDATE record SET recycled=? WHERE id = ?;')
        ids.forEach(id => stmt.run(recycled, id))
    }

    public updateRecordTagAuthorSumById(recordId: PrimaryKey, tagAuthorSum: string): number {
        return this.lib.dbConnection.run('UPDATE record SET tag_author_sum=? WHERE id = ?;', tagAuthorSum, recordId).changes
    }

    public updateRecord(record: Entity.Record): number {
        return this.lib.dbConnection.run('UPDATE record SET title=?, rate=?, cover=?, hyperlink=?, basename=?, info_status=?, dirname_id=?, gmt_modified=CURRENT_TIMESTAMP WHERE id = ?;',
            record.title, record.rate, record.cover, record.hyperlink, record.basename, record.infoStatus, record.dirnameId, record.id
        ).changes
    }

    public insertRecord(record: Entity.Record): PrimaryKey {
        return this.lib.dbConnection.run('INSERT INTO record(title, rate, cover, hyperlink, basename, info_status, tag_author_sum, dirname_id) VALUES(?,?,?,?,?,?,?,?);',
            record.title, record.rate, record.cover, record.hyperlink, record.basename, record.infoStatus, record.tagAuthorSum, record.dirnameId
        ).lastInsertRowid
    }

    public deleteRecordOfRecycledById(id: PrimaryKey): number {
        return this.lib.dbConnection.run('DELETE FROM record WHERE recycled = 1 AND id = ?;', id).changes
    }
}


export default RecordDao