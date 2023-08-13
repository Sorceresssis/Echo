import fs from 'fs'
import path from 'path'
import config from '../app/config'
import DBUtil from '../util/dbUtil'
import DynamicSqlBuilder from '../util/DynamicSqlBuilder'
import tokenizer from "../util/tokenizer"

export default class LibraryDao {
    private libraryId: number
    private db: DBUtil

    constructor(libraryId: number) {
        this.libraryId = libraryId
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

    /** 给数据库添加一个自定义的REGEXP函数，在查询时使用 */
    private generateREGEXPFn(keywords: string[]): void {
        this.db.function('REGEXP', (text: string) => {
            // 使用 'gi' 标志进行全局和忽略大小写匹配
            const pattern = new RegExp(keywords.join('|'), 'gi')
            const matches = text.match(pattern)
            return matches ? matches.length : 0
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
        const tableIdxs = {
            search: [0, 1, 2],
            record: [0],
            author: [1],
            tag: [2],
            series: [3],
            dirname: [4],
        }
        // 把所有需要查询的表放入sql
        tableIdxs[type].forEach((v, i) => {
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

    public queryAuthorDetail(id: number): AuthorDetail | undefined {
        return this.db.get(`SELECT id, name, ? || avatar AS avatar, intro, DATETIME(gmt_create, 'localtime') AS createTime, DATETIME(gmt_modified, 'localtime') AS modifiedTime 
            FROM author WHERE id = ?;`, config.getLibraryImagesDir(this.libraryId) + path.sep, id)
    }

    /* author Recommendation */
    public queryAuthorRecmd(): AuthorRecmd[] {
        return []
    }

    public addAuthor(author: EditAuthorForm): number | bigint {
        return this.db.run("INSERT INTO author(name, avatar, intro) VALUES(?,?,?);",
            author.name,
            author.avatar || null,
            author.intro
        ).lastInsertRowid
    }

    public editAuthor(author: EditAuthorForm): number {
        return this.db.run("UPDATE author SET name=?, avatar=?, intro=?, gmt_modified=CURRENT_TIMESTAMP WHERE id = ?;",
            author.name,
            author.avatar,
            author.intro,
            author.id
        ).changes
    }

    public deleteAuthor(id: number): void {
        this.db.transaction(() => {
            this.db.run("DELETE FROM author WHERE id = ?;", id)
            this.db.run("DELETE FROM record_author WHERE author_id = ?;", id)
        })
    }

    public queryTags(queryWord: string, sortField: AttributeSortField, asc: boolean, pn: number, ps: number) {
        const dataSql = new DynamicSqlBuilder()
        const totalSql = new DynamicSqlBuilder()
        dataSql.append("SELECT t.id, t.title AS value, COUNT(rt.record_id) AS count FROM tag t LEFT JOIN record_tag rt ON t.id = rt.tag_id")
        totalSql.append("SELECT COUNT(id) FROM tag")
        if (queryWord.length !== 0) {
            dataSql.append("WHERE REGEXP(t.title) > 0")
            totalSql.append("WHERE REGEXP(title) > 0")
            this.generateREGEXPFn(tokenizer(queryWord))
        }
        dataSql.append("GROUP BY t.id")
        if (sortField === 'text') {
            dataSql.append('ORDER BY t.title')
        } else {
            dataSql.append('ORDER BY t.id')
        }
        if (!asc) {
            dataSql.append('DESC')
        }
        dataSql.append('LIMIT ?, ?;', (pn - 1) * ps, ps)
        return {
            total: this.db.prepare(totalSql.getSql()).pluck().get(),
            data: this.db.all(dataSql.getSql(), ...dataSql.getParams())
        }
    }

    public editTag(id: number, newValue: string): number {
        return this.db.run("UPDATE tag SET title = ? WHERE id = ?;", newValue.trim(), id).changes
    }

    public deleteTag(id: number): void {
        this.db.transaction(() => {
            this.db.run('DELETE FROM tag WHERE id = ?;', id)
            this.db.run('DELETE FROM record_tag WHERE tag_id = ?;', id)
        })
    }

    public queryDirnames(queryWord: string, sortField: AttributeSortField, asc: boolean, pn: number, ps: number) {
        const dataSql = new DynamicSqlBuilder()
        const totalSql = new DynamicSqlBuilder()
        dataSql.append("SELECT d.id, d.path AS value, COUNT(r.id) AS count FROM dirname d LEFT JOIN record r ON d.id = r.dirname_id")
        totalSql.append("SELECT COUNT(id) FROM dirname")
        if (queryWord.length !== 0) {
            dataSql.append("WHERE REGEXP(d.path) > 0")
            totalSql.append("WHERE REGEXP(path) > 0")
            this.generateREGEXPFn(tokenizer(queryWord))
        }
        dataSql.append("GROUP BY d.id")
        if (sortField === 'text') {
            dataSql.append('ORDER BY d.title')
        } else {
            dataSql.append('ORDER BY d.id')
        }
        if (!asc) {
            dataSql.append('DESC')
        }
        dataSql.append('LIMIT ?, ?;', (pn - 1) * ps, ps)
        return {
            total: this.db.prepare(totalSql.getSql()).pluck().get(),
            data: this.db.all(dataSql.getSql(), ...dataSql.getParams())
        }
    }

    public editDirname(id: number, newValue: string): number {
        return this.db.run("UPDATE dirname SET path = ? WHERE id = ?;", newValue.trim(), id).changes
    }

    public deleteDirname(id: number): void {
        this.db.transaction(() => {
            this.db.run('DELETE FROM dirname WHERE id = ?;', id)
            this.db.run('DELETE FROM record WHERE dirname_id = ?;', id)
        })
    }

    // 释放资源
    public destroy(): void {
        this.db.close()
    }
}