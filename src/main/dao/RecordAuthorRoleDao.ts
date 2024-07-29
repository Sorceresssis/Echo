import { injectable, inject } from "inversify"
import InjectType from "../provider/injectType"
import { type LibraryEnv } from "../provider/container"


@injectable()
class RecordAuthorRoleDao {
    public constructor(
        @inject(InjectType.LibraryEnv) private libEnv: LibraryEnv
    ) { }

    public selectIdByRecordIdByAuthorId(recordId: number, authorId: number) {
        const sql = "SELECT id FROM record_author_role WHERE record_id = ? AND author_id = ?;"
        return this.libEnv.db.prepare<any[], Entity.PK>(sql).get(recordId, authorId)
    }

    public insert(recordId: number, authorId: number, roleId: number): Entity.PK {
        const sql = "INSERT INTO record_author_role(record_id, author_id, role_id) VALUES (?,?,?);"
        return this.libEnv.db.prepare(sql).run(recordId, authorId, roleId).changes
    }

    public deleteByRecordId(recordId: number) {
        const sql = "DELETE FROM record_author_role WHERE record_id=?;"
        return this.libEnv.db.prepare(sql).run(recordId).changes
    }

    public deleteByAuthorId(authorId: number) {
        const sql = "DELETE FROM record_author_role WHERE author_id=?;"
        return this.libEnv.db.prepare(sql).run(authorId).changes
    }

    public deleteByRoleId(roleId: number) {
        const sql = "DELETE FROM record_author_role WHERE role_id=?;"
        return this.libEnv.db.prepare(sql).run(roleId).changes
    }
}


export default RecordAuthorRoleDao