import Sqlite from './Sqlite'
import { config } from './config'
const path = require('path');
const fs = require('fs')

class group {
    id: number
    name: string
    librarys: library[]
    constructor(id: number, name: string, librarys: library[]) {
        this.id = id
        this.name = name
        this.librarys = librarys
    }
}
class library {
    id: number
    name: string
    constructor(id: number, name: string) {
        this.id = id
        this.name = name
    }
}
interface item {
    id: number
    title: string

}
/**
 * 创建group.db
 */
export async function createDBGroup() {
    const DBgroupPath = path.resolve(config.userDataPath, "database/group.db")
    const dbGroup = Sqlite.getInstance()
    await dbGroup.connect(DBgroupPath)
    await dbGroup.run(`CREATE TABLE 'GROUP' (
        group_id INTEGER PRIMARY KEY AUTOINCREMENT,
        group_name VARCHAR ( 255 ) NOT NULL,
        group_order INT );`)
    await dbGroup.run(`CREATE TABLE library (
        library_id INTEGER PRIMARY KEY AUTOINCREMENT,
        library_name VARCHAR ( 255 ) NOT NULL,
        library_order INT,
        group_id INTEGER NOT NULL );`)
}

/**
 * 获取library分组信息
 * @returns groups
 */
export async function getGroups() {
    const DBgroupPath = path.resolve(config.userDataPath, "database/group.db")
    const dbGroup = Sqlite.getInstance()
    let groups: group[] = []
    if (!fs.existsSync(DBgroupPath)) {
        createDBGroup()
    }
    else {
        await dbGroup.connect(DBgroupPath)
        const response = await dbGroup.all(`SELECT t1.group_id, t1.group_name, t2.library_id, t2.library_name 
        FROM 'group' t1
        LEFT JOIN library t2 ON t1.group_id = t2.group_id 
        ORDER BY t1.group_order, t2.library_order;`)
        let groupIDMap: Map<number, number> = new Map()
        response.forEach((resp: any) => {
            if (groupIDMap.has(resp.group_id)) {
                groups[groups.length - 1].librarys.push(new library(resp.library_id, resp.library_name))
            } else {
                groupIDMap.set(resp.group_id, resp.group_id);
                // 因为时左连接，要判断group没有library
                groups.push(new group(resp.group_id, resp.group_name, resp.library_id == null ? [] : [new library(resp.library_id, resp.library_name)]))
            }
        })
    }
    dbGroup.close()
    return groups;
}

export async function createDBLibrary() {

}