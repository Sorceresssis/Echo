import { injectable, inject } from "inversify"
import InjectType from "../provider/injectType"
import { type LibraryEnv } from "../provider/container"

@injectable()
class RecordSeriesDao {
    public constructor(
        @inject(InjectType.LibraryEnv) private libEnv: LibraryEnv
    ) { }

    public queryRecordIdsBySeriesId(seriesId: Entity.PK, offset: number, rowCount: number): number[] {
        return this.libEnv.db.prepare('SELECT record_id FROM record_series WHERE series_id = ? LIMIT ?,?;').pluck().all(seriesId, offset, rowCount) as number[]
    }

    public queryRandomRecordIdsOfSameSeriesByRecordId(recordId: Entity.PK, rowCount: number = 10): number[] {
        const sql = `
        SELECT rs2.record_id
        FROM record_series rs1 JOIN record_series rs2 ON rs1.series_id = rs2.series_id
        WHERE rs1.record_id = ? AND rs2.record_id != ?
        GROUP BY rs2.record_id
        ORDER BY RANDOM() LIMIT 0, ?;`

        return this.libEnv.db.prepare(sql).pluck().all(recordId, recordId, rowCount) as number[]
    }

    public updateSeriesIdBySeriesId(seriesId: Entity.PK, newSeriesId: Entity.PK): void {
        this.libEnv.db.run(`
            DELETE FROM record_series 
            WHERE series_id = ? 
                AND record_id IN (
                    SELECT record_id 
                    FROM record_series 
                    WHERE series_id = ? 
                    INTERSECT 
                    SELECT record_id 
                    FROM record_series 
                    WHERE series_id = ?
                );
            `, seriesId, seriesId, newSeriesId)
        this.libEnv.db.run('UPDATE record_series SET series_id = ? WHERE series_id = ?;', newSeriesId, seriesId)
    }

    public insertRecordSeriesByRecordIdSeriesIds(recordId: Entity.PK, seriesIds: Entity.PK[]): void {
        const stmt = this.libEnv.db.prepare("INSERT INTO record_series(record_id, series_id) VALUES(?,?);")
        seriesIds.forEach(id => stmt.run(recordId, id))
    }

    public deleteRecordSeriesByRecordIdSeriesIds(recordId: Entity.PK, seriesIds: Entity.PK[]): void {
        const stmt = this.libEnv.db.prepare("DELETE FROM record_series WHERE record_id = ? AND series_id = ?;")
        seriesIds.forEach(id => stmt.run(recordId, id))
    }

    public deleteRecordSeriesBySeriesId(id: Entity.PK) {
        return this.libEnv.db.run('DELETE FROM record_series WHERE series_id = ?;', id).changes
    }

    public deleteRecordSeriesByRecordId(id: Entity.PK): number {
        return this.libEnv.db.run('DELETE FROM record_series WHERE record_id = ?;', id).changes
    }
}


export default RecordSeriesDao