import Database from "better-sqlite3"

class SQLiteDatabase extends Database {
    public constructor(path: string) {
        super(path)
        this.pragma('journal_mode = WAL')
        this.pragma('busy_timeout = 10000')
    }

    /**
     * 在事务中执行函数
     * @param fn 要运行的函数
     */
    public transactionExec(fn: () => void): void {
        this.transaction(fn)()
    }

    /**
     * 获取一条记录
     * @param sql 执行语句
     * @param arg 参数
     * @returns 查询的数据
     */
    public get<K extends Array<any>, V>(sql: string, ...arg: K): V | undefined {
        return this.prepare<K, V>(sql).get(arg)
    }

    /**
     * 获取多条记录
     * @param sql 执行语句
     * @param arg 参数
     * @returns 查询的数据
     */
    public all<K extends Array<any>, V>(sql: string, ...arg: K): Array<V> {
        return this.prepare<K, V>(sql).all(arg)
    }

    public run(sql: string, ...arg: any[]): Database.RunResult {
        return this.prepare(sql).run(arg)
    }
}


export default SQLiteDatabase