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

    /** 
     * 给数据库添加一个自定义的REGEXP函数，在查询时使用
     */
    private registerSQLFnRegexp(keywords: string[]): void {
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
        this.registerSQLFnRegexp(queryWord)
        return this.db.all(sqlBuilder.getSql(), ...sqlBuilder.getParams())
    }

    // 根据属性删除记录
    public deleteRecordByAttribute(): void {
        this.db.transaction(() => {

        })
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

    /* author Recommendation */
    public queryAuthorRecmd(): AuthorRecmd[] {
        return []
    }

    public queryAuthorDetail(id: number): AuthorDetail | undefined {
        return this.db.get(`SELECT id, name, ? || avatar AS avatar, intro, DATETIME(gmt_create, 'localtime') AS createTime, DATETIME(gmt_modified, 'localtime') AS modifiedTime 
            FROM author WHERE id = ?;`, config.getLibraryImagesDir(this.libraryId) + path.sep, id)
    }

    public addAuthor(author: Author): number | bigint {
        return this.db.run("INSERT INTO author(name, avatar, intro) VALUES(?,?,?);",
            author.name,
            author.avatar,
            author.intro
        ).lastInsertRowid
    }

    public editAuthor(author: Author): number {
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
            this.registerSQLFnRegexp(tokenizer(queryWord))
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

    public editTag(id: number, newValue: string) {
        // 如果要修改的tag已经存在，进行重定向
        const tag = newValue.trim()
        const existTag = this.db.prepare('SELECT id FROM tag WHERE title = ?;').pluck().get(tag)
        // 如果没有修改，给的是原值, 会错误的被删除。
        if (existTag && id !== existTag) {
            this.db.transaction(() => {
                // 把record_tag中的tag_id重定向到existTag
                this.db.run('UPDATE record_tag SET tag_id = ? WHERE tag_id = ?;', existTag, id)
                // 然后删除tag
                this.db.run('DELETE FROM tag WHERE id = ?;', id)
            })
        } else {
            this.db.run("UPDATE tag SET title = ? WHERE id = ?;", tag, id) // 修改tag的title 
        }
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
            this.registerSQLFnRegexp(tokenizer(queryWord))
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

    public editDirname(id: number, newValue: string) {
        const dirname = newValue.trim()
        const existDirname = this.db.prepare('SELECT id FROM dirname WHERE path = ?;').pluck().get(dirname)
        if (existDirname && id !== existDirname) {
            this.db.transaction(() => {
                // 把record中的dirname_id重定向到existDirname
                this.db.run('UPDATE record SET dirname_id = ? WHERE dirname_id = ?;', existDirname, id)
                // 然后删除dirname
                this.db.run('DELETE FROM dirname WHERE id = ?;', id)
            })
        } else {
            this.db.run("UPDATE dirname SET path = ? WHERE id = ?;", dirname, id) // 修改dirname的path 
        }
    }

    public deleteDirname(id: number): void {
        this.db.transaction(() => {
            this.db.run('DELETE FROM dirname WHERE id = ?;', id)
            this.db.run('DELETE FROM record WHERE dirname_id = ?;', id)
        })
    }

    /**
     * 以目录为基本单位匹配不是以字符为基本单位匹配 F:\foor\b 是无法与 F:\foor\b 匹配的
     * 一下是C:\foo\bar\baz\qux 的匹配表
     * C:\foo\bar\baz\q     不符合
     * C:\foo\bar\ba        不符合
     * C:\foo\bar\baz\qux   符合
     * C:\foo\bar\baz       符合
     * C:\                  符合 
     * C:                   非法路径
     * C                    非法路径
     * @param target 
     * @param replace 
     */
    public startsWithReplaceDirname(target: string, replace: string) {
        const normalizeTarget = path.normalize(target + path.sep) // 带尾部分隔符的标准化路径,来体现以dir为基本单位匹配
        const normalizeReplace = path.normalize(replace)
        this.db.function('NEED_REPLACE_DP', (source: string) => {
            // F:\foo\与F:\foo\a和F:\foo都匹配
            const normalizeSource = path.normalize(source + path.sep)
            return normalizeSource.startsWith(normalizeTarget) ? 1 : 0
        })
        this.db.function('REPLACE_DP', (source: string) => {
            // 都是经过标准化的路径，用substring直接截取不会出现问题
            return path.resolve(normalizeReplace, path.normalize(source).substring(normalizeTarget.length))
        })
        this.db.run('UPDATE dirname SET path = REPLACE_DP(path) WHERE NEED_REPLACE_DP(path);')
    }

    // 释放资源
    public destroy(): void {
        this.db.close()
    }
}