import { ipcMain, BrowserWindow, dialog, IpcMainInvokeEvent, shell } from "electron";
import { config } from './config'
import { createWindow } from './mainWindow'
import { createItemWindow } from './itemWindow'
import { getGroups, addGroup, updataOrderGroup, renameGroup, renameLibrary, updataOrderLibrary, addLibrary, moveLibrary, deleteGroup, deleteLibrary } from './dbGroup'
import { DBLibrary, checkImageDir } from './dbLibrary'
const path = require('path');

export function IPCMain() {
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
    ipcMain.handle('library:getAttribute', async (e: IpcMainInvokeEvent, LibraryID: number, attribute: number, pageno: number, pagesize: number, filterWords: string[]) => {
        let library: DBLibrary = new DBLibrary(path.resolve(config.userDataPath, `database/${LibraryID}.db`))
        return await library.getAttribute(attribute, pageno, pagesize, filterWords)
    })

    ipcMain.handle('library:getItems', (e: IpcMainInvokeEvent, LibraryID: number) => {
        checkImageDir(LibraryID)
        let library: DBLibrary = new DBLibrary(path.resolve(config.userDataPath, `database/${LibraryID}.db`))
        return library.getItems("Fd", "fd", "fd", "Fd", 0,)
    })

    ipcMain.handle('library:getItemsByAuthor', (e: IpcMainInvokeEvent, LibraryID: number) => {

    })

    ipcMain.handle('library:getItemsOfNoAuthor', (e: IpcMainInvokeEvent, LibraryID: number) => {

    })

    ipcMain.handle('library:getAuthorList', (e: IpcMainInvokeEvent, LibraryID: number) => {

    })





    /******************** 其他 ********************/
    ipcMain.handle('config', (e: IpcMainInvokeEvent, index: string, newValue: string | null = null) => {

        return 'ik'
    })
    ipcMain.handle('dialog:selectFile', async () => {
        const { canceled, filePaths } = await dialog.showOpenDialog()
        if (canceled) {
            return
        } else {
            return filePaths[0]
        }
    })

    /******************** 系统 ********************/

    ipcMain.handle('shell:showItemInFolder', async (e: IpcMainInvokeEvent, fulllPath: string) => {
        // 先判断路径合法
        await shell.openPath(path.join(fulllPath))
        return path.join(fulllPath)
    })

    ipcMain.handle('shell:openUrlExternal', (e: IpcMainInvokeEvent, url: string) => {
        shell.openExternal('https://www.bilibili.com/video/BV1Yv411z7QM/?spm_id_from=333.788.recommend_more_video.-1&vd_source=dd4f8fa595f89999daf10908d21ade29')
    })
    ipcMain.handle('system:openApp', () => {

    })

    /******************** 窗口 ********************/
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