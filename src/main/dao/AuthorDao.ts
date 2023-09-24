import { injectable, inject } from "inversify"
import DI_TYPES from "../DI/DITypes"
import LibraryDB from "../db/LibraryDB"

@injectable()
class LibraryDao {
    private db: LibraryDB

    public constructor(@inject(LibraryDB) db: LibraryDB) {
        this.db = db
    }

    public test(): void {
        console.log(this.db.get("SELECT * FROM record limit 0 ,1 ;"))
    }
}


export default LibraryDao