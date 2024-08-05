import { injectable, inject } from "inversify"
import InjectType from "../provider/injectType"
import GroupDB from "../db/GroupDB"

@injectable()
class LibraryExtraDao {
    public constructor(
        @inject(InjectType.GroupDB) private db: GroupDB
    ) { }

    public getLibraryExtraById(id: Entity.PK): DAO.LibraryExtra_R | undefined {
        const sql = "SELECT id, use_auxiliary_st, auxiliary_st, intro FROM library_extra WHERE id=?;"
        return this.db.get(sql, id)
    }

    public update(data: DAO.LibraryExtra_W): number {
        const sql = "UPDATE library_extra SET auxiliary_st=?, use_auxiliary_st=?, intro=? WHERE id=?;"
        return this.db.run(sql, data.auxiliary_st, data.use_auxiliary_st, data.intro, data.id).changes
    }

    public insert(data: DAO.LibraryExtra_W): Entity.PK {
        const sql = "INSERT INTO library_extra(id, auxiliary_st, use_auxiliary_st, intro) VALUES(?, ?, ?, ?);"
        return this.db.run(sql, data.id, data.auxiliary_st, data.use_auxiliary_st, data.intro).changes
    }

    public deleteById(id: Entity.PK): number {
        return this.db.run('DELETE FROM library_extra WHERE id=?;', id).changes
    }
}

export default LibraryExtraDao