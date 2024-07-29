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

    public queryByName(name: string): Entity.Role | undefined {
        const sql = "SELECT id, name from role WHERE name = ?;"
        return this.libEnv.db.prepare<[string], Entity.Role>(sql).get(name)
    }

    public insert(name: string): Entity.PK {
        const sql = "INSERT INTO role(name) VALUES (?);"
        return this.libEnv.db.prepare(sql).run(name).lastInsertRowid as Entity.PK
    }

    public update(id: number, name: string): Entity.PK {
        const sql = "UPDATE role SET name = ? WHERE id = ?"
        return this.libEnv.db.prepare(sql).run(name, id).changes
    }

    public delete(id: Entity.PK): number {
        const sql = "DELETE FROM role WHERE id = ?;"
        return this.libEnv.db.prepare(sql).run(id).changes
    }
}


export default RoleDao