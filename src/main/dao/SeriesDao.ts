import { injectable, inject } from "inversify"
import DI_TYPES, { type DILibrary } from "../DI/DITypes"

@injectable()
class SeriesDao {
    private lib: DILibrary

    public constructor(@inject(DI_TYPES.Library) lib: DILibrary) {
        this.lib = lib
    }

    public querySeriesIdByName(name: string): number | undefined {
        return this.lib.dbConnection.prepare('SELECT id FROM series WHERE name = ?;').pluck().get(name) as number | undefined
    }

    public querySeriesByRecordId(id: PrimaryKey): Domain.Series[] {
        return this.lib.dbConnection.all('SELECT s.id, s.name FROM series s JOIN record_series rs ON s.id = rs.series_id WHERE rs.record_id = ?;', id)
    }

    public updateSeriesName(id: PrimaryKey, name: string): number {
        return this.lib.dbConnection.run("UPDATE series SET name = ? WHERE id = ?;", name, id).changes
    }

    public insertSeries(name: string): PrimaryKey {
        return this.lib.dbConnection.run("INSERT INTO series(name) VALUES(?);", name).lastInsertRowid
    }

    public deleteSeries(id: PrimaryKey): number {
        return this.lib.dbConnection.run("DELETE FROM series WHERE id = ?;", id).changes
    }
}


export default SeriesDao