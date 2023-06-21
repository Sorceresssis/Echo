import DatabaseConstructor, { Database } from "better-sqlite3";
const DB = require('better-sqlite3')





export default class Sqlite3 {
    db: Database

    constructor(path: string) {
        this.db = new DB(path)
        this.db.pragma('journal_mode = WAL')
    }

    transaction(fn: () => void) {
        this.db.transaction(fn)()
    }

    get(sql: string, ...arg: any[]) {
        return this.db.prepare(sql).get(arg)
    }

    all(sql: string, ...arg: any[]) {
        return this.db.prepare(sql).all(arg)
    }

    close() {
        this.db.close()
    }
}