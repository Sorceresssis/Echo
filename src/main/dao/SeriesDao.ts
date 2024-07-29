import { injectable, inject } from "inversify"
import InjectType from "../provider/injectType"
import { type LibraryEnv } from "../provider/container"

@injectable()
class SeriesDao {
    public constructor(
        @inject(InjectType.LibraryEnv) private libEnv: LibraryEnv
    ) { }

    public querySeriesIdByName(name: string): Entity.PK | undefined {
        const sql = "SELECT id FROM series WHERE name = ?;"
        return this.libEnv.db.prepare(sql).pluck().get(name) as number | undefined
    }

    public querySeriesByRecordId(id: Entity.PK): Entity.Series[] {
        const sql = "SELECT s.id, s.name FROM series s JOIN record_series rs ON s.id = rs.series_id WHERE rs.record_id = ?;"
        return this.libEnv.db.all(sql, id)
    }

    public updateSeriesName(id: Entity.PK, name: string): number {
        return this.libEnv.db.run("UPDATE series SET name = ? WHERE id = ?;", name, id).changes
    }

    public insertSeries(name: string): Entity.PK {
        return this.libEnv.db.run("INSERT INTO series(name) VALUES(?);", name).lastInsertRowid as Entity.PK
    }

    public deleteSeries(id: Entity.PK): number {
        return this.libEnv.db.run("DELETE FROM series WHERE id = ?;", id).changes
    }
}


export default SeriesDao