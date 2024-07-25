import { injectable, inject } from "inversify"
import InjectType from "../provider/injectType"
import { type LibraryEnv } from "../provider/container"

@injectable()
class SeriesDao {
    public constructor(
        @inject(InjectType.LibraryEnv) private libEnv: LibraryEnv
    ) { }

    public querySeriesIdByName(name: string): number | undefined {
        return this.libEnv.db.prepare('SELECT id FROM series WHERE name = ?;').pluck().get(name) as number | undefined
    }

    public querySeriesByRecordId(id: PrimaryKey): Domain.Series[] {
        return this.libEnv.db.all('SELECT s.id, s.name FROM series s JOIN record_series rs ON s.id = rs.series_id WHERE rs.record_id = ?;', id)
    }

    public updateSeriesName(id: PrimaryKey, name: string): number {
        return this.libEnv.db.run("UPDATE series SET name = ? WHERE id = ?;", name, id).changes
    }

    public insertSeries(name: string): PrimaryKey {
        return this.libEnv.db.run("INSERT INTO series(name) VALUES(?);", name).lastInsertRowid
    }

    public deleteSeries(id: PrimaryKey): number {
        return this.libEnv.db.run("DELETE FROM series WHERE id = ?;", id).changes
    }
}


export default SeriesDao