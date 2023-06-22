import DatabaseConstructor, { Database } from "better-sqlite3";



export class DBUtil {
    db: Database

    constructor(path: string) {
        this.db = new DatabaseConstructor(path)
        this.db.pragma('journal_mode = WAL')
    }

    transaction(fn: () => void) {
        this.db.transaction(fn)()
    }

    get(sql: string, ...arg: any[]) {
        return this.db.prepare(sql).get(arg)
    }

    all(sql: string, ...arg: any[]): any[] {
        return this.db.prepare(sql).all(arg)
    }

    run(sql: string, ...arg: any[]) {
        return this.db.prepare(sql).run(arg)
    }
    exec(sql: string) {
        this.db.exec(sql)
    }
    function(name: string, fn: (...arg: any[]) => any) {

    }

    close() {
        this.db.close()
    }
}