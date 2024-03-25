import { injectable, inject } from "inversify"
import InjectType from "../provider/injectType"
import { type LibraryEnv } from "../provider/container"

@injectable()
class RecordExtraDao {
    private libEnv: LibraryEnv

    public constructor(@inject(InjectType.LibraryEnv) libEnv: LibraryEnv) {
        this.libEnv = libEnv
    }

    public queryRecordExtraByRecordId(recordId: number): Domain.RecordExtra | undefined {
        return this.libEnv.db.get('SELECT id, intro, info FROM record_extra WHERE id = ?;', recordId)
    }

    public updateRecordExtra(recordExtra: Entity.RecordExtra): number {
        return this.libEnv.db.run('UPDATE record_extra SET intro=?, info=? WHERE id = ?;',
            recordExtra.intro, recordExtra.info, recordExtra.id).changes
    }

    public insetRecordExtra(recordExtra: Entity.RecordExtra): PrimaryKey {
        return this.libEnv.db.run('INSERT INTO record_extra(id, intro, info) VALUES(?,?,?);',
            recordExtra.id, recordExtra.intro, recordExtra.info).lastInsertRowid
    }

    public deleteRecordExtraById(id: PrimaryKey): number {
        return this.libEnv.db.run('DELETE FROM record_extra WHERE id = ?;', id).changes
    }
}


export default RecordExtraDao