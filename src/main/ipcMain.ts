import { ipcMain, BrowserWindow, dialog } from "electron";
import Sqlite from './Sqlite'
import { config } from './config'
const fs = require('fs')
const path = require('path');


export function IPCMainHandle() {
    ipcMain.handle('userData:getAllDatabase', async () => {
        const groupDBPath = path.resolve(config.userDataPath, "database/group.db")
        const db = Sqlite.getInstance()
        if (!fs.existsSync(groupDBPath)) {
            await db.connect(groupDBPath)
            await db.run(`CREATE TABLE 'group'(
                group_id INTEGER PRIMARY KEY AUTOINCREMENT,
                group_name VARCHAR(255)  NOT NULL,
                group_order INT,
                group_isOpen BOOLEAN NOT NULL
                );`)
            await db.run(`
                CREATE TABLE 'database'(
                database_id INTEGER PRIMARY KEY AUTOINCREMENT,
                database_name VARCHAR(255) NOT NULL,
                database_order INT,
                group_id INTEGER NOT NULL
                );`)
        } else {
            await db.connect(groupDBPath)
        }
        const response = await db.all(`SELECT t1.group_id, t1.group_name, t1.group_isOpen, t2.database_id, t2.database_name
        FROM "group" t1
        JOIN "database" t2 ON t1.group_id = t2.group_id
        ORDER BY t1.group_order, t2.database_order;`)
        db.close()
        // 分组数据
        class group {
            id: number
            name: string
            isOpen: number
            databases: database[]
            constructor(id: number, name: string, isOpen: number, databases: database[]) {
                this.id = id
                this.name = name
                this.isOpen = isOpen
                this.databases = databases
            }
        }
        class database {
            id: number
            name: string
            constructor(id: number, name: string) {
                this.id = id
                this.name = name
            }
        }
        let groupIDMap: Map<number, number> = new Map()
        let data: group[] = []
        response.forEach((item: any) => {
            if (groupIDMap.has(item.group_id)) {
                data[data.length - 1].databases.push(new database(item.database_id, item.database_name))
            } else {
                groupIDMap.set(item.group_id, item.group_id);
                data.push(new group(item.group_id, item.group_name, item.group_isOpen, [new database(item.database_id, item.database_name)]))
            }
        })
        return data;
    })

    // ipcMain.handle('userData:addGroup', (event, args) => {

    // })

    // ipcMain.handle('usreData:addDatabase', (event, args) => {
    //     return true

    // })
    // ipcMain.handle('data:getDatabase', async (e, args) => {

    // })

    ipcMain.handle('userData:getConfig', () => {
        return config
    })
    ipcMain.handle('dialog:selectFile', handleFileOpen)




    ipcMain.handle('window:windowMinmize', (e) => {
        BrowserWindow.fromId(e.sender.id)?.minimize()
    })

    ipcMain.handle('window:windowMaxmize', (e) => {
        let win = BrowserWindow.fromId(e.sender.id)
        if (win?.isMaximized()) {
            win.restore()
        }
        else {
            win?.maximize()
        }
    })
    ipcMain.handle('window:windowIsMaxmize', (e) => {
        return BrowserWindow.fromId(e.sender.id)?.isMaximized()
    })
    ipcMain.handle('window:windowClose', (e) => {
        BrowserWindow.fromId(e.sender.id)?.close()
    })
}

async function handleFileOpen() {
    const { canceled, filePaths } = await dialog.showOpenDialog()
    if (canceled) {
        return
    } else {
        return filePaths[0]
    }
}