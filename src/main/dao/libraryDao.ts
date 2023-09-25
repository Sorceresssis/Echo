import { injectable, inject } from "inversify"
import DI_TYPES from "../DI/DITypes"
import GroupDB from "../db/GroupDB"


@injectable()
class LibraryDao {
	private db: GroupDB

	public constructor(@inject(DI_TYPES.GroupDB) db: GroupDB) {
		this.db = db
	}

	public queryLibraryById(id: number): Domain.Library | undefined {
		return this.db.get(`SELECT id, name, DATETIME(gmt_create, 'localtime') AS createTime, DATETIME(gmt_modified, 'localtime') AS modifiedTime FROM library WHERE id=?;`, id)
	}

	public querySortedLibrarysByGroupId(groupId: number): Domain.LibraryProfile[] {
		return this.db.all(`
        	WITH RECURSIVE library_list AS (
            	SELECT id, name, prev_id, next_id FROM 'library' WHERE group_id = ? AND prev_id = 0
                UNION ALL
                SELECT l.id, l.name, l.prev_id, l.next_id FROM 'library' l JOIN library_list ll ON l.id = ll.next_id WHERE l.group_id = ? AND ll.next_id != 0
            ) SELECT id, name FROM library_list;`, groupId, groupId)
	}

	public queryLibraryIdsByGroupId(groupId: number): number[] {
		return this.db.prepare(`SELECT id FROM library WHERE group_id = ?;`).pluck().all(groupId) as number[]
	}

	public queryLibraryGroupIdById(id: PrimaryKey): number | undefined {
		return this.db.prepare('SELECT group_id FROM library WHERE id = ?;').pluck().get(id) as number | undefined
	}

	/**
	 * 由于每一个Group都有一个prevId为0的节点表示头节点，所以要带上groupId
	 */
	public queryLibraryIdByGroupIdPrevId(groupId: PrimaryKey, prevId: PrimaryKey): number | undefined {
		return this.db.prepare('SELECT id FROM library WHERE group_id = ? AND prev_id = ?;').pluck().get(groupId, prevId) as number | undefined
	}

	public queryLibraryIdByGroupIdNextId(groupId: PrimaryKey, nextId: PrimaryKey): number | undefined {
		return this.db.prepare('SELECT id FROM library WHERE group_id = ? AND next_id = ?;').pluck().get(groupId, nextId) as number | undefined
	}

	public queryLibraryPrevIdById(id: PrimaryKey): number | undefined {
		return this.db.prepare(`SELECT prev_id FROM library WHERE id = ?;`).pluck().get(id) as number | undefined
	}

	public queryLibraryNextIdById(id: PrimaryKey): number | undefined {
		return this.db.prepare(`SELECT next_id FROM library WHERE id = ?;`).pluck().get(id) as number | undefined
	}

	public queryLibraryPrevIdNextIdById(id: PrimaryKey): [number, number] | undefined {
		return this.db.prepare(`SELECT prev_id, next_id FROM library WHERE id = ?;`).raw().get(id) as [number, number] | undefined
	}

	public updateLibraryName(id: PrimaryKey, name: string): number {
		return this.db.run(`UPDATE library SET name = ?, gmt_modified = CURRENT_TIMESTAMP WHERE id = ?;`, name, id).changes
	}

	public updateLibraryGroupId(id: PrimaryKey, groupId: PrimaryKey): number {
		return this.db.run(`UPDATE library SET group_id = ?, gmt_modified = CURRENT_TIMESTAMP WHERE id = ?;`, groupId, id).changes
	}

	public updateLibraryNextId(id: PrimaryKey, nextId: PrimaryKey): number {
		return this.db.run(`UPDATE library SET next_id = ?, gmt_modified = CURRENT_TIMESTAMP WHERE id = ?;`, nextId, id).changes
	}

	public updateLibraryPrevId(id: PrimaryKey, prevId: PrimaryKey): number {
		return this.db.run(`UPDATE library SET prev_id = ?, gmt_modified = CURRENT_TIMESTAMP WHERE id = ?;`, prevId, id).changes
	}

	public updateLibraryPrevIdNextId(id: PrimaryKey, prevId: PrimaryKey, nextId: PrimaryKey): number {
		return this.db.run(`UPDATE library SET prev_id = ?, next_id = ?, gmt_modified = CURRENT_TIMESTAMP WHERE id = ?;`, prevId, nextId, id).changes
	}

	public insertLibrary(name: string, groupId: number): PrimaryKey {
		return this.db.run(`INSERT INTO library(name, group_id) VALUES(?, ?);`, name, groupId).lastInsertRowid
	}

	public deleteLibraryById(id: PrimaryKey): number {
		return this.db.run(`DELETE FROM library WHERE id = ?;`, id).changes
	}
}


export default LibraryDao