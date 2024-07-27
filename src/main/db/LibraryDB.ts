import { app, dialog } from "electron"
import fs from "fs"
import appPaths from "../app/appPaths"
import DB from "./DB"
import { oncePerObject } from '../decorator/method.decorator'
import tokenizer from "../utils/tokenizer"

class LibraryDB extends DB {
    private readonly DB_VERSION = 1;
    private readonly DB_INFO_SQL = `
		DROP TABLE IF EXISTS 'db_info';
		CREATE TABLE 'db_info' ( 'name' TEXT PRIMARY KEY, 'value' TEXT NOT NULL );
		INSERT INTO 'db_info' VALUES('version', '${this.DB_VERSION}');`


    public constructor(libraryId: PrimaryKey) {
        fs.mkdirSync(appPaths.getLibraryDirPath(libraryId), { recursive: true })
        const path = appPaths.getLibraryDBFilePath(libraryId)

        const isExists = fs.existsSync(path)

        super(path)

        if (isExists) {
            try {
                const db_info: any = {};
                this.all(`SELECT name, value FROM 'db_info'`).forEach((row) => {
                    db_info[row.name] = row.value
                })
                const loadingDBVersion = Number(db_info['version'])
                // 读取的数据库版本高于当前软件支持的版本，就抛出异常，提示用户更新软件
                if (loadingDBVersion > this.DB_VERSION) {
                    // '软件版本过低', '请更新软件到最新版本'
                    dialog.showErrorBox('The software version is too low', 'Please update the software to the latest version')
                    app.quit()
                }

                // 读取的数据库版本低于当前软件支持的版本，就升级数据库
                if (loadingDBVersion < this.DB_VERSION) {
                    this.upgrade(loadingDBVersion)
                }
            } catch {
                this.defineData
            }
        } else {
            this.defineData()
        }
    }

    private defineData(): void {
        this.transactionExec(() => {
            // 创建db_info表
            this.exec(this.DB_INFO_SQL)

            this.exec(`
				DROP TABLE IF EXISTS 'record'; CREATE TABLE 'record' ( 'id' INTEGER PRIMARY KEY AUTOINCREMENT, 'title' VARCHAR(255) NOT NULL, 'translated_title' VARCHAR(255) DEFAULT '' NOT NULL, 'rate' TINYINT DEFAULT 0 NOT NULL, 'hyperlink' TEXT DEFAULT NULL NULL, 'release_date' DATE DEFAULT NULL NULL, 'dirname_id' INTEGER DEFAULT 0 NOT NULL, 'basename' TEXT DEFAULT NULL NULL, 'recycled' BOOLEAN DEFAULT 0 NOT NULL, 'info_status' VARCHAR(3) DEFAULT '000' NOT NULL, 'tag_author_sum' TEXT DEFAULT NULL NULL, 'search_text' TEXT DEFAULT '' NOT NULL, 'gmt_create' DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, 'gmt_modified' DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL ); CREATE INDEX 'idx_record(rate)' ON record (rate); CREATE INDEX 'idx_record(info_status)' ON record (info_status); CREATE INDEX 'idx_record(recycled)' ON record (recycled); CREATE INDEX 'idx_record(dirname_id)' ON record (dirname_id); CREATE INDEX 'idx_record(release_date)' ON record (release_date); CREATE UNIQUE INDEX 'uk_record(dirname_id, basename)' ON record (dirname_id, basename); DROP TABLE IF EXISTS 'record_extra'; CREATE TABLE 'record_extra' ( 'id' INTEGER PRIMARY KEY, 'plot' TEXT DEFAULT '' NOT NULL, 'reviews' TEXT DEFAULT '' NOT NULL, 'info' TEXT DEFAULT '' NOT NULL ); DROP TABLE IF EXISTS 'dirname'; CREATE TABLE 'dirname' ( 'id' INTEGER PRIMARY KEY AUTOINCREMENT, 'path' TEXT NOT NULL ); CREATE UNIQUE INDEX 'uk_dirname(path)' ON dirname (path); DROP TABLE IF EXISTS 'author'; CREATE TABLE 'author' ( 'id' INTEGER PRIMARY KEY AUTOINCREMENT, 'name' VARCHAR(255) NOT NULL, 'intro' TEXT DEFAULT '' NOT NULL, 'gmt_create' DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, 'gmt_modified' DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL ); CREATE UNIQUE INDEX 'uk_author(name)' ON author (name); DROP TABLE IF EXISTS 'role'; CREATE TABLE 'role' ( 'id' INTEGER PRIMARY KEY AUTOINCREMENT, 'name' VARCHAR(50) NOT NULL ); CREATE UNIQUE INDEX 'uk_role(name)' ON role (name); DROP TABLE IF EXISTS 'record_author'; CREATE TABLE 'record_author' ( 'id' INTEGER PRIMARY KEY AUTOINCREMENT, 'record_id' INTEGER NOT NULL, 'author_id' INTEGER NOT NULL, 'role_id' INTEGER DEFAULT 0 NOT NULL ); CREATE INDEX 'idx_record_author(record_id)' ON record_author (record_id); CREATE INDEX 'idx_record_author(author_id)' ON record_author (author_id); CREATE INDEX 'idx_record_author(role_id)' ON record_author (role_id); CREATE UNIQUE INDEX 'uk_record_author(record_id,author_id,role_id)' ON record_author (record_id, author_id, role_id); DROP TABLE IF EXISTS 'tag'; CREATE TABLE 'tag' ( 'id' INTEGER PRIMARY KEY AUTOINCREMENT, 'title' VARCHAR(255) NOT NULL ); CREATE UNIQUE INDEX 'uk_tag(title)' ON tag (title); DROP TABLE IF EXISTS 'record_tag'; CREATE TABLE 'record_tag' ( 'id' INTEGER PRIMARY KEY AUTOINCREMENT, 'record_id' INTEGER NOT NULL, 'tag_id' INTEGER NOT NULL ); CREATE INDEX 'idx_record_tag(record_id)' ON record_tag (record_id); CREATE INDEX 'idx_record_tag(tag_id)' ON record_tag (tag_id); CREATE UNIQUE INDEX 'uk_record_tag(record_id,tag_id)' ON record_tag (record_id, tag_id); DROP TABLE IF EXISTS 'series'; CREATE TABLE 'series' ( 'id' INTEGER PRIMARY KEY AUTOINCREMENT, 'name' VARCHAR(255) NOT NULL ); CREATE UNIQUE INDEX 'uk_series(name)' ON series (name); DROP TABLE IF EXISTS 'record_series'; CREATE TABLE 'record_series' ( 'id' INTEGER PRIMARY KEY AUTOINCREMENT, 'record_id' INTEGER NOT NULL, 'series_id' INTEGER NOT NULL ); CREATE INDEX 'idx_record_series(record_id)' ON record_series (record_id); CREATE INDEX 'idx_record_series(series_id)' ON record_series (series_id); CREATE UNIQUE INDEX 'uk_record_series(record_id,series_id)' ON record_series (record_id, series_id);
            `)
        })
    }

    private upgrade(loadingDBVersion: number): void {
        this.transactionExec(() => {
            switch (loadingDBVersion) {
                default:
                    this.run('VACUUM;')
                    this.exec(this.DB_INFO_SQL)// 更新db_info表
            }
        })
    }

    /**
     * 给数据库添加一个自定义的REGEXP函数，在查询时使用
     */
    @oncePerObject()
    public registerSQLFnRegexp(keyword: string): void {
        const pattern = new RegExp(tokenizer(keyword).join('|'), 'gi') // 使用 'gi' 标志进行全局和忽略大小写匹配
        this.function('REGEXP', (text: string) => {
            const matches = text.match(pattern)
            return matches ? matches.length : 0
        })
    }
}

export default LibraryDB