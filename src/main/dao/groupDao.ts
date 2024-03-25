import { injectable, inject } from "inversify"
import InjectType from "../provider/injectType"
import GroupDB from "../db/GroupDB"

@injectable()
class GroupDao {
    private db: GroupDB

    public constructor(@inject(InjectType.GroupDB) db: GroupDB) {
        this.db = db
    }

    public queryGroupById(id: PrimaryKey): Domain.GroupProfile | undefined {
        return this.db.prepare(`SELECT id, name FROM 'group' WHERE id = ?;`).get(id) as Domain.GroupProfile | undefined
    }

    public querySortedGroupAll(): Domain.GroupProfile[] {
        return this.db.all(`
            WITH RECURSIVE group_list AS (
                SELECT id, name, prev_id, next_id FROM 'group' WHERE prev_id = 0
                UNION ALL
                SELECT g.id, g.name, g.prev_id, g.next_id FROM 'group' g JOIN group_list gl ON g.id = gl.next_id WHERE gl.next_id != 0
            ) SELECT id, name FROM group_list;`)
    }

    /**
     * queryGroupIdBy[PrevId|NextId] : 查询 [前驱为prevId | 后继为nextId]的id. 建议用来查询[头|尾]节点
     * 双向链表是通过0来作为头尾的标记.
     * 优点:用0这个标记可以很方便的查询到[头|尾]节点.
     * 缺点:由于没有把[尾|头]节点作为[前驱|后继]的记录，所以通过[尾|头]节点的id作为参数查询时，返回undefined.
     */
    public queryGroupIdByPrevId(prevId: PrimaryKey): number | undefined {
        return this.db.prepare(`SELECT id FROM 'group' WHERE prev_id = ?;`).pluck().get(prevId) as number | undefined
    }

    public queryGroupIdByNextId(nextId: PrimaryKey): number | undefined {
        return this.db.prepare(`SELECT id FROM 'group' WHERE next_id = ?;`).pluck().get(nextId) as number | undefined
    }

    /**
     * query[PrevId|NextId]ById : 查询主键为id的记录的 [前驱|后驱].
     * 优点:可以很方便的查询到每一个节点的[前驱|后驱]节点.
     * 缺点:无法一步到位的查询到[头|尾]节点.
     */
    public queryGroupPrevIdById(id: PrimaryKey): number | undefined {
        return this.db.prepare(`SELECT prev_id FROM 'group' WHERE id = ?;`).pluck().get(id) as number | undefined
    }

    public queryGroupNextIdById(id: PrimaryKey): number | undefined {
        return this.db.prepare(`SELECT next_id FROM 'group' WHERE id = ?;`).pluck().get(id) as number | undefined
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