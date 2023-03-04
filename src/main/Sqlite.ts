import sqlite3 from 'sqlite3'
const sqlite = sqlite3.verbose()

class Sqlite {
    static instance: any
    db: any
    constructor() {
        this.db = null
    }
    // 连接数据库
    connect(path: string) {
        return new Promise((resolve, reject) => {
            this.db = new sqlite.Database(path, (err: any) => {
                if (err === null) {
                    resolve(err)
                } else {
                    reject(err)
                }
            })

        })
    }
    // 运行sql
    run(sql: string, params: any) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, (err: any) => {
                if (err === null) {
                    resolve(err)
                } else {
                    reject(err)
                }
            })
        })
    }
    // 运行多条sql
    exec(sql: any) {
        return new Promise((resolve, reject) => {
            this.db.exec(sql, (err: any) => {
                if (err === null) {
                    resolve(err)
                } else {
                    reject(err)
                }
            })
        })
    }
    // 查询一条数据
    get(sql: any, params: any) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err: any, data: any) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }
    // 查询所有数据
    all(sql: any, params: any) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err: any, data: any) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }
    // 关闭数据库
    close() {
        this.db.close()
    }

    // 单例
    static getInstance() {
        this.instance = this.instance ? this.instance : new Sqlite()
        return this.instance
    }
}

export default Sqlite