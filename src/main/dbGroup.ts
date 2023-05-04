import Sqlite from './util/Sqlite'
import { config } from './config'
import { IpcMainInvokeEvent } from 'electron'
const path = require('path')
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

export async function createDBGroup() {
    const DBgroupPath = path.resolve(config.userDataPath, "database/group.db")
    const dbGroup = Sqlite.getInstance()
    await dbGroup.connect(DBgroupPath)
    await dbGroup.run(`CREATE TABLE 'group' (
        group_id INTEGER PRIMARY KEY AUTOINCREMENT,
        group_name VARCHAR ( 255 ) NOT NULL,
        group_order INT );`)
    await dbGroup.run(`CREATE TABLE library (
        library_id INTEGER PRIMARY KEY AUTOINCREMENT,
        library_name VARCHAR ( 255 ) NOT NULL,
        library_order INT,
        group_id INTEGER NOT NULL );`)
}

export async function getGroups() {
    const DBgroupPath = path.resolve(config.userDataPath, "database/group.db")
    const dbGroup = Sqlite.getInstance()
    let groups: group[] = []
    if (!fs.existsSync(DBgroupPath)) {
        // 一定要是同步的
        await createDBGroup()
    }
    else {
        try {
            await dbGroup.connect(DBgroupPath)
            const response = await dbGroup.all(`
                SELECT t1.group_id, t1.group_name, t2.library_id, t2.library_name 
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
        } catch (err) {
            // 文件存在但是读取错误，删除文件，重新创建
            fs.unlinkSync(DBgroupPath);
            await createDBGroup()
        }
    }
    dbGroup.close()
    return groups;
}

// group
export async function addGroup(e: IpcMainInvokeEvent, groupName: string) {
    const groupDBPath = path.resolve(config.userDataPath, "database/group.db")
    const dbGroup = Sqlite.getInstance()
    // 添加是否成功
    let addGroupId: Number | null
    try {
        await dbGroup.connect(groupDBPath)
        await dbGroup.run(`INSERT INTO 'group'(group_name)VALUES ('${groupName}');`)
        addGroupId = (await dbGroup.get(`SELECT LAST_INSERT_ROWID() as lastInsert`)).lastInsert
    } catch (err) {
        addGroupId = null
    } finally {
        dbGroup.close()
    }
    return addGroupId
}

export async function updataOrderGroup(e: IpcMainInvokeEvent, groupsId: number[]) {
    const groupDBPath = path.resolve(config.userDataPath, "database/group.db")
    const dbGroup = Sqlite.getInstance()
    dbGroup.connect(groupDBPath)
    let sql: string[] = []
    sql.push(`UPDATE 'group' SET group_order = CASE group_id`)
    for (let i = 0; i < groupsId.length; i++) {
        sql.push(`WHEN ${groupsId[i]} THEN ${i + 1}`)
    }
    sql.push(`ELSE group_order END;`)
    dbGroup.run(sql.join(' '))
    dbGroup.close
}

export async function renameGroup(e: IpcMainInvokeEvent, groupID: number, rename: string) {
    const groupDBPath = path.resolve(config.userDataPath, "database/group.db")
    const dbGroup = Sqlite.getInstance()
    let flag = true
    await dbGroup.connect(groupDBPath)
    try {
        await dbGroup.run(`UPDATE 'group' SET group_name = '${rename}' WHERE group_id = ${groupID};`)
    } catch (er) {
        flag = false
    }
    finally {
        dbGroup.close()
    }
    return flag
}

export async function deleteGroup(e: IpcMainInvokeEvent, groupId: number) {
    const groupDBPath = path.resolve(config.userDataPath, "database/group.db")
    const dbLibrary = Sqlite.getInstance()
    let flag = true
    await dbLibrary.connect(groupDBPath)
    try {
        // 删除数据库数据
        await dbLibrary.exec(`DELETE FROM library WHERE group_id = ${groupId}; DELETE FROM 'group' WHERE group_id = ${groupId};`)
        // TODO 删除文件
    } catch (err) {
        flag = false
    } finally {
        dbLibrary.close()
    }
    return flag
}
// library
export async function addLibrary(e: IpcMainInvokeEvent, groupId: number, libraryName: string) {
    const groupDBPath = path.resolve(config.userDataPath, "database/group.db")
    const dbGroup = Sqlite.getInstance()
    let addLibraryId: number | null
    try {
        await dbGroup.connect(groupDBPath)
        await dbGroup.run(`INSERT INTO library ( library_name, group_id ) VALUES('${libraryName}', ${groupId})`)
        addLibraryId = (await dbGroup.get(`SELECT LAST_INSERT_ROWID() as lastInsert`)).lastInsert
    } catch (err) {
        addLibraryId = null
    } finally {
        dbGroup.close()
    }
    return addLibraryId
}

export async function updataOrderLibrary(e: IpcMainInvokeEvent, groupId: number, librarysId: number[]) {
    const groupDBPath = path.resolve(config.userDataPath, "database/group.db")
    const dbGroup = Sqlite.getInstance()
    dbGroup.connect(groupDBPath)
    let sql: string[] = []
    sql.push(`UPDATE library SET library_order = CASE library_id`)
    for (let i = 0; i < librarysId.length; i++) {
        sql.push(`WHEN ${librarysId[i]} THEN ${i + 1}`)
    }
    sql.push(`ELSE library_order END WHERE group_id = ${groupId};`)
    dbGroup.run(sql.join(' '))
    dbGroup.close
}

export async function renameLibrary(e: IpcMainInvokeEvent, libraryID: number, rename: string) {
    const groupDBPath = path.resolve(config.userDataPath, "database/group.db")
    const dbLibrary = Sqlite.getInstance()
    let flag = true
    await dbLibrary.connect(groupDBPath)
    try {
        await dbLibrary.run(`UPDATE library SET library_name = '${rename}' WHERE library_id = ${libraryID};`)
    } catch (err) {
        flag = false
    } finally {
        dbLibrary.close()
    }
    return flag
}

export async function deleteLibrary(e: IpcMainInvokeEvent, libraryId: number) {
    const groupDBPath = path.resolve(config.userDataPath, "database/group.db")
    const dbLibrary = Sqlite.getInstance()
    let flag = true
    await dbLibrary.connect(groupDBPath)
    try {
        await dbLibrary.run(`DELETE FROM library WHERE library_id = ${libraryId};`)
        // TODO 删除文件
    } catch (err) {
        flag = false
    } finally {
        dbLibrary.close()
    }
    return flag
}

export async function moveLibrary(e: IpcMainInvokeEvent, toGroupId: number, libraryId: number) {
    const groupDBPath = path.resolve(config.userDataPath, "database/group.db")
    const dbLibrary = Sqlite.getInstance()
    let flag = true
    await dbLibrary.connect(groupDBPath)
    try {
        await dbLibrary.run(`UPDATE library SET group_id = ${toGroupId} WHERE library_id = ${libraryId};`)
    } catch (err) {
        flag = false
    } finally {
        dbLibrary.close()
    }
    return flag
}
