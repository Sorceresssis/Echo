import DatabaseConstructor, { Database, Statement } from "better-sqlite3";



export class DBUtil {
    db: Database

    constructor(path: string) {
        this.db = new DatabaseConstructor(path)
        this.db.pragma('journal_mode = WAL')
        this.db.pragma('busy_timeout = 2000')
    }

    /**
     * 设置或查询SQLite的运行时参数，例如PRAGMA journal_mode=WAL;
     * @param source 模式
     * @param options 建议
     */
    pragma(source: string, options?: DatabaseConstructor.PragmaOptions | undefined): void {
        this.db.pragma(source, options)
    }

    /**
     * 开启事务
     * @param fn 要运行的函数
     */
    transaction(fn: () => void): void {
        this.db.transaction(fn)()
    }

    /**
     * 根据给定的 SQL 字符串创建一个新的准备好的SQL字符串
     * @param sql 执行语句
     * @returns statement
     */
    prepare(sql: string): Statement<unknown[]> {
        /**
         * .pluck()返回它检索的任何行的第一列的值，而不是整个行对象。
         * .expand()使准备好的语句返回按表命名的数据id变成group.id
         * .raw()使准备好的语句以数组而不是对象的形式返回行。可以使用该.columns()方法恢复列名。
         * .columns()对象的形式返回行
         */
        return this.db.prepare(sql)
    }

    /**
     * 获取一条记录
     * @param sql 执行语句
     * @param arg 参数
     * @returns 查询的数据
     */
    get(sql: string, ...arg: any[]): any {
        // prepare()方法会返回一个Statement对象，该对象表示一个准备好的语句
        return this.db.prepare(sql).get(arg)
    }

    /**
     * 获取多条记录
     * @param sql 执行语句
     * @param arg 参数
     * @returns 查询的数据
     */
    all(sql: string, ...arg: any[]): any[] {
        return this.db.prepare(sql).all(arg)
    }

    run(sql: string, ...arg: any[]): DatabaseConstructor.RunResult {
        return this.db.prepare(sql).run(arg)
    }

    /**
     * 执行多条语句
     * @param sql 执行语句
     */
    exec(sql: string): void {
        this.db.exec(sql)
    }

    function(name: string, fn: (...arg: any[]) => any) {

    }

    /**
     * 启动数据库备份
     * @returns 
     */
    backup(destinationFile: string, options?: DatabaseConstructor.BackupOptions | undefined): Promise<DatabaseConstructor.BackupMetadata> {
        return this.db.backup(destinationFile, options)
    }

    close() {
        this.db.close()
    }
}