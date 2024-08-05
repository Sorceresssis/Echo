import { injectable, inject } from "inversify"
import InjectType from "../provider/injectType"
import type GroupDB from "../db/GroupDB"


@injectable()
class LibraryDao {
	public constructor(
		@inject(InjectType.GroupDB) private db: GroupDB
	) { }

	public getLibraryById(id: Entity.PK): DAO.Library_R | undefined {
		const sql = `
			SELECT id, name,
				DATETIME(create_time, 'localtime') AS create_time,
				DATETIME(update_time, 'localtime') AS update_time
			FROM library WHERE id = ?;
		`
		return this.db.prepare<[Entity.PK], DAO.Library_R>(sql).get(id)
	}

	public getLibrarysSortedByGroupId(groupId: Entity.PK): DAO.Library_R[] {
		const sql = `
        	WITH RECURSIVE list AS (
            	SELECT id, name,
                    DATETIME(create_time, 'localtime') as create_time,
                    DATETIME(update_time, 'localtime') as update_time,
					prev_id, next_id
				FROM 'library'
				WHERE group_id = ? AND prev_id = 0
            UNION ALL
                SELECT l.id, l.name,
                    DATETIME(l.create_time, 'localtime') as create_time,
                    DATETIME(l.update_time, 'localtime') as update_time,
					l.prev_id, l.next_id
				FROM 'library' l
					JOIN list ls ON l.id = ls.next_id
				WHERE l.group_id = ? AND ls.next_id != 0
            ) SELECT id, name, create_time, update_time FROM list;`
		return this.db.prepare<[Entity.PK, Entity.PK], DAO.Library_R>(sql).all(groupId, groupId)
	}

	public getIdsByGroupId(groupId: Entity.PK): Entity.PK[] {
		const sql = "SELECT id FROM library WHERE group_id = ?;"
		return this.db.prepare<[Entity.PK], Entity.PK>(sql).pluck().all(groupId)
	}

	public getGroupIdById(id: Entity.PK): Entity.PK | undefined {
		const sql = "SELECT group_id FROM library WHERE id = ?;"
		return this.db.prepare<[Entity.PK], Entity.PK>(sql).pluck().get(id)
	}

	/**
	 * 由于每一个Group都有一个prevId为0的节点表示头节点，所以要带上groupId
	 */
	public getIdByGroupIdPrevId(groupId: Entity.PK, prevId: Entity.PK): Entity.PK | undefined {
		const sql = "SELECT id FROM library WHERE group_id = ? AND prev_id = ?;"
		return this.db.prepare<any, Entity.PK>(sql).pluck().get(groupId, prevId)
	}

	public getIdByGroupIdNextId(groupId: Entity.PK, nextId: Entity.PK): Entity.PK | undefined {
		const sql = "SELECT id FROM library WHERE group_id = ? AND next_id = ?;"
		return this.db.prepare<any, Entity.PK>(sql).pluck().get(groupId, nextId)
	}

	public getPrevIdById(id: Entity.PK): Entity.PK | undefined {
		const sql = "SELECT prev_id FROM library WHERE id = ?;"
		return this.db.prepare<any, Entity.PK>(sql).pluck().get(id)
	}

	public getNextIdById(id: Entity.PK): Entity.PK | undefined {
		const sql = "SELECT next_id FROM library WHERE id = ?;"
		return this.db.prepare<any, Entity.PK>(sql).pluck().get(id)
	}

	public getPrevIdNextIdById(id: Entity.PK): [Entity.PK, Entity.PK] | undefined {
		const sql = "SELECT prev_id, next_id FROM library WHERE id = ?;"
		return this.db.prepare<any, [Entity.PK, Entity.PK]>(sql).raw().get(id)
	}

	public updateNameById(id: Entity.PK, name: string): number {
		const sql = "UPDATE library SET name = ?, update_time = CURRENT_TIMESTAMP WHERE id = ?;"
		return this.db.run(sql, name, id).changes
	}

	public updateGroupIdById(id: Entity.PK, groupId: Entity.PK): number {
		const sql = "UPDATE library SET group_id = ? WHERE id = ?;"
		return this.db.run(sql, groupId, id).changes
	}

	public updateNextIdById(id: Entity.PK, nextId: Entity.PK): number {
		const sql = "UPDATE library SET next_id = ? WHERE id = ?;"
		return this.db.run(sql, nextId, id).changes
	}

	public updatePrevIdById(id: Entity.PK, prevId: Entity.PK): number {
		const sql = "UPDATE library SET prev_id = ? WHERE id = ?;"
		return this.db.run(sql, prevId, id).changes
	}

	public updatePrevIdNextIdById(id: Entity.PK, prevId: Entity.PK, nextId: Entity.PK): number {
		const sql = "UPDATE library SET prev_id = ?, next_id = ? WHERE id = ?;"
		return this.db.run(sql, prevId, nextId, id).changes
	}

	public insert(name: string, groupId: number): Entity.PK {
		const sql = "INSERT INTO library(name, group_id) VALUES(?, ?);"
		return this.db.run(sql, name, groupId).lastInsertRowid as Entity.PK
	}

	public deleteById(id: Entity.PK): number {
		const sql = "DELETE FROM library WHERE id = ?;"
		return this.db.run(sql, id).changes
	}
}


export default LibraryDao