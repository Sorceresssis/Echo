import { injectable, inject } from "inversify"
import DI_TYPES, {type DILibrary } from "../DI/DITypes"

@injectable()
class RecordSeriesDao {
    private lib: DILibrary

    public constructor(@inject(DI_TYPES.Library) lib: DILibrary) {
        this.lib = lib
    }

    public queryRecordIdsBySeriesId(seriesId: PrimaryKey, offset: number, rowCount: number): number[] {
        return this.lib.dbConnection.prepare('SELECT record_id FROM record_series WHERE series_id = ? LIMIT ?,?;').pluck().all(seriesId, offset, rowCount) as number[]
    }

    public insertRecordSeriesByRecordIdSeriesIds(recordId: PrimaryKey, seriesIds: PrimaryKey[]): void {
        const stmt = this.lib.dbConnection.prepare("INSERT INTO record_series(record_id, series_id) VALUES(?,?);")
        seriesIds.forEach(id => stmt.run(recordId, id))
    }

    public deleteRecordSeriesByRecordIdSeriesIds(recordId: PrimaryKey, seriesIds: PrimaryKey[]): void {
        const stmt = this.lib.dbConnection.prepare("DELETE FROM record_series WHERE record_id = ? AND series_id = ?;")
        seriesIds.forEach(id => stmt.run(recordId, id))
    }

    public deleteRecordSeriesByRecordId(id: PrimaryKey): number {
        return this.lib.dbConnection.run('DELETE FROM record_series WHERE record_id = ?;', id).changes
    }
}


export default RecordSeriesDao