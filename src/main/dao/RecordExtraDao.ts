import { injectable, inject } from "inversify"
import InjectType from "../provider/injectType"
import { type LibraryEnv } from "../provider/container"

@injectable()
class RecordExtraDao {
    public constructor(
        @inject(InjectType.LibraryEnv) private libEnv: LibraryEnv
    ) { }

    public recordExtraFactory(id: PrimaryKey, plot: string, reviews: string, info: string): Entity.RecordExtra {
        return { id, plot, reviews, info }
    }

    public queryRecordExtraByRecordId(recordId: number): Domain.RecordExtra | undefined {
        return this.libEnv.db.get('SELECT id, plot, reviews, info FROM record_extra WHERE id = ?;', recordId)
    }

    public updateRecordExtra(recordExtra: Entity.RecordExtra): number {
        return this.libEnv.db.run('UPDATE record_extra SET plot=?, reviews=?, info=? WHERE id = ?;',
            recordExtra.plot, recordExtra.reviews, recordExtra.info, recordExtra.id).changes
    }

    public insetRecordExtra(recordExtra: Entity.RecordExtra): PrimaryKey {
        return this.libEnv.db.run('INSERT INTO record_extra(id, plot, reviews, info) VALUES(?,?,?,?);',
            recordExtra.id, recordExtra.plot, recordExtra.reviews, recordExtra.info).lastInsertRowid as Entity.PK
    }

    public deleteRecordExtraById(id: PrimaryKey): number {
        return this.libEnv.db.run('DELETE FROM record_extra WHERE id = ?;', id).changes
    }
}


export default RecordExtraDao