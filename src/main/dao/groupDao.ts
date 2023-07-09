import fs from 'fs'
import { DBUtil } from '../util/dbUtil'
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

export class GroupDao {
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
            DROP TABLE IF EXISTS 'library'; CREATE TABLE 'library'( 'id' INTEGER PRIMARY KEY AUTOINCREMENT, 'name' VARCHAR(255) NOT NULL, 'prev_id' INTEGER DEFAULT 0 NOT NULL, 'next_id' INTEGER DEFAULT 0 NOT NULL, 'is_hide' BOOLEAN DEFAULT 0 NOT NULL, 'gmt_create' DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, 'gmt_modified' DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, 'group_id' INTEGER NOT NULL );
            CREATE INDEX 'idx_library(prev_id)' ON library(prev_id);
            CREATE INDEX 'idx_library(next_id)' ON library(next_id);
            CREATE INDEX 'idx_library(group_id)' ON library(group_id);
            DROP TABLE IF EXISTS 'library_extra';
            CREATE TABLE 'library_extra'( 'id' INTEGER NOT NULL, 'keyword' VARCHAR(255) DEFAULT '' NOT NULL, 'intro' TEXT DEFAULT '' NOT NULL );
            CREATE INDEX 'idx_library_extra(id)' ON library_extra(id);`)
        })
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

    addGroup(name: string) {
        this.db.run(`INSERT INTO 'group' (name) VALUES (?)`, name)
    }

    deleteGroup(id: number) {

    }

    renameGroup(id: number, newName: string) {

    }

    updateGroupSort(currentId: number, targetId: number) {

    }

    getLibraryNameByID(id: number): string {
        return (this.db.get(`SELECT name FROM library WHERE id = ?;`, id) as { name: string }).name
    }

    addLibrary(groupID: number, name: string) {
    }
}