import { ipcMain, BrowserWindow, dialog, IpcMainInvokeEvent } from "electron";
import { config } from './config'
import { createWindow } from './mainWindow'
import { getGroups, addGroup, updataOrderGroup, renameGroup, renameLibrary, updataOrderLibrary, addLibrary, moveLibrary, deleteGroup, deleteLibrary } from './dbGroup'
import { DBLibrary } from './dbLibrary'
const path = require('path');

export function IPCMain() {
    ipcMain.handle('userData:getGroups', getGroups)

    /******************** group ********************/
    ipcMain.handle('group:add', addGroup)
    ipcMain.handle('group:updataOrder', updataOrderGroup)
    ipcMain.handle('group:rename', renameGroup)
    ipcMain.handle('group:delete', deleteGroup)

    /******************** library ********************/
    ipcMain.handle('library:add', addLibrary)
    ipcMain.handle('library:updataOrder', updataOrderLibrary)
    ipcMain.handle('library:rename', renameLibrary)
    ipcMain.handle('library:delete', deleteLibrary)
    ipcMain.handle('library:move', moveLibrary)

    /******************** Item ********************/
    ipcMain.handle('library:searchSuggest', () => {
        return [
            "何骏马", "bb", "cc", "dd", "eee"
        ]
    })

    ipcMain.handle('library:getAttribute', async (e: IpcMainInvokeEvent, LibraryID: number, attribute: number, pageno: number, pagesize: number, filterWords: string[]) => {
        let library: DBLibrary = new DBLibrary(path.resolve(config.userDataPath, `database/${LibraryID}.db`))
        return await library.getAttribute(attribute, pageno, pagesize, filterWords)
    })









    ipcMain.handle('userData:getConfig', () => {
        return config
    })
    ipcMain.handle('dialog:selectFile', handleFileOpen)


    /******************** 窗口 ********************/
    ipcMain.handle('window:createMainWindow', (e, library: library) => {
        createWindow(library)
    })
    ipcMain.handle('window:createItemWindow', (e) => {

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