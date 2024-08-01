import { injectable, inject } from "inversify"
import InjectType from "../provider/injectType"
import { type LibraryEnv } from "../provider/container"


@injectable()
class RecordAuthorRoleDao {
    public constructor(
        @inject(InjectType.LibraryEnv) private libEnv: LibraryEnv
    ) { }

    public selectIdsByRecordIdAuthorId(recordId: number, authorId: number): Entity.PK[] {
        const sql = "SELECT id FROM record_author_role WHERE record_id = ? AND author_id = ? ORDER BY id;"
        return this.libEnv.db.prepare<any[], Entity.PK>(sql).all(recordId, authorId)
    }

    public insert(recordId: number, authorId: number, roleId: number): Entity.PK {
        const sql = "INSERT INTO record_author_role(record_id, author_id, role_id) VALUES (?,?,?);"
        return this.libEnv.db.prepare(sql).run(recordId, authorId, roleId).changes
    }

    public updateRoleIdById(id: number, roleId: number) {
        const sql = "UPDATE record_author_role SET role_id = ? WHERE id = ?;"
        return this.libEnv.db.prepare(sql).run(roleId, id).changes
    }

    public deleteById(id: number) {
        const sql = "DELETE FROM record_author_role WHERE id=?"
        return this.libEnv.db.prepare(sql).run(id).changes
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

    public deleteByRecordIdAuthorId(recordId: number, authorIds: number[]): void {
        const stmt = this.libEnv.db.prepare("DELETE FROM record_author_role WHERE record_id = ? AND author_id = ?;")
        authorIds.forEach(authorId => stmt.run(recordId, authorId))
    }
}


export default RecordAuthorRoleDao