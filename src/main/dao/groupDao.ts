import fs from 'fs'
import DBUtil from '../util/dbUtil'

class Group {
    id: number
    name: string
    librarys: LibraryProfile[]

    constructor(id: number, name: string, librarys: LibraryProfile[]) {
        this.id = id
        this.name = name
        this.librarys = librarys
    }
}

export default class GroupDao {
    db: DBUtil

    constructor(path: string) {
        // 判断文件是否存在
        if (!fs.existsSync(path)) {
            this.db = new DBUtil(path)
            this.createDBGroup()
        }
        this.db = new DBUtil(path)
    }

    createDBGroup(): void {
        this.db.transaction(() => {
            this.db.exec(`
            DROP TABLE IF EXISTS 'group';
            CREATE TABLE 'group'( 'id' INTEGER PRIMARY KEY AUTOINCREMENT, 'name' VARCHAR(255) NOT NULL, 'prev_id' INTEGER DEFAULT 0 NOT NULL, 'next_id' INTEGER DEFAULT 0 NOT NULL, 'is_hide' BOOLEAN DEFAULT 0 NOT NULL, 'gmt_create' DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, 'gmt_modified' DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL ); CREATE INDEX 'idx_group(prev_id)' ON 'group'(prev_id); CREATE INDEX 'idx_group(next_id)' ON 'group'(next_id);
            DROP TABLE IF EXISTS 'library';
            CREATE TABLE 'library'( 'id' INTEGER PRIMARY KEY AUTOINCREMENT, 'name' VARCHAR(255) NOT NULL, 'prev_id' INTEGER DEFAULT 0 NOT NULL, 'next_id' INTEGER DEFAULT 0 NOT NULL, 'is_hide' BOOLEAN DEFAULT 0 NOT NULL, 'gmt_create' DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, 'gmt_modified' DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, 'group_id' INTEGER NOT NULL );
            CREATE INDEX 'idx_library(prev_id)' ON library(prev_id);
            CREATE INDEX 'idx_library(next_id)' ON library(next_id);
            CREATE INDEX 'idx_library(group_id)' ON library(group_id);
            DROP TABLE IF EXISTS 'library_extra';
            CREATE TABLE 'library_extra'( 'id' INTEGER NOT NULL, 'keyword' VARCHAR(255) DEFAULT '' NOT NULL, 'intro' TEXT DEFAULT '' NOT NULL );
            CREATE INDEX 'idx_library_extra(id)' ON library_extra(id);
            CREATE VIEW v_libraryDetail AS SELECT l.id, l.name, l.prev_id, l.next_id, l.is_hide, le.keyword, le.intro, l.gmt_create, l.gmt_modified, l.group_id FROM library l LEFT JOIN library_extra le ON l.id = le.id;
            DROP TRIGGER IF EXISTS del_libraryExtra;
            CREATE TRIGGER del_libraryExtra AFTER DELETE ON library FOR EACH ROW BEGIN DELETE FROM library_extra WHERE id = OLD.id; END;
            DROP TRIGGER IF EXISTS ins_libraryExtra;
            CREATE TRIGGER ins_libraryExtra AFTER INSERT ON library FOR EACH ROW BEGIN INSERT INTO library_extra(id, keyword, intro)VALUES(NEW.id, '', ''); END;
            `)
        })
    }

    getLibraryNameById(id: number): string {
        return this.db.prepare('SELECT name FROM library WHERE id = ?;').pluck().get(id) as string
    }

    getGroups(): Group[] {
        // 获得组的信息
        const gs: GroupProfile[] = this.db.all(`
        WITH RECURSIVE group_list AS (
            SELECT * FROM 'group' WHERE prev_id = 0
            UNION ALL
            SELECT g.* FROM 'group' g JOIN group_list gl ON g.id = gl.next_id WHERE gl.next_id != 0
        ) SELECT id, name, is_hide FROM group_list;`)
        // 根据组的id获得组下的书籍
        return gs.map((g) => new Group(g.id, g.name, this.db.all(`
        WITH RECURSIVE library_list AS (
            SELECT * FROM 'library' WHERE group_id = ? AND prev_id = 0
            UNION ALL
            SELECT l.* FROM 'library' l JOIN library_list ll ON l.id = ll.next_id WHERE l.group_id = ? AND ll.next_id != 0
        ) SELECT id, name, is_hide FROM library_list;`, g.id, g.id)))
    }

    renameGroup(id: number, newName: string): void {
        this.db.run(`UPDATE 'group' SET name = ? WHERE id = ?;`, newName, id)
    }

    renameLibrary(id: number, newName: string): void {
        this.db.run('UPDATE library SET name = ? WHERE id = ?;', newName, id)
    }

    addGroup(name: string) {
        this.db.transaction(() => {
            // 获取第一个group的id
            const headId: number = this.db.prepare(`SELECT id FROM 'group' WHERE prev_id = 0;`).pluck().get() as number
            // 插入数据
            const { changes, lastInsertRowid } = this.db.run(`INSERT INTO 'group'(name) VALUES(?);`, name)
            if (changes) {
                // 把新添加的group的作为新的链表的头,
                if (headId) { this.__insertNode(lastInsertRowid, 0, headId, 'g') }
            } else {
                // 让事务回滚
                throw new Error('insert group error')
            }
        })
    }

    addLibrary(groupId: number, name: string): void {
        this.db.transaction(() => {
            // 获取第一个library的id
            const headId: number = this.db.prepare(`SELECT id FROM 'library' WHERE group_id = ? AND prev_id = 0;`).pluck().get(groupId) as number
            const { changes, lastInsertRowid } = this.db.run(`INSERT INTO 'library'(name, group_id) VALUES(?, ?);`, name, groupId)
            if (changes !== 1) { throw new Error('insert library error') }
            // 把新添加的library的作为新的链表的头, 
            if (headId) { this.__insertNode(lastInsertRowid, 0, headId, 'l') }
        })
    }

    /**
     * 在两个gourp之间插入一个group，不包括写入数据操作，只用于链接。注意prevId, nextId可能为0.
     * @param id 要插入的节点 id
     * @param prevId 插入位置前一个节点 id
     * @param nextId 插入位置后一个节点 id
     */
    __insertNode(id: number | bigint, prevId: number | bigint, nextId: number | bigint, type: 'g' | 'l'): void {
        // 判断是插入到group还是library
        const table = type === 'g' ? `'group'` : `'library'`
        // 1. 修改id的 prevId, nextId
        this.db.run(`UPDATE ${table} SET prev_id = ?, next_id = ?, gmt_modified = CURRENT_TIMESTAMP WHERE id = ?;`, prevId, nextId, id)
        // 2. 修改前一个节点的nextId 为 id, 修改后一个节点的prevId 为 id
        this.db.run(`UPDATE ${table} SET next_id = ?, gmt_modified = CURRENT_TIMESTAMP WHERE id = ?;`, id, prevId)
        this.db.run(`UPDATE ${table} SET prev_id = ?, gmt_modified = CURRENT_TIMESTAMP WHERE id = ?;`, id, nextId)
    }

    deleteGroup(id: number): void {
        this.db.transaction(() => {
            this.__removeNode(id, 'g') // 删除链接关系 
            this.db.run(`DELETE FROM 'group' WHERE id = ?;`, id) // 删除group记录
            // 删除group下的所有library然后会有触发器删除library_extra
            this.db.run('DELETE FROM library WHERE group_id = ?;', id)
        })
    }

    deleteLibrary(id: number): void {
        this.db.transaction(() => {
            this.__removeNode(id, 'l') // 删除链接关系
            this.db.run('DELETE FROM library WHERE id = ?;', id) // 删除library记录
            // TODO 删除library文件

        })
    }

    /**
     * 删除节点，不包括删除数据操作，只用于链接。注意删除的节点可能是头部，尾部，中间
     * @param id 被删除的节点 id
     * @param type 
     */
    __removeNode(id: number | bigint, type: 'g' | 'l'): void {
        const table = type === 'g' ? `'group'` : `'library'`
        // 查询被删除的节点的前一个节点和后一个节点
        const [prevId, nextId] = this.db.prepare(`SELECT prev_id, next_id FROM ${table} WHERE id = ?;`).raw().get(id) as [number, number]
        // 修改前一个节点的nextId为后一个节点的id
        if (prevId) {
            this.db.run(`UPDATE ${table} SET next_id = ?, gmt_modified = CURRENT_TIMESTAMP WHERE id = ?;`, nextId, prevId)
        }
        // 修改后一个节点的prevId为前一个节点的id
        if (nextId) {
            this.db.run(`UPDATE ${table} SET prev_id = ?, gmt_modified = CURRENT_TIMESTAMP WHERE id = ?;`, prevId, nextId)
        }
    }

    sortGroup(currId: number, tarNextId: number): void {
        // 自己移动到自己的位置,会使代码崩溃
        if (this.db.prepare("SELECT next_id = ? FROM 'group' WHERE id = ?;").pluck().get(tarNextId, currId) as number) return
        this.db.transaction(() => {
            this.__removeNode(currId, 'g') // 删除移动节点旧的链接关系
            // 插入位置的前一个节点的id
            const tarPrevId = this.db.prepare("SELECT id FROM 'group' WHERE next_id = ?;").pluck().get(tarNextId) as number
            this.__insertNode(currId, tarPrevId || 0, tarNextId, 'g') // 插入移动节点新的链接关系
        })
    }

    sortLibrary(currId: number, tarNextId: number, groupId: number): void {
        // 自己移动到自己的位置
        const [currNextId, currGroupId] = this.db.prepare('SELECT next_id, group_id FROM library WHERE id = ?').raw().get(currId) as [number, number]
        if (currNextId === tarNextId && currGroupId === groupId) return
        this.db.transaction(() => {
            this.__removeNode(currId, 'l')
            // 插入位置的前一个节点的id,如果tarNextI为0，library有很多，所有需要group_id来确定
            const tarPrevId = this.db.prepare("SELECT id FROM library WHERE next_id = ? AND group_id = ?;").pluck().get(tarNextId, groupId) as number
            this.__insertNode(currId, tarPrevId || 0, tarNextId, 'l')
            // 把当前library的group_id改为目标group的id 
            if (this.db.run(`UPDATE library SET group_id = ? WHERE id = ?;`, groupId, currId).changes !== 1) {
                throw new Error('update library group_id error')
            }
        })
    }
}