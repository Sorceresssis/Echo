import { injectable, inject } from "inversify"
import InjectType from "../provider/injectType"
import { type LibraryEnv } from "../provider/container"

@injectable()
class RecordExtraDao {
    public constructor(
        @inject(InjectType.LibraryEnv) private libEnv: LibraryEnv
    ) { }

    public recordExtraWriteModelFactory(
        id: Entity.PK,
        plot: string,
        reviews: string,
        info: string
    ): DAO.RecordExtra_W {
        return { id, plot, reviews, info }
    }

    public queryRecordExtraById(id: number): DAO.RecordExtra_R | undefined {
        const sql = "SELECT id, plot, reviews, info FROM record_extra WHERE id = ?;"
        return this.libEnv.db.get(sql, id)
    }

    public update(data: DAO.RecordExtra_W): number {
        const sql = "UPDATE record_extra SET plot=?, reviews=?, info=? WHERE id = ?;"
        return this.libEnv.db.run(sql, data.plot, data.reviews, data.info, data.id).changes
    }

    public inset(data: DAO.RecordExtra_W): Entity.PK {
        const sql = "INSERT INTO record_extra(id, plot, reviews, info) VALUES(?,?,?,?);"
        return this.libEnv.db.run(sql, data.id, data.plot, data.reviews, data.info).lastInsertRowid as Entity.PK
    }

    public deleteById(id: Entity.PK): number {
        const sql = "DELETE FROM record_extra WHERE id = ?;"
        return this.libEnv.db.run(sql, id).changes
    }
}


export default RecordExtraDao