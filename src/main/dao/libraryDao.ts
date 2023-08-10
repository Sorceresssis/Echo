import fs from 'fs'
import config from '../app/config'
import DBUtil from '../util/dbUtil'
import DynamicSqlBuilder from '../util/DynamicSqlBuilder'

export default class LibraryDao {
    db: DBUtil

    constructor(libraryId: number) {
        const path = config.getLibraryDBPath(libraryId)
        // 判断文件是否存在
        if (!fs.existsSync(path)) {
            this.db = new DBUtil(path)
            this.createTable()
            return
        }
        this.db = new DBUtil(path)
    }

    private createTable(): void {
        this.db.transaction(() => {
            this.db.exec(`
            DROP TABLE IF EXISTS 'record';
            CREATE TABLE 'record' ( 'id' INTEGER PRIMARY KEY AUTOINCREMENT, 'title' VARCHAR(255) NOT NULL, 'rate' TINYINT DEFAULT 0 NOT NULL, 'cover' VARCHAR(32) DEFAULT NULL NULL, 'hyperlink' TEXT DEFAULT NULL NULL, 'basename' TEXT DEFAULT NULL NULL, 'info_status' VARCHAR(3) DEFAULT '000' NOT NULL, 'recycled' BOOLEAN DEFAULT 0 NOT NULL, 'dirname_id' INTEGER DEFAULT 0 NOT NULL, 'gmt_create' DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, 'gmt_modified' DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL );
            CREATE INDEX 'idx_record(rate)' ON record (rate);
            CREATE INDEX 'idx_record(info_status)' ON record (info_status); CREATE INDEX 'idx_record(recycled)' ON record (recycled);
            CREATE INDEX 'idx_record(dirname_id)' ON record (dirname_id);
            DROP TABLE IF EXISTS 'record_extra';
            CREATE TABLE 'record_extra' ( 'id' INTEGER PRIMARY KEY, 'intro' TEXT DEFAULT '' NOT NULL, 'info' TEXT DEFAULT '' NOT NULL );
            DROP TABLE IF EXISTS 'dirname';
            CREATE TABLE 'dirname' ( 'id' INTEGER PRIMARY KEY AUTOINCREMENT, 'path' TEXT NOT NULL );
            CREATE UNIQUE INDEX 'uk_dirname(path)' ON dirname (path);
            DROP TABLE IF EXISTS 'author';
            CREATE TABLE 'author' ( 'id' INTEGER PRIMARY KEY AUTOINCREMENT, 'name' VARCHAR(255) NOT NULL, 'avatar' VARCHAR(32), 'intro' TEXT DEFAULT '' NOT NULL, 'gmt_create' DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, 'gmt_modified' DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL );
            DROP TABLE IF EXISTS 'record_author';
            CREATE TABLE 'record_author' ( 'id' INTEGER PRIMARY KEY AUTOINCREMENT, 'record_id' INTEGER NOT NULL, 'author_id' INTEGER NOT NULL );
            CREATE UNIQUE INDEX 'uk_record_author(record_id,author_id)' ON record_author (record_id, author_id);
            CREATE INDEX 'idx_record_author(record_id)' ON record_author (record_id);
            CREATE INDEX 'idx_record_author(author_id)' ON record_author (author_id);
            DROP TABLE IF EXISTS 'tag';
            CREATE TABLE 'tag' ( 'id' INTEGER PRIMARY KEY AUTOINCREMENT, 'title' VARCHAR(255) NOT NULL );
            CREATE UNIQUE INDEX 'uk_tag(title)' ON tag (title);
            DROP TABLE IF EXISTS 'record_tag';
            CREATE TABLE 'record_tag' ( 'id' INTEGER PRIMARY KEY AUTOINCREMENT, 'record_id' INTEGER NOT NULL, 'tag_id' INTEGER NOT NULL );
            CREATE UNIQUE INDEX 'uk_record_tag(record_id,tag_id)' ON record_tag (record_id, tag_id);
            CREATE INDEX 'idx_record_tag(record_id)' ON record_tag (record_id);
            CREATE INDEX 'idx_record_tag(tag_id)' ON record_tag (tag_id);
            DROP TABLE IF EXISTS 'series';
            CREATE TABLE 'series' ( 'id' INTEGER PRIMARY KEY AUTOINCREMENT, 'name' VARCHAR(255) NOT NULL );
            DROP TABLE IF EXISTS 'record_series';
            CREATE TABLE 'record_series' ( 'id' INTEGER PRIMARY KEY AUTOINCREMENT, 'record_id' INTEGER NOT NULL, 'series_id' INTEGER NOT NULL );
            CREATE UNIQUE INDEX 'uk_record_series(record_id,series_id)' ON record_series (record_id, series_id);
            CREATE INDEX 'idx_record_series(record_id)' ON record_series (record_id);
            CREATE INDEX 'idx_record_series(series_id)' ON record_series (series_id);
            `)
        })
    }

    public autoComplete(type: AcType, queryWord: string[], ps: number): AcSuggestion[] {
        const table = [
            "SELECT 'record' AS type, id, title AS value, cover AS image, REGEXP(title) AS sore FROM record WHERE sore > 0",
            "SELECT 'author' AS type, id, name AS value, avatar AS image, REGEXP(name) AS sore FROM author WHERE sore > 0",
            "SELECT 'tag' AS type, id, title AS value, NULL AS image, REGEXP(title) AS sore FROM tag WHERE sore > 0",
            "SELECT 'series' AS type, id, name AS value, NULL AS image, REGEXP(name) AS sore FROM  series WHERE sore > 0",
            "SELECT 'dirname' AS type, id, path AS value, NULL AS image, REGEXP(path) AS sore FROM dirname WHERE sore > 0",
        ]
        const sqlBuilder = new DynamicSqlBuilder()
        sqlBuilder.append("SELECT type, id, value, image FROM (")
        let tIdxs: number[]
        switch (type) {
            case 'search':
                tIdxs = [0, 1, 2]
                break
            case 'record':
                tIdxs = [0]
                break
            case 'author':
                tIdxs = [1]
                break
            case 'tag':
                tIdxs = [2]
                break
            case 'series':
                tIdxs = [3]
                break
            case 'dirname':
                tIdxs = [4]
                break
            default:
                return []
        }
        // 把所有需要查询的表放入sql
        tIdxs.forEach((v, i) => {
            if (i > 0) { sqlBuilder.append('UNION ALL') }
            sqlBuilder.append(table[v])
        })
        sqlBuilder.append(') ORDER BY sore DESC LIMIT 0, ?;', ps)
        // 生成REGEXP函数
        this.generateREGEXPFn(queryWord)
        return this.db.all(sqlBuilder.getSql(), ...sqlBuilder.getParams())
    }

    public addRecord(): void {
    }

    public addRecordTag(): void {
    }

    public deleteRecordTag(): void {
    }

    public addRecordAuthor(): void {
    }

    public deleteRecordAuthor(): void {
    }

    /**
     * return: 新增的作者的id
     */
    public addAuthor(author: AuthorForm): number | bigint {
        return this.db.run("INSERT INTO author(name, avatar, intro) VALUES(?,?,?);",
            author.name,
            author.avatar,
            author.intro
        ).lastInsertRowid
    }

    /**
     * @returns 返回修改的行数
     */
    public editAuthor(author: AuthorForm): number {
        return this.db.run("UPDATE author SET name=?, avatar=?, intro=?, gmt_modified=CURRENT_TIMESTAMP WHERE id = ?;",
            author.name,
            author.avatar,
            author.intro,
            author.id
        ).changes
    }

    public deleteAuthor(id: number): number {
        return this.db.run("DELETE FROM author WHERE id = ?;", id).changes
    }

    public queryAuthorDetail(id: number): AuthorDetail | undefined {
        return this.db.get("SELECT id, name, avatar, intro, DATETIME(gmt_create, 'localtime') AS createTime, DATETIME(gmt_modified, 'localtime') AS modifiedTime FROM author WHERE id = ?;", id)
    }

    /** 给数据库添加一个自定义的REGEXP函数，在查询时使用 */
    private generateREGEXPFn(keywords: string[]): void {
        this.db.function('REGEXP', (text: string) => {
            // 使用 'gi' 标志进行全局和忽略大小写匹配
            const pattern = new RegExp(keywords.join('|'), 'gi')
            const matches = text.match(pattern)
            return matches ? matches.length : 0
        })
    }

    queryTags(queryWord: string, sortField: 'date' | 'text') {

    }


    editTag(id: number, newValue: string): number {
        return this.db.run("UPDATE tag SET title=?, gmt_modified=CURRENT_TIMESTAMP WHERE id = ?;",

        ).changes
    }

    deleteTag(): number {
        return this.db.run('').changes;
    }

    // 释放资源
    destroy(): void {
        this.db.close()
    }
}