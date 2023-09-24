import { injectable, inject } from "inversify"
import TYPES from "../DI/types"
import GroupDB from "../db/GroupDB"

@injectable()
class GroupDao {
    private db: GroupDB

    public constructor(@inject(TYPES.GroupDB) db: GroupDB) {
        this.db = db
    }

    public querySortedGroupAll(): VO.GroupProfile[] {
        return this.db.all(`
            WITH RECURSIVE group_list AS (
                SELECT id, name, prev_id, next_id FROM 'group' WHERE prev_id = 0
                UNION ALL
                SELECT g.id, g.name, g.prev_id, g.next_id FROM 'group' g JOIN group_list gl ON g.id = gl.next_id WHERE gl.next_id != 0
            ) SELECT id, name FROM group_list;`)
    }

    /**
     * PrevId和NextId都可以为0，表示头部或者尾部。
     * 比queryGroupPrevIdNextIdById更加通用
     */
    public queryGroupIdByPrevId(prevId: PrimaryKey): number | undefined {
        return this.db.prepare(`SELECT id FROM 'group' WHERE prev_id = ?;`).pluck().get(prevId) as number | undefined
    }

    public queryGroupIdByNextId(nextId: PrimaryKey): number | undefined {
        return this.db.prepare(`SELECT id FROM 'group' WHERE next_id = ?;`).pluck().get(nextId) as number | undefined
    }

    public queryGroupPrevIdNextIdById(id: PrimaryKey): [number, number] | undefined {
        return this.db.prepare(`SELECT prev_id, next_id FROM 'group' WHERE id = ?;`).raw().get(id) as [number, number] | undefined
    }

    public updateGroupName(id: PrimaryKey, name: string): number {
        return this.db.run(`UPDATE 'group' SET name = ? WHERE id = ?;`, name, id).changes
    }

    public updateGroupNextId(id: PrimaryKey, nextId: PrimaryKey): number {
        return this.db.run(`UPDATE 'group' SET next_id = ?, gmt_modified = CURRENT_TIMESTAMP WHERE id = ?;`, nextId, id).changes
    }

    public updateGroupPrevId(id: PrimaryKey, prevId: PrimaryKey): number {
        return this.db.run(`UPDATE 'group' SET prev_id = ?, gmt_modified = CURRENT_TIMESTAMP WHERE id = ?;`, prevId, id).changes
    }

    public updateGroupPrevIdNextId(id: PrimaryKey, prevId: PrimaryKey, nextId: PrimaryKey): number {
        return this.db.run(`UPDATE 'group' SET prev_id = ?, next_id = ?, gmt_modified = CURRENT_TIMESTAMP WHERE id = ?;`, prevId, nextId, id).changes
    }

    public insertGroup(name: string): PrimaryKey {
        return this.db.run(`INSERT INTO 'group'(name) VALUES(?);`, name).lastInsertRowid
    }

    public deleteGroupById(id: PrimaryKey): number {
        return this.db.run(`DELETE FROM 'group' WHERE id = ?;`, id).changes
    }
}


export default GroupDao