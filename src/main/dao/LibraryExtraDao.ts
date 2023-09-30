import { injectable, inject } from "inversify"
import DI_TYPES from "../DI/DITypes"
import GroupDB from "../db/GroupDB"

@injectable()
class LibraryExtraDao {
    private db: GroupDB

    public constructor(@inject(DI_TYPES.GroupDB) db: GroupDB) {
        this.db = db
    }

    public queryLibraryExtraById(id: number): Domain.LibraryExtra | undefined {
        return this.db.get('SELECT id, auxiliary_st AS auxiliarySt, use_auxiliary_st AS useAuxiliarySt, intro FROM library_extra WHERE id=?;', id)
    }

    public updateLibraryExtra(data: Entity.LibraryExtra): number {
        return this.db.run(`UPDATE library_extra SET auxiliary_st=?, use_auxiliary_st=?, intro=? WHERE id=?;`,
            data.auxiliarySt, data.useAuxiliarySt, data.intro, data.id).changes
    }

    public insertLibraryExtra(data: Entity.LibraryExtra): number {
        return this.db.run('INSERT INTO library_extra(id, auxiliary_st, use_auxiliary_st, intro) VALUES(?, ?, ?, ?);',
            data.id, data.auxiliarySt, data.useAuxiliarySt, data.intro).changes
    }

    public deleteLibraryExtraById(id: number): number {
        return this.db.run('DELETE FROM library_extra WHERE id=?;', id).changes
    }
}

export default LibraryExtraDao