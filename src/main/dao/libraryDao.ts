import fs from 'fs'
import path from 'path'
import config from '../app/config'
import fm from '../util/FileManager'
import { oncePerObject } from '../decorator/method.decorator'
import DBUtil from '../util/dbUtil'
import DynamicSqlBuilder, { type SortRule } from '../util/DynamicSqlBuilder'
import tokenizer from "../util/tokenizer"
import { off } from 'process'

type DaoPage<T> = {
    total: number
    rows: T[]
}

export type QueryAuthorsSortRule = {
    field: 'name' | 'id',
    order: 'ASC' | 'DESC'
}

export type QueryTagsSortRule = {
    field: 'title' | 'id',
    order: 'ASC' | 'DESC'
}

export type QueryDirnamesSortRule = {
    field: 'path' | 'id',
    order: 'ASC' | 'DESC'
}

export type QueryRecordsSortRule = {
    field: 'title' | 'rate' | 'id',
    order: 'ASC' | 'DESC'
}

export default class LibraryDao {
    private libraryId: PrimaryKey
    private db: DBUtil

    constructor(libraryId: PrimaryKey) {
        this.libraryId = libraryId
        // 检查目录是否存在
        fm.mkdirsSync(config.getLibraryDir(libraryId))
        // 检查文件是否存在
        const path = config.getLibraryDBFile(libraryId)
        // 判断文件是否存在
        if (!fs.existsSync(path)) {
            this.db = new DBUtil(path)
            this.createTable()
            return
        }
        this.db = new DBUtil(path)
    }

    // ANCHOR DB处理

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

    public destroy(): void {
        this.db.close()
    }

    public executeInTransaction(fn: () => void): void {
        this.db.transaction(fn)
    }

    /** 
     * 给数据库添加一个自定义的REGEXP函数，在查询时使用
     */
    @oncePerObject
    private registerSQLFnRegexp(keywords: string[]): void {
        this.db.function('REGEXP', (text: string) => {
            // 使用 'gi' 标志进行全局和忽略大小写匹配
            const pattern = new RegExp(keywords.join('|'), 'gi')
            const matches = text.match(pattern)
            return matches ? matches.length : 0
        })
    }

    @oncePerObject
    private registerSQLFnPathResolve(): void {
        this.db.function('PATH_RESOLVE', (dirname, basename) => {
            return dirname && basename ?
                path.resolve(dirname, basename)
                : null
        })
    }

    public autoComplete(type: AcType, queryWord: string, ps: number): VO.AcSuggestion[] {
        const table = [
            "SELECT 'record' AS type, id, title AS value, PATH_RESOLVE(?, cover) AS image, REGEXP(title) AS sore FROM record WHERE sore > 0",
            "SELECT 'author' AS type, id, name AS value, PATH_RESOLVE(?, avatar) AS image, REGEXP(name) AS sore FROM author WHERE sore > 0",
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
            if (v === 0 || v === 1) {
                sqlBuilder.appendParam(config.getLibraryImagesDir(this.libraryId))
            }
        })
        sqlBuilder.append(') ORDER BY sore DESC LIMIT 0, ?;', ps)
        // 生成REGEXP函数
        this.registerSQLFnRegexp(tokenizer(queryWord))
        this.registerSQLFnPathResolve()
        return this.db.all(sqlBuilder.getSql(), ...sqlBuilder.getParams())
    }

    // ANCHOR record

    public queryRecordById(id: PrimaryKey): VO.Record | null {
        this.registerSQLFnPathResolve()
        return this.db.get(`
        SELECT 
            r.id, r.title, r.rate,
            PATH_RESOLVE(?, r.cover) AS cover,
            r.hyperlink,
            PATH_RESOLVE(d.path,  r.basename) AS resourcePath,
            DATETIME(gmt_create, 'localtime') AS createTime,
            DATETIME(gmt_modified, 'localtime') AS modifiedTime
        FROM
            record r
            LEFT JOIN dirname d ON r.dirname_id = d.id
        WHERE r.id = ?;`, config.getLibraryImagesDir(this.libraryId), id)
    }

    public queryRecords(
        keyword: string,
        sort: {
            field: 'title' | 'rate' | 'id',
            order: 'ASC' | 'DESC'
        }[],
        options: {
            type: 'author' | 'common' | 'recycle'
            authorId?: number,
        },
        offset: number,
        rowCount: number,
    ): VO.Record[] {
        // authorId, keyWord, sortField, asc, pn, ps
        // asc 评分
        // queryRecordsByAuthor     keyword sort page filter
        // queryRecordsOfRycled     keyword sort page filter
        // queryRecordsCommond      keyword sort page filter
        // sort rate id title
        // filter
        return []
    }

    public queryRecordsOfOrderRateByAuthor(authorId: number): { id: number, title: string, cover: string }[] {
        this.registerSQLFnPathResolve()
        return this.db.all(`SELECT r.id, r.title, PATH_RESOLVE(?, r.cover) AS cover
            FROM record r JOIN record_author ra ON r.id = ra.record_id
            WHERE ra.author_id = ? ORDER BY rate DESC LIMIT 3;`,
            config.getLibraryImagesDir(this.libraryId), authorId)
    }

    public queryRecordIdByTitle(title: string): PrimaryKey | null {
        return this.db.prepare('SELECT id FROM record WHERE title = ?;').pluck().get(title) as PrimaryKey | null
    }

    public queryCountOfRecordsByDirnameId(dirnameId: number): number {
        return 0
    }

    public addRecord(record: Entity.Record): PrimaryKey {
        return this.db.run('INSERT INTO record(title, rate, cover, hyperlink, basename, info_status, dirname_id) VALUES(?,?,?,?,?,?,?);',
            record.title,
            record.rate,
            record.cover,
            record.hyperlink,
            record.basename,
            record.infoStatus,
            record.dirnameId
        ).lastInsertRowid
    }

    public updateRecord(record: Entity.Record): number {
        return this.db.run('UPDATE record SET title=?, rate=?, cover=?, hyperlink=?, basename=?, info_status=?, dirname_id=?, gmt_modified=CURRENT_TIMESTAMP WHERE id = ?;',
            record.title,
            record.rate,
            record.cover,
            record.hyperlink,
            record.basename,
            record.infoStatus,
            record.dirnameId,
            record.id
        ).changes
    }

    public deleteRecordByDirnameId(id: PrimaryKey): number {
        return this.db.run('DELETE FROM record WHERE dirname_id = ?;', id).changes
    }

    public deleteRecordByTagId(id: PrimaryKey): number {
        return this.db.run('DELETE FROM record WHERE id IN (SELECT record_id FROM record_tag WHERE tag_id = ?);', id).changes
    }

    public deleteRecordBySeriesId(id: PrimaryKey): number {
        return this.db.run('DELETE FROM record WHERE id IN (SELECT record_id FROM record_series WHERE series_id = ?);', id).changes
    }

    // ANCHOR record_extra

    public queryRecordExtraByRecordId(id: number): VO.RecordExtra | undefined {
        return this.db.get(`SELECT id, intro, info FROM record_extra WHERE id = ?;`, id)
    }

    public addRecordExtra(recordExtra: Entity.RecordExtra): PrimaryKey {
        return this.db.run('INSERT INTO record_extra(id, intro, info) VALUES(?,?,?);',
            recordExtra.id, recordExtra.intro, recordExtra.info
        ).lastInsertRowid
    }

    public updateRecordExtra(recordExtra: Entity.RecordExtra): number {
        return this.db.run('UPDATE record_extra SET intro=?, info=? WHERE id = ?;',
            recordExtra.intro, recordExtra.info, recordExtra.id
        ).changes
    }

    // ANCHOR author

    public queryAuthor(id: PrimaryKey): VO.Author | null {
        this.registerSQLFnPathResolve()
        return this.db.get(`SELECT id, name, PATH_RESOLVE(?, avatar) AS avatar, intro,
            DATETIME(gmt_create, 'localtime') AS createTime,
            DATETIME(gmt_modified, 'localtime') AS modifiedTime 
        FROM author WHERE id = ?;`, config.getLibraryImagesDir(this.libraryId), id)
    }

    public queryAuthorsByKeyword(
        keyword: string,
        sort: QueryAuthorsSortRule[],
        offset: number,
        rowCount: number,
    ): DaoPage<VO.Author> {
        const rowsSQL = new DynamicSqlBuilder()
        const countSQL = new DynamicSqlBuilder()
        const sortRule: SortRule[] = []

        this.registerSQLFnPathResolve()
        rowsSQL.append(`SELECT id, name, PATH_RESOLVE(?, avatar) AS avatar, intro,
            DATETIME(gmt_create, 'localtime') AS createTime,
            DATETIME(gmt_modified, 'localtime') AS modifiedTime FROM author`,
            config.getLibraryImagesDir(this.libraryId))
        countSQL.append('SELECT COUNT(id) FROM author')

        if (keyword !== '') {    // 没有关键字就不用加where了
            this.registerSQLFnRegexp(tokenizer(keyword))
            rowsSQL.append('WHERE REGEXP(name) > 0')
            sortRule.push({ field: 'REGEXP(name)', order: 'DESC' })
            countSQL.append('WHERE REGEXP(name) > 0')
        }
        sortRule.push(...sort)
        rowsSQL.appendOrderSQL(sortRule).appendLimitSQL(offset, rowCount)

        return {
            total: this.db.prepare(countSQL.getSql()).pluck().get() as number,
            rows: this.db.all(rowsSQL.getSql(), ...rowsSQL.getParams()) as VO.Author[],
        }
    }

    public queryAuthorsByRecordId(id: PrimaryKey): VO.AuthorProfile[] {
        return this.db.all(`
        SELECT a.id, a.name, PATH_RESOLVE(?, a.avatar) AS avatar
        FROM author a JOIN record_author ra ON a.id = ra.author_id
        WHERE ra.record_id = ?;`, config.getLibraryImagesDir(this.libraryId), id)
    }

    public addAuthor(author: Entity.Author): PrimaryKey {
        return this.db.run("INSERT INTO author(name, avatar, intro) VALUES(?,?,?);",
            author.name,
            author.avatar,
            author.intro
        ).lastInsertRowid
    }

    public editAuthor(author: Entity.Author): number {
        return this.db.run("UPDATE author SET name=?, avatar=?, intro=?, gmt_modified=CURRENT_TIMESTAMP WHERE id = ?;",
            author.name,
            author.avatar,
            author.intro,
            author.id
        ).changes
    }

    public deleteAuthor(id: PrimaryKey): void {
        this.db.run("DELETE FROM author WHERE id = ?;", id)
    }

    // ANCHOR tag

    public queryTagsByRecordId(id: number): VO.Tag[] {
        return this.db.all(`SELECT t.id, t.title
        FROM tag t JOIN record_tag rt ON t.id = rt.tag_id
        WHERE rt.record_id = ?;`, id)
    }

    public queryTagsByKeyword(
        keyword: string,
        sort: QueryTagsSortRule[],
        offset: number,
        rowCount: number,
    ): DaoPage<VO.Tag> {
        const rowsSQL = new DynamicSqlBuilder()
        const countSQL = new DynamicSqlBuilder()
        const sortRule: SortRule[] = []

        rowsSQL.append('SELECT id, title FROM tag')
        countSQL.append("SELECT COUNT(id) FROM tag")

        if (keyword !== '') {
            this.registerSQLFnRegexp(tokenizer(keyword))
            rowsSQL.append("WHERE REGEXP(title) > 0")
            sortRule.push({ field: 'REGEXP(title)', order: 'DESC' })
            countSQL.append("WHERE REGEXP(title) > 0")
        }
        sortRule.push(...sort)
        rowsSQL.appendOrderSQL(sortRule).appendLimitSQL(offset, rowCount)

        return {
            total: this.db.prepare(countSQL.getSql()).pluck().get() as number,
            rows: this.db.all(rowsSQL.getSql(), ...rowsSQL.getParams()) as VO.Tag[],
        }
    }

    // public queryTags(
    //     queryWord: string,
    //     sortField: AttributeSortField,
    //     asc: boolean,
    //     pn: number,
    //     ps: number
    // ): DTO.Page<VO.TextAttribute> {
    //     const dataSql = new DynamicSqlBuilder()
    //     const totalSql = new DynamicSqlBuilder()
    //     dataSql.append("SELECT t.id, t.title AS value, COUNT(rt.record_id) AS count FROM tag t LEFT JOIN record_tag rt ON t.id = rt.tag_id")
    //     totalSql.append("SELECT COUNT(id) FROM tag")
    //     if (queryWord.length !== 0) {
    //         dataSql.append("WHERE REGEXP(t.title) > 0")
    //         totalSql.append("WHERE REGEXP(title) > 0")
    //         this.registerSQLFnRegexp(tokenizer(queryWord))
    //     }
    //     dataSql.append("GROUP BY t.id")
    //     if (sortField === 'text') {
    //         dataSql.append('ORDER BY t.title')
    //     } else {
    //         dataSql.append('ORDER BY t.id')
    //     }
    //     if (!asc) {
    //         dataSql.append('DESC')
    //     }
    //     dataSql.append('LIMIT ?, ?;', (pn - 1) * ps, ps)
    //     return {
    //         total: this.db.prepare(totalSql.getSql()).pluck().get() as number,
    //         rows: this.db.all(dataSql.getSql(), ...dataSql.getParams()),
    //     }
    // }

    public addTag(title: string): PrimaryKey {
        return this.db.run("INSERT INTO tag(title) VALUES(?);", title).lastInsertRowid
    }

    public updateTag(id: number, newValue: string): void {
        this.db.run("UPDATE tag SET title = ? WHERE id = ?;", newValue, id)
    }

    public deleteTag(id: PrimaryKey): void {
        this.db.run('DELETE FROM tag WHERE id = ?;', id)
    }

    public queryTagIdByTitle(title: string): PrimaryKey | null {
        return this.db.prepare('SELECT id FROM tag WHERE title = ?;').pluck().get(title) as PrimaryKey | null
    }

    // ANCHOR series

    public querySeriesByRecordId(id: number): VO.Series[] {
        return this.db.all(`SELECT s.id, s.name
        FROM series s JOIN record_series rs ON s.id = rs.series_id
        WHERE rs.record_id = ?;`, id)
    }

    public addSeries(name: string): PrimaryKey {
        return this.db.run("INSERT INTO series(name) VALUES(?);", name).lastInsertRowid
    }

    public querySeriesIdByName(name: string): PrimaryKey | null {
        return this.db.prepare('SELECT id FROM series WHERE name = ?;').pluck().get(name) as PrimaryKey | null
    }

    public deleteSeries(id: PrimaryKey): void {
        this.db.transaction(() => {
            this.db.run('DELETE FROM series WHERE id = ?;', id)
            this.db.run('DELETE FROM record_series WHERE series_id = ?;', id)
        })
    }

    // ANCHOR record_author

    public queryCountOfRecordsByAuthorId(authorId: number): number {
        const sql = 'SELECT COUNT(record_id) FROM record_author WHERE author_id = ?;'
        return this.db.prepare(sql).pluck().get(authorId) as number
    }

    public addRecordAuthor(recordId: PrimaryKey, authorIds: PrimaryKey[]): void {
        const stmt = this.db.prepare("INSERT INTO record_author(record_id, author_id) VALUES(?,?);")
        authorIds.forEach(id => {
            stmt.run(recordId, id)
        })
    }

    public deleteRecordAuthor(recordId: PrimaryKey, authorIds: PrimaryKey[]): void {
        const stmt = this.db.prepare("DELETE FROM record_author WHERE record_id = ? AND author_id = ?;")
        authorIds.forEach(id => {
            stmt.run(recordId, id)
        })
    }

    public deleteRecordAuthorByAuthorId(id: PrimaryKey): void {
        this.db.run("DELETE FROM record_author WHERE author_id = ?;", id)
    }

    // ANCHOR record_tag

    public queryCountOfRecordsByTagId(tagId: number): number {
        return this.db.prepare('SELECT COUNT(record_id) FROM record_tag WHERE tag_id = ?;').pluck().get(tagId) as number
    }

    public addRecordTag(recordId: PrimaryKey, tagIds: PrimaryKey[]): void {
        const stmt = this.db.prepare("INSERT INTO record_tag(record_id, tag_id) VALUES(?,?);")
        tagIds.forEach(id => {
            stmt.run(recordId, id)
        })
    }

    public deleteRecordTag(recordId: PrimaryKey, tagIds: PrimaryKey[]): void {
        const stmt = this.db.prepare("DELETE FROM record_tag WHERE record_id = ? AND tag_id = ?;")
        tagIds.forEach(id => {
            stmt.run(recordId, id)
        })
    }

    public deleteRecordTagByTagId(id: PrimaryKey): void {
        this.db.run('DELETE FROM record_tag WHERE tag_id = ?;', id)
    }

    public updateTagIdOfRecordTag(newTagId: PrimaryKey, oldTagId: PrimaryKey): void {
        // Note 由于 record_tag 中的 record_id 和 tag_id 有联合 UNIQUE 约束
        // 如果 newTagId 与 oldTagId 有相同的record_id, 直接修改会有(record_id, tag_id)重复的情况,导致修改失败
        // 解决方法：分别找出newTagId和oldTagId的record_id，把相同的record_id删除，把不同的record_id修改 
        this.db.transaction(() => {
            this.db.run('DELETE FROM record_tag WHERE record_id IN (SELECT record_id FROM record_tag WHERE tag_id = ? INTERSECT SELECT record_id FROM record_tag WHERE tag_id = ?) AND tag_id = ?;', newTagId, oldTagId, oldTagId)
            this.db.run('UPDATE record_tag SET tag_id = ? WHERE tag_id = ?;', newTagId, oldTagId)
        })
    }

    // ANCHOR record_series

    public addRecordSeries(recordId: PrimaryKey, seriesIds: PrimaryKey[]): void {
        const stmt = this.db.prepare("INSERT INTO record_series(record_id, series_id) VALUES(?,?);")
        seriesIds.forEach(id => {
            stmt.run(recordId, id)
        })
    }

    public deleteRecordSeries(recordId: PrimaryKey, seriesIds: PrimaryKey[]): void {
        const stmt = this.db.prepare("DELETE FROM record_series WHERE record_id = ? AND series_id = ?;")
        seriesIds.forEach(id => {
            stmt.run(recordId, id)
        })
    }

    // ANCHOR dirname

    // public queryDirnames(
    //     queryWord: string,
    //     sortField: AttributeSortField,
    //     asc: boolean,
    //     pn: number,
    //     ps: number
    // ): DTO.Page<VO.TextAttribute> {
    //     const dataSql = new DynamicSqlBuilder()
    //     const totalSql = new DynamicSqlBuilder()
    //     dataSql.append("SELECT d.id, d.path AS value, COUNT(r.id) AS count FROM dirname d LEFT JOIN record r ON d.id = r.dirname_id")
    //     totalSql.append("SELECT COUNT(id) FROM dirname")
    //     if (queryWord.length !== 0) {
    //         dataSql.append("WHERE REGEXP(d.path) > 0")
    //         totalSql.append("WHERE REGEXP(path) > 0")
    //         this.registerSQLFnRegexp(tokenizer(queryWord))
    //     }
    //     dataSql.append("GROUP BY d.id")
    //     if (sortField === 'text') {
    //         dataSql.append('ORDER BY d.title')
    //     } else {
    //         dataSql.append('ORDER BY d.id')
    //     }
    //     if (!asc) {
    //         dataSql.append('DESC')
    //     }
    //     dataSql.append('LIMIT ?, ?;', (pn - 1) * ps, ps)
    //     return {
    //         total: this.db.prepare(totalSql.getSql()).pluck().get() as number,
    //         rows: this.db.all(dataSql.getSql(), ...dataSql.getParams())
    //     }
    // }

    public editDirname(id: number, newValue: string): void {
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

    public addDirname(path: string): PrimaryKey {
        return this.db.run("INSERT INTO dirname(path) VALUES(?);", path).lastInsertRowid
    }

    public deleteDirname(id: PrimaryKey): void {
        this.db.run('DELETE FROM dirname WHERE id = ?;', id)
        this.db.run('UPDATE record SET dirname_id = 0 WHERE dirname_id = ?;', id)
    }

    public queryDirnameIdByPath(name: string): PrimaryKey | null {
        return this.db.prepare('SELECT id FROM dirname WHERE path = ?;').pluck().get(name) as PrimaryKey | null
    }

    /**
     * 以目录为基本单位匹配不是以字符为基本单位匹配 F:\foor\b 是无法与 F:\foor\b 匹配的
     * 一下是C:\foo\bar\baz\qux 的匹配表
     * C:\foo\bar\baz\q     不符合 
     * C:\foo\bar\baz\qux   符合 
     * C:\                  符合 
     * C:                   非法路径
     * @param target 
     * @param replace 
     */
    public startsWithReplaceDirname(target: string, replace: string): number {
        // path.normalize()会保留尾部的分隔符，path.resolve()不保留尾部的分割符
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
        return this.db.run('UPDATE dirname SET path = REPLACE_DP(path) WHERE NEED_REPLACE_DP(path);').changes
    }
}