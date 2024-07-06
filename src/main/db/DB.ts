import DatabaseConstructor, { Database, Statement } from "better-sqlite3"

class DB extends DatabaseConstructor {
    // private db: Database

    public constructor(path: string) {
        super(path)
        this.pragma('journal_mode = WAL')
        this.pragma('busy_timeout = 10000')
    }

    // /**
    //  * 开启事务
    //  * @param fn 要运行的函数
    //  */
    public transactionExec(fn: () => void): void {
        this.transaction(fn)()
    }

    /**
     * 获取一条记录
     * @param sql 执行语句
     * @param arg 参数
     * @returns 查询的数据
     */
    get(sql: string, ...arg: any[]): any {
        return this.prepare(sql).get(arg) // prepare()方法会返回一个Statement对象，该对象表示一个准备好的语句
    }

    /**
     * 获取多条记录
     * @param sql 执行语句
     * @param arg 参数
     * @returns 查询的数据
     */
    all(sql: string, ...arg: any[]): any[] {
        return this.prepare(sql).all(arg)
    }

    run(sql: string, ...arg: any[]): DatabaseConstructor.RunResult {
        return this.prepare(sql).run(arg)
    }
}


export default DB  