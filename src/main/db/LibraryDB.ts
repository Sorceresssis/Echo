import fs from "fs"
import { oncePerObject } from '../decorator/method.decorator'
import DB from "./DB"
import tokenizer from "../util/tokenizer"

export default class LibraryDB extends DB {
    public constructor(path: string) {
        if (fs.existsSync(path)) {
            super(path)
        } else {
            super(path)
            this.createTable()
        }
    }

    private createTable(): void {
        this.transaction(() => {
            this.exec(`
				DROP TABLE IF EXISTS 'record'; CREATE TABLE 'record' ( 'id' INTEGER PRIMARY KEY AUTOINCREMENT, 'title' VARCHAR(255) NOT NULL, 'rate' TINYINT DEFAULT 0 NOT NULL, 'cover' VARCHAR(32) DEFAULT NULL NULL, 'hyperlink' TEXT DEFAULT NULL NULL, 'basename' TEXT DEFAULT NULL NULL, 'info_status' VARCHAR(3) DEFAULT '000' NOT NULL, 'tag_author_sum' TEXT DEFAULT NULL NULL, 'recycled' BOOLEAN DEFAULT 0 NOT NULL, 'dirname_id' INTEGER DEFAULT 0 NOT NULL, 'gmt_create' DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, 'gmt_modified' DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL ); CREATE INDEX 'idx_record(rate)' ON record (rate); CREATE INDEX 'idx_record(info_status)' ON record (info_status); CREATE INDEX 'idx_record(recycled)' ON record (recycled); CREATE INDEX 'idx_record(dirname_id)' ON record (dirname_id); DROP TABLE IF EXISTS 'record_extra'; CREATE TABLE 'record_extra' ( 'id' INTEGER PRIMARY KEY, 'intro' TEXT DEFAULT '' NOT NULL, 'info' TEXT DEFAULT '' NOT NULL ); DROP TABLE IF EXISTS 'dirname'; CREATE TABLE 'dirname' ( 'id' INTEGER PRIMARY KEY AUTOINCREMENT, 'path' TEXT NOT NULL ); CREATE UNIQUE INDEX 'uk_dirname(path)' ON dirname (path); DROP TABLE IF EXISTS 'author'; CREATE TABLE 'author' ( 'id' INTEGER PRIMARY KEY AUTOINCREMENT, 'name' VARCHAR(255) NOT NULL, 'avatar' VARCHAR(32), 'intro' TEXT DEFAULT '' NOT NULL, 'gmt_create' DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, 'gmt_modified' DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL ); DROP TABLE IF EXISTS 'record_author'; CREATE TABLE 'record_author' ( 'id' INTEGER PRIMARY KEY AUTOINCREMENT, 'record_id' INTEGER NOT NULL, 'author_id' INTEGER NOT NULL ); CREATE UNIQUE INDEX 'uk_record_author(record_id,author_id)' ON record_author (record_id, author_id); CREATE INDEX 'idx_record_author(record_id)' ON record_author (record_id); CREATE INDEX 'idx_record_author(author_id)' ON record_author (author_id); DROP TABLE IF EXISTS 'tag'; CREATE TABLE 'tag' ( 'id' INTEGER PRIMARY KEY AUTOINCREMENT, 'title' VARCHAR(255) NOT NULL ); CREATE UNIQUE INDEX 'uk_tag(title)' ON tag (title); DROP TABLE IF EXISTS 'record_tag'; CREATE TABLE 'record_tag' ( 'id' INTEGER PRIMARY KEY AUTOINCREMENT, 'record_id' INTEGER NOT NULL, 'tag_id' INTEGER NOT NULL ); CREATE UNIQUE INDEX 'uk_record_tag(record_id,tag_id)' ON record_tag (record_id, tag_id); CREATE INDEX 'idx_record_tag(record_id)' ON record_tag (record_id); CREATE INDEX 'idx_record_tag(tag_id)' ON record_tag (tag_id); DROP TABLE IF EXISTS 'series'; CREATE TABLE 'series' ( 'id' INTEGER PRIMARY KEY AUTOINCREMENT, 'name' VARCHAR(255) NOT NULL ); DROP TABLE IF EXISTS 'record_series'; CREATE TABLE 'record_series' ( 'id' INTEGER PRIMARY KEY AUTOINCREMENT, 'record_id' INTEGER NOT NULL, 'series_id' INTEGER NOT NULL ); CREATE UNIQUE INDEX 'uk_record_series(record_id,series_id)' ON record_series (record_id, series_id); CREATE INDEX 'idx_record_series(record_id)' ON record_series (record_id); CREATE INDEX 'idx_record_series(series_id)' ON record_series (series_id);
			`)
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