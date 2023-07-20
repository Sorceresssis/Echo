import fs from 'fs'
import { DBUtil } from '../util/dbUtil'

import { config } from '../config'
import { AutoCompleteType } from '../../share/enum/ipc.enum'



export class LibraryDao {
    db: DBUtil
    constructor(libraryId: number) {
        const path = `${config.userDataPath}/database/${libraryId}.db`
        // 判断文件是否存在
        if (!fs.existsSync(path)) {
            this.db = new DBUtil(path)
            this.createDBLibrary()
        }
        this.db = new DBUtil(path)
    }

    createDBLibrary(): void {
        this.db.transaction(() => {
            this.db.exec(`
                
            `)
        })
    }
    // TODO 检查文件夹是否存在
    autoComplete(type: AutoCompleteType, queryWord: string, ps: number): ACSuggestion[] {
        // type id label
        console.log(AutoCompleteType.TITLE);

        return []
    }

    test(): any {
        // const tmp = new DBUtil('F:/Project/Github/echoDB/record.db')
        // const keywords = ['h', 'c', 't'];
        // // TmpREGEXP
        // tmp.function('REGEXP', (text: string) => {
        //     const pattern = new RegExp(keywords.join('|'), 'gi'); // 使用 'gi' 标志进行全局和忽略大小写匹配
        //     const matches = text.match(pattern);
        //     return matches ? matches.length : 0; // 输出 2，因为匹配到了 "Hello" 和 "World" 两个关键词
        // })
        // return tmp.all("SELECT REGEXP(title) FROM record;")
    }

    // 释放资源
    destroy(): void {
        this.db.close()
    }
}