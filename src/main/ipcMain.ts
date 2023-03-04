import { app, ipcMain, BrowserWindow, dialog } from "electron";
import internal from "stream";
import Sqlite from './Sqlite'
const path = require('path');


export function IPCMainHandle() {
    ipcMain.handle('userData:getAllDatabase', async () => {
        const db = Sqlite.getInstance()
        await db.connect(path.resolve(path.dirname(app.getPath('exe')), "database/group.db"))
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

    // ipcMain.handle('data:getDatabase', async (e, args) => {

    // })

    // ipcMain.handle('config:userDataPath', (e, args) => {

    // })
    ipcMain.handle('dialog:selectFile', handleFileOpen)

    ipcMain.handle('dialog:selectFolder', () => {

    })

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