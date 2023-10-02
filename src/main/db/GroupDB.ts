import DB from "./DB"
import fs from "fs"

export default class GroupDB extends DB {
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
            DROP TABLE IF EXISTS 'group';
            CREATE TABLE 'group'( 'id' INTEGER PRIMARY KEY AUTOINCREMENT, 'name' VARCHAR(255) NOT NULL, 'prev_id' INTEGER DEFAULT 0 NOT NULL, 'next_id' INTEGER DEFAULT 0 NOT NULL, 'gmt_create' DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, 'gmt_modified' DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL );
            CREATE INDEX 'idx_group(prev_id)' ON 'group'(prev_id);
            CREATE INDEX 'idx_group(next_id)' ON 'group'(next_id);
            DROP TABLE IF EXISTS 'library';
            CREATE TABLE 'library'( 'id' INTEGER PRIMARY KEY AUTOINCREMENT, 'name' VARCHAR(255) NOT NULL, 'prev_id' INTEGER DEFAULT 0 NOT NULL, 'next_id' INTEGER DEFAULT 0 NOT NULL, 'gmt_create' DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, 'gmt_modified' DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, 'group_id' INTEGER NOT NULL );
            CREATE INDEX 'idx_library(prev_id)' ON library(prev_id);
            CREATE INDEX 'idx_library(next_id)' ON library(next_id); CREATE INDEX 'idx_library(group_id)' ON library(group_id);
            DROP TABLE IF EXISTS 'library_extra';
            CREATE TABLE 'library_extra'( 'id' INTEGER NOT NULL, 'auxiliary_st' VARCHAR(255) DEFAULT '' NOT NULL, 'use_auxiliary_st' BOOLEAN DEFAULT 1 NOT NULL, 'intro' TEXT DEFAULT '' NOT NULL );
            CREATE INDEX 'idx_library_extra(id)' ON library_extra(id);`)
		})
	}

	public checkAndRepair(): void {
		const count = 10
		if (this.prepare('SELECT COUNT(name) FROM sqlite_master;').pluck().get() !== count) {
			this.createTable()
		}
	}
}