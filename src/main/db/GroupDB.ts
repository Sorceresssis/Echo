import { app, dialog } from "electron"
import DB from "./DB"
import fs from "fs"

class GroupDB extends DB {
	private readonly DB_VERSION = 1;
	private readonly DB_INFO_SQL = `
		DROP TABLE IF EXISTS 'db_info';
		CREATE TABLE 'db_info' ( 'name' TEXT PRIMARY KEY, 'value' TEXT NOT NULL );
		INSERT INTO 'db_info' VALUES('version', '${this.DB_VERSION}');`


	public constructor(path: string) {
		if (fs.existsSync(path)) {
			super(path)

			// 读取数据库信息
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

			// this.run('VACUUM;')  // 优化数据库 
		} else {
			super(path)
			this.defineData()
		}
	}

	private defineData(): void {
		this.transaction(() => {
			// 创建db_info表
			this.exec(this.DB_INFO_SQL)

			// 创建其他表
			this.exec(`
            DROP TABLE IF EXISTS 'group';
            CREATE TABLE 'group'('id' INTEGER PRIMARY KEY AUTOINCREMENT, 'name' VARCHAR(255) NOT NULL, 'prev_id' INTEGER DEFAULT 0 NOT NULL, 'next_id' INTEGER DEFAULT 0 NOT NULL, 'gmt_create' DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, 'gmt_modified' DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL);
            CREATE INDEX 'idx_group(prev_id)' ON 'group'(prev_id);
            CREATE INDEX 'idx_group(next_id)' ON 'group'(next_id);
            DROP TABLE IF EXISTS 'library';
            CREATE TABLE 'library'('id' INTEGER PRIMARY KEY AUTOINCREMENT, 'name' VARCHAR(255) NOT NULL, 'prev_id' INTEGER DEFAULT 0 NOT NULL, 'next_id' INTEGER DEFAULT 0 NOT NULL, 'gmt_create' DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, 'gmt_modified' DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, 'group_id' INTEGER NOT NULL);
            CREATE INDEX 'idx_library(prev_id)' ON library(prev_id);
            CREATE INDEX 'idx_library(next_id)' ON library(next_id); CREATE INDEX 'idx_library(group_id)' ON library(group_id);
            DROP TABLE IF EXISTS 'library_extra';
            CREATE TABLE 'library_extra'('id' INTEGER NOT NULL, 'auxiliary_st' VARCHAR(255) DEFAULT '' NOT NULL, 'use_auxiliary_st' BOOLEAN DEFAULT 1 NOT NULL, 'intro' TEXT DEFAULT '' NOT NULL);
            CREATE INDEX 'idx_library_extra(id)' ON library_extra(id);
			`)
		})
	}

	// 升级数据库
	private upgrade(loadingDBVersion: number): void {
		this.transaction(() => {
			switch (loadingDBVersion) {
				default:
					this.run('VACUUM;')
					this.exec(this.DB_INFO_SQL)// 更新db_info表
			}
		})
	}
}


export default GroupDB