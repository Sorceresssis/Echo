import { injectable, inject } from "inversify"
import InjectType from "../provider/injectType"
import { type LibraryEnv } from "../provider/container"


@injectable()
class RecordAuthorRoleDao {
    public constructor(
        @inject(InjectType.LibraryEnv) private libEnv: LibraryEnv
    ) { }

    public selectIdsByRecordIdAuthorId(recordId: Entity.PK, authorId: Entity.PK): Entity.PK[] {
        const sql = "SELECT id FROM record_author_role WHERE record_id = ? AND author_id = ? ORDER BY id;"
        return this.libEnv.db.prepare<any[], Entity.PK>(sql).pluck().all(recordId, authorId)
    }

    public insert(recordId: Entity.PK, authorId: Entity.PK, roleId: Entity.PK): Entity.PK {
        const sql = "INSERT INTO record_author_role(record_id, author_id, role_id) VALUES (?,?,?);"
        return this.libEnv.db.prepare(sql).run(recordId, authorId, roleId).changes
    }

    public updateRoleIdById(id: Entity.PK, roleId: Entity.PK) {
        const sql = "UPDATE record_author_role SET role_id = ? WHERE id = ?;"
        return this.libEnv.db.prepare(sql).run(roleId, id).changes
    }

    public updateRoleIdByRoleId(oldId: Entity.PK, newId: Entity.PK) {
        // 去掉重复的, 解决unique 的约束
        const deleteSql = `
            DELETE FROM record_author_role
            WHERE id IN (
            	SELECT r.id
            	FROM record_author_role r
            		JOIN (
            			SELECT record_id, author_id
            			FROM record_author_role
            			WHERE role_id = ?
            			INTERSECT
            			SELECT record_id, author_id
            			FROM record_author_role
            			WHERE role_id = ?
            		) AS i ON r.record_id = i.record_id AND r.author_id = i.author_id
            	WHERE r.role_id = ?
            	);`
        this.libEnv.db.prepare(deleteSql).run(oldId, newId, oldId)
        const updateSql = "UPDATE record_author_role SET role_id = ? WHERE role_id = ?;"
        return this.libEnv.db.prepare(updateSql).run(newId, oldId).changes
    }

    public deleteById(id: Entity.PK) {
        const sql = "DELETE FROM record_author_role WHERE id=?"
        return this.libEnv.db.prepare(sql).run(id).changes
    }

    public deleteByRecordId(recordId: Entity.PK) {
        const sql = "DELETE FROM record_author_role WHERE record_id=?;"
        return this.libEnv.db.prepare(sql).run(recordId).changes
    }

    public deleteByAuthorId(authorId: Entity.PK) {
        const sql = "DELETE FROM record_author_role WHERE author_id=?;"
        return this.libEnv.db.prepare(sql).run(authorId).changes
    }

    public deleteByRoleId(roleId: Entity.PK) {
        const sql = "DELETE FROM record_author_role WHERE role_id=?;"
        return this.libEnv.db.prepare(sql).run(roleId).changes
    }

    public deleteByRecordIdAuthorId(recordId: Entity.PK, authorIds: Entity.PK[]): void {
        const stmt = this.libEnv.db.prepare("DELETE FROM record_author_role WHERE record_id = ? AND author_id = ?;")
        authorIds.forEach(authorId => stmt.run(recordId, authorId))
    }
}


export default RecordAuthorRoleDao