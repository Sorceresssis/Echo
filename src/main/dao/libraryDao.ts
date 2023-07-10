import fs from 'fs'
import { DBUtil } from '../util/dbUtil'

export class LibraryDao {
    db: DBUtil
    constructor(path: string) {
        // 判断文件是否存在
        if (!fs.existsSync(path)) {
            this.db = new DBUtil(path)
            this.createDBLibrary()
        }
        this.db = new DBUtil(path)
    }

    createDBLibrary(): void {
        this.db.transaction(() => {
            this.db.exec(``)
        })
    }

}