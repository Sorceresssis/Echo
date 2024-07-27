import { injectable, inject } from "inversify"
import InjectType from "../provider/injectType"
import type GroupDB from "../db/GroupDB"

@injectable()
class GroupDao {
    public constructor(
        @inject(InjectType.GroupDB) private db: GroupDB
    ) { }

    public getGroupById(id: Entity.PK): BO.Group | undefined {
        const sql = `
            SELECT id, name,
                DATETIME(create_time, 'localtime') as create_time,
                DATETIME(update_time, 'localtime') as update_time
            FROM 'group' WHERE id = ?;`
        return this.db.prepare<[Entity.PK], BO.Group>(sql).get(id)
    }

    public getGroupsSorted(): BO.Group[] {
        const sql = `
            WITH RECURSIVE list AS (
                SELECT id, name,
                    DATETIME(create_time, 'localtime') as create_time,
                    DATETIME(update_time, 'localtime') as update_time,
                    prev_id, next_id
                FROM 'group' WHERE prev_id = 0
            UNION ALL
                SELECT g.id, g.name,
                    DATETIME(g.create_time, 'localtime') as create_time,
                    DATETIME(g.update_time, 'localtime') as update_time,
                    g.prev_id, g.next_id
                FROM 'group' g
                    JOIN list l ON g.id = l.next_id
                WHERE l.next_id != 0
            ) SELECT id, name, create_time, update_time FROM list;
        `
        return this.db.prepare<[], BO.Group>(sql).all()
    }

    /**
     * queryGroupIdBy[PrevId|NextId] : 查询 [前驱为prevId | 后继为nextId]的id. 建议用来查询[头|尾]节点
     * 双向链表是通过0来作为头尾的标记.
     * 优点:用0这个标记可以很方便的查询到[头|尾]节点.
     * 缺点:由于没有把[尾|头]节点作为[前驱|后继]的记录，所以通过[尾|头]节点的id作为参数查询时，返回undefined.
     */
    public getIdByPrevId(prevId: Entity.PK): Entity.PK | undefined {
        const sql = "SELECT id FROM 'group' WHERE prev_id = ?;"
        return this.db.prepare<[Entity.PK], Entity.PK>(sql).pluck().get(prevId)
    }

    public getIdByNextId(nextId: Entity.PK): Entity.PK | undefined {
        const sql = "SELECT id FROM 'group' WHERE next_id = ?;"
        return this.db.prepare<[Entity.PK], Entity.PK>(sql).pluck().get(nextId)
    }

    /**
     * get[PrevId|NextId]ById : 查询主键为id的记录的 [前驱|后驱].
     * 优点:可以很方便的查询到每一个节点的[前驱|后驱]节点.
     * 缺点:无法一步到位的查询到[头|尾]节点.
     */
    public getPrevIdById(id: Entity.PK): Entity.PK | undefined {
        const sql = "SELECT prev_id FROM 'group' WHERE id = ?;"
        return this.db.prepare<[Entity.PK], Entity.PK>(sql).pluck().get(id)
    }

    public getNextIdById(id: Entity.PK): Entity.PK | undefined {
        const sql = "SELECT next_id FROM 'group' WHERE id = ?;"
        return this.db.prepare<[Entity.PK], Entity.PK>(sql).pluck().get(id)
    }

    public getPrevIdNextIdById(id: Entity.PK): [Entity.PK, Entity.PK] | undefined {
        const sql = "SELECT prev_id, next_id FROM 'group' WHERE id = ?;"
        return this.db.prepare<[Entity.PK], [Entity.PK, Entity.PK]>(sql).raw().get(id)
    }

    public updateNameById(id: Entity.PK, name: string): number {
        const sql = "UPDATE 'group' SET name = ?, update_time = CURRENT_TIMESTAMP WHERE id = ?;"
        return this.db.run(sql, name, id).changes
    }

    public updateNextIdById(id: Entity.PK, nextId: Entity.PK): number {
        const sql = "UPDATE 'group' SET next_id = ? WHERE id = ?;"
        return this.db.run(sql, nextId, id).changes
    }

    public updatePrevIdById(id: Entity.PK, prevId: Entity.PK): number {
        const sql = "UPDATE 'group' SET prev_id = ? WHERE id = ?;"
        return this.db.run(sql, prevId, id).changes
    }

    public updatePrevIdNextIdById(id: Entity.PK, prevId: Entity.PK, nextId: Entity.PK): number {
        const sql = "UPDATE 'group' SET prev_id = ?, next_id = ? WHERE id = ?;"
        return this.db.run(sql, prevId, nextId, id).changes
    }

    public insert(name: string): Entity.PK {
        const sql = "INSERT INTO 'group'(name) VALUES(?);"
        return this.db.run(sql, name).lastInsertRowid as Entity.PK
    }

    public deleteById(id: Entity.PK): number {
        const sql = "DELETE FROM 'group' WHERE id = ?;"
        return this.db.run(sql, id).changes
    }
}


export default GroupDao