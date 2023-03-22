import { ipcMain, BrowserWindow, dialog } from "electron";
import Sqlite from './Sqlite'
import { config } from './config'
import { createWindow } from './mainWindow'
import { getGroups } from './database'
const fs = require('fs')
const path = require('path');


export function IPCMain() {
    ipcMain.handle('userData:getGroups', getGroups)



    ipcMain.handle('userData:addGroup', async (e, groupName) => {
        const groupDBPath = path.resolve(config.userDataPath, "database/group.db")
        const db = Sqlite.getInstance()
        // 添加是否成功
        let flag: boolean = true
        try {
            await db.connect(groupDBPath)
            await db.run(`INSERT INTO 'group'(group_name, group_isOpen)VALUES ('${groupName}', 0);`)
        } catch (err) {
            // 添加错误
            flag = false
        } finally {
            // 关闭数据库
            db.close()
        }
        return flag
    })
    ipcMain.handle('userData:renameGroup', async (e, groupID, rename) => {
        const groupDBPath = path.resolve(config.userDataPath, "database/group.db")
        const db = Sqlite.getInstance()
        let flag = true
        await db.connect(groupDBPath)
        try {
            await db.run(`UPDATE 'group' SET group_name = '${rename}' WHERE group_id = ${groupID};`)
        } catch (er) {
            flag = false
        }
        finally {
            db.close()
        }
        return flag
    })
    ipcMain.handle('userData:renameDatabase', async (e, databaseID, rename) => {
        const groupDBPath = path.resolve(config.userDataPath, "database/group.db")
        const db = Sqlite.getInstance()
        let flag = true
        await db.connect(groupDBPath)
        try {
            await db.run(`UPDATE 'database' SET database_name = '${rename}' WHERE database_id = ${databaseID};`)
        } catch (er) {
            flag = false
        } finally {
            db.close()
        }
        return flag
    })




    ipcMain.handle('userData:getConfig', () => {
        return config
    })


    ipcMain.handle('dialog:selectFile', handleFileOpen)


















    ipcMain.handle('window:createMainWindow', (e, library: library) => {
        createWindow(library)
    })

    /*
    e.sender.id 是webContents实例的唯一，每一个BrowserView实例都有两个webContents实例，一个是主webContents,另一个是创建子窗口或浏览器视图的webContents
    所以BrowserView的实例id和webContents的实例id存在关系，1-1,2 ; 2-3,4 ; 3-5,6
    综上，BrowserView实例id和对应webContents实例id的关系为  BrowserView.id = Math.floor((webContent.id - 1) / 2) + 1
    */
    ipcMain.handle('window:minmize', (e) => {
        BrowserWindow.fromId(Math.floor((e.sender.id - 1) / 2) + 1)?.minimize()
    })

    ipcMain.handle('window:maxmize', (e) => {
        let win = BrowserWindow.fromId(Math.floor((e.sender.id - 1) / 2) + 1)
        if (win?.isMaximized()) {
            win.restore()
        }
        else {
            win?.maximize()
        }
    })
    ipcMain.handle('window:close', (e) => {
        BrowserWindow.fromId(Math.floor((e.sender.id - 1) / 2) + 1)?.close()
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