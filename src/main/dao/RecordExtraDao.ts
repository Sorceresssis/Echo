import { injectable, inject } from "inversify"
import DI_TYPES, {type DILibrary } from "../DI/DITypes"

@injectable()
class RecordExtraDao {
    private lib: DILibrary

    public constructor(@inject(DI_TYPES.Library) lib: DILibrary) {
        this.lib = lib
    }

    public queryRecordExtraByRecordId(recordId: number): Domain.RecordExtra | undefined {
        return this.lib.dbConnection.get('SELECT id, intro, info FROM record_extra WHERE id = ?;', recordId)
    }

    public updateRecordExtra(recordExtra: Entity.RecordExtra): number {
        return this.lib.dbConnection.run('UPDATE record_extra SET intro=?, info=? WHERE id = ?;',
            recordExtra.intro, recordExtra.info, recordExtra.id).changes
    }

    public insetRecordExtra(recordExtra: Entity.RecordExtra): PrimaryKey {
        return this.lib.dbConnection.run('INSERT INTO record_extra(id, intro, info) VALUES(?,?,?);',
            recordExtra.id, recordExtra.intro, recordExtra.info).lastInsertRowid
    }

    public deleteRecordExtraById(id: PrimaryKey): number {
        return this.lib.dbConnection.run('DELETE FROM record_extra WHERE id = ?;', id).changes
    }
}


export default RecordExtraDao