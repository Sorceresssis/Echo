import { injectable, inject } from "inversify"
import DI_TYPES from "../DI/DITypes"
import LibraryDB from "../db/LibraryDB"

@injectable()
class RecordAuthorDao {
    private db: LibraryDB

    public constructor(@inject(DI_TYPES.LibraryDB) db: LibraryDB) {
        this.db = db
    }


}


export default RecordAuthorDao