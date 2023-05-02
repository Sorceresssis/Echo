import { app, ipcMain, BrowserWindow, dialog, IpcMainInvokeEvent, shell } from "electron";
import { config, setConfig } from './config'
import { createWindow } from './mainWindow'
import { createItemWindow } from './itemWindow'
import { getGroups, addGroup, updataOrderGroup, renameGroup, renameLibrary, updataOrderLibrary, addLibrary, moveLibrary, deleteGroup, deleteLibrary } from './dbGroup'
import { DBLibrary, checkImageDir } from './dbLibrary'
const path = require('path');

export function IPCMain() {
    /******************** 开始准备 ********************/
    ipcMain.handle('app:config', (e: IpcMainInvokeEvent, index: string, newValue: any | null = null) => {
        return setConfig(index, newValue)
    })
    ipcMain.handle('app:version', () => {
        return app.getVersion()
    })

    /******************** group ********************/
    ipcMain.handle('group:getGroups', getGroups)
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
    ipcMain.handle('library:autoComplete', async (e: IpcMainInvokeEvent, libraryID: number, type: number, queryWords: string, pagesize: number) => {
        let library: DBLibrary = new DBLibrary(path.resolve(config.userDataPath, `database/${libraryID}.db`))
        return await library.autoComplete(type, queryWords, pagesize)
    })
    ipcMain.handle('library:getItems', async (e: IpcMainInvokeEvent, libraryID: number) => {
        //TODO 检查文件夹image/1/authorProfile coverimage
        checkImageDir(libraryID)
        let library: DBLibrary = new DBLibrary(path.resolve(config.userDataPath, `database/${libraryID}.db`))
        return await library.getItems({ queryType: 0, queryWords: '', filterOption: [false, false, false], orderBy: 0, isAscending: true, pageno: 0 })
    })
    ipcMain.handle('library:getItemsByAuthor', async (e: IpcMainInvokeEvent, libraryID: number, getItemsOption: getItemsOption, authorID: number) => {
        let library: DBLibrary = new DBLibrary(path.resolve(config.userDataPath, `database/${libraryID}.db`))
        return await library.getItemsByAuthor(getItemsOption, authorID)
    })
    ipcMain.handle('library:getItemsOfFav', async (e: IpcMainInvokeEvent, libraryID: number, getItemsOption: getItemsOption) => {
        let library: DBLibrary = new DBLibrary(path.resolve(config.userDataPath, `database/${libraryID}.db`))
        return await library.getItemsOfFav(getItemsOption)
    })
    ipcMain.handle('library:getAuthorList', async (e: IpcMainInvokeEvent, libraryID: number, type: number, queryWords: string | [string, string, string]) => {
        let library: DBLibrary = new DBLibrary(path.resolve(config.userDataPath, `database/${libraryID}.db`))
        let authorList: authorProfile[] = await library.getAuthorList(type, queryWords)
        for (let i = 0; i < authorList.length; i++) {
            let str = authorList[i].itemIDs
            const fourthCommaIndex = str.indexOf(',', str.indexOf(',', str.indexOf(',') + 1) + 1)
            if (fourthCommaIndex != -1) {
                // 截取前面三个逗号的部分
                authorList[i].itemIDs = str.slice(0, fourthCommaIndex)
            }
        }
        return authorList
    })
    ipcMain.handle('library:getAttributes', async (e: IpcMainInvokeEvent, libraryID: number, type: number, pageno: number) => {
        let library: DBLibrary = new DBLibrary(path.resolve(config.userDataPath, `database/${libraryID}.db`))
        return await library.getAttributes(type, pageno)
    })
    ipcMain.handle('library:addItem', (e: IpcMainInvokeEvent, libraryID: number) => {
    })

    /******************** 其他 ********************/
    ipcMain.handle('dev:test', async () => {
        let library: DBLibrary = new DBLibrary(path.resolve(config.userDataPath, `database/${1}.db`))
        return
    })

    /******************** 系统 ********************/
    ipcMain.handle('dialog:selectFile', async () => {
        const { canceled, filePaths } = await dialog.showOpenDialog()
        if (canceled) {
            return
        } else {
            return filePaths[0]
        }
    })
    ipcMain.handle('shell:showItemInFolder', async (e: IpcMainInvokeEvent, fulllPath: string) => {
        // 先判断路径合法
        await shell.openPath(path.join(fulllPath))
        return path.join(fulllPath)
    })
    ipcMain.handle('shell:openUrlExternal', (e: IpcMainInvokeEvent, url: string) => {
        shell.openExternal(url)
    })
    ipcMain.handle('shell:openApp', () => {

    })

    /******************** 窗口 ********************/
    ipcMain.handle('window:relaunch', () => {
        app.relaunch()
        app.exit()
    })
    ipcMain.handle('window:createMainWindow', (e, library: library) => {
        createWindow(library)
    })
    ipcMain.handle('window:createItemWindow', (e, libraryID, itemID) => {
        createItemWindow()
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