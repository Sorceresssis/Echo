import { app, dialog } from "electron"
import fs from "fs"
import SQLiteDatabase from "../utils/SQLiteDatabase";



class GroupDB extends SQLiteDatabase {
	private readonly DB_VERSION = 1;

	public constructor(path: string) {
		const isExists = fs.existsSync(path)
		super(path)

		if (isExists) {
			this.checkDB()
		} else {
			this.defineData()
		}
	}

	private defineData(): void {
		this.transactionExec(() => {
			// 创建db_info表
			this.writeDBInfo()
			// 创建其他表
			this.exec(`
			DROP TABLE IF EXISTS 'group';
			CREATE TABLE 'group' ( 'id' INTEGER PRIMARY KEY AUTOINCREMENT, 'name' VARCHAR(255) NOT NULL, 'prev_id' INTEGER DEFAULT 0 NOT NULL, 'next_id' INTEGER DEFAULT 0 NOT NULL, 'create_time' DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, 'update_time' DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL );
			CREATE INDEX 'idx_group(prev_id)' ON 'group' (prev_id); CREATE INDEX 'idx_group(next_id)' ON 'group' (next_id);
			
			DROP TABLE IF EXISTS 'library';
			CREATE TABLE 'library' ( 'id' INTEGER PRIMARY KEY AUTOINCREMENT, 'name' VARCHAR(255) NOT NULL, 'prev_id' INTEGER DEFAULT 0 NOT NULL, 'next_id' INTEGER DEFAULT 0 NOT NULL, 'create_time' DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, 'update_time' DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, 'group_id' INTEGER NOT NULL ); CREATE INDEX 'idx_library(prev_id)' ON library (prev_id);
			CREATE INDEX 'idx_library(next_id)' ON library (next_id);
			CREATE INDEX 'idx_library(group_id)' ON library (group_id);

			DROP TABLE IF EXISTS 'library_extra';
			CREATE TABLE 'library_extra' ( 'id' INTEGER NOT NULL, 'use_auxiliary_st' BOOLEAN DEFAULT 1 NOT NULL, 'auxiliary_st' VARCHAR(255) DEFAULT '' NOT NULL, 'intro' TEXT DEFAULT '' NOT NULL ); CREATE INDEX 'idx_library_extra(id)' ON library_extra (id);
			`)
		})
	}

	// 升级数据库
	private upgrade(readingDBVersion: number): void {
		this.transactionExec(() => {
			switch (readingDBVersion) {
				default:
					this.run('VACUUM;')
					this.writeDBInfo()
			}
		})
	}

	private checkDB(): void {
		try {
			const dbInfo: any = {};
			this.all<[], Entity.GroupDBInfo>(`SELECT name, value FROM 'db_info'`).forEach((row) => {
				dbInfo[row.name] = row.value
			})

			const readingDBVersion = Number(dbInfo['version'])

			if (readingDBVersion > this.DB_VERSION) {
				// 读取的数据库版本高于当前软件支持的版本，就抛出异常，提示用户更新软件 
				dialog.showErrorBox('The software version is too low', 'Please update the software to the latest version')
				app.quit()
			}

			// 读取的数据库版本低于当前软件支持的版本，就升级数据库
			if (readingDBVersion < this.DB_VERSION) {
				this.upgrade(readingDBVersion)
			}
		} catch {
			this.defineData()
		}
	}

	private writeDBInfo(): void {
		const DB_INFO_SQL = `
		DROP TABLE IF EXISTS 'db_info';
		CREATE TABLE 'db_info' ( 'name' TEXT PRIMARY KEY, 'value' TEXT NOT NULL );
		INSERT INTO 'db_info' VALUES('version', '${this.DB_VERSION}');`

		this.exec(DB_INFO_SQL)
	}
}


export default GroupDB