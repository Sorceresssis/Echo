import { injectable, inject } from "inversify"
import InjectType from "../provider/injectType"
import { type LibraryEnv } from "../provider/container"


@injectable()
class RoleDao {
    public constructor(
        @inject(InjectType.LibraryEnv) private libEnv: LibraryEnv
    ) { }

    public queryRoles(): Entity.Role[] {
        const sql = "SELECT id, name from role;"
        return this.libEnv.db.prepare<[], Entity.Role>(sql).all()
    }

    public queryRolesByRecordIdAuthorId(recordId: Entity.PK, authorId: Entity.PK): Entity.Role[] {
        const sql = `
            SELECT r.id, r.name
            FROM record_author_role rar
	            JOIN role r ON rar.role_id = r.id
            WHERE rar.record_id = ? AND rar.author_id = ?
            ORDER BY rar.id;`
        return this.libEnv.db.prepare<any[], Entity.Role>(sql).all(recordId, authorId)
    }

    public queryByName(name: string): Entity.Role | undefined {
        const sql = "SELECT id, name from role WHERE name = ?;"
        return this.libEnv.db.prepare<[string], Entity.Role>(sql).get(name)
    }

    public insert(name: string): Entity.PK {
        const sql = "INSERT INTO role(name) VALUES (?);"
        return this.libEnv.db.prepare(sql).run(name).lastInsertRowid as Entity.PK
    }

    public update(id: Entity.PK, name: string): Entity.PK {
        const sql = "UPDATE role SET name = ? WHERE id = ?"
        return this.libEnv.db.prepare(sql).run(name, id).changes
    }

    public delete(id: Entity.PK): number {
        const sql = "DELETE FROM role WHERE id = ?;"
        return this.libEnv.db.prepare(sql).run(id).changes
    }
}


export default RoleDao