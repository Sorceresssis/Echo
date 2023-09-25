import { injectable, inject } from "inversify"
import DI_TYPES, { DILibrary } from "../DI/DITypes"

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

    public queryRecordById(id: number): Domain.Record | undefined {
        return this.lib.dbConnection.get(`
            SELECT r.id, r.title, r.rate, r.cover, r.hyperlink, d.path AS dirname, r.basename,
                   DATETIME(gmt_create, 'localtime') AS createTime,
                   DATETIME(gmt_modified, 'localtime') AS modifiedTime
            FROM record r LEFT JOIN dirname d ON r.dirname_id = d.id
            WHERE r.id = ?;`, id)
    }
}


export default RecordDao