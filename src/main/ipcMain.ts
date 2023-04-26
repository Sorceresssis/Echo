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
    ipcMain.handle('library:getAttribute', async (e: IpcMainInvokeEvent, LibraryID: number, type: number, queryWords: string, pageno: number, pagesize: number) => {
        let library: DBLibrary = new DBLibrary(path.resolve(config.userDataPath, `database/${LibraryID}.db`))
        // await library.getAttribute(attribute, pageno, pagesize, filterWords)
        return ['dvdvedv', 'ffe', 'fefeffe', 'fefef']
    })
    ipcMain.handle('library:getItems', (e: IpcMainInvokeEvent, LibraryID: number) => {
        //TODO 检查文件夹image/1/authorProfile coverimage
        checkImageDir(LibraryID)
        let library: DBLibrary = new DBLibrary(path.resolve(config.userDataPath, `database/${LibraryID}.db`))

        const getItemsInfo: getItemsOption = {
            // 无搜索词，通用搜索，高级搜索
            queryType: 2,
            // 搜索词
            queryWords: ['fdfdf vfq f', '', ''],
            // 是否筛选：有链接，文件夹，有封面
            filterOption: [false, false, false],
            // 排序：标题，点击，时间
            orderBy: 1,
            // 升降序: 0 为降序， 1 为升序
            isAscending: false,
            // 页码
            pageno: 0,
        }
        return library.getItemsa(getItemsInfo)
    })
    ipcMain.handle('library:getItemsByAuthor', (e: IpcMainInvokeEvent, LibraryID: number, getItemsOption: getItemsOption, authorID: number) => {
        // 检查修复存放图片的文件夹
        checkImageDir(LibraryID)
        try {
            let library: DBLibrary = new DBLibrary(path.resolve(config.userDataPath, `database/${LibraryID}.db`))
        } catch (e) {
            // 删除文件
            //TODO 文件存在但是读取错误，删除文件，重新创建
            // 重新创建
        }
        return
    })
    ipcMain.handle('library:getItemsOfFav', (e: IpcMainInvokeEvent, LibraryID: number, getItemsOption: getItemsOption) => {

    })
    ipcMain.handle('library:getAuthorList', (e: IpcMainInvokeEvent, LibraryID: number, getItemsOption: getItemsOption) => {

    })
    ipcMain.handle('library:addItem', (e: IpcMainInvokeEvent, LibraryID: number) => {
    })


    /******************** 其他 ********************/
    ipcMain.handle('dev:test', () => {
        let library: DBLibrary = new DBLibrary(path.resolve(config.userDataPath, `database/${1}.db`))
        let rs = []
        rs.push(library.getItems({ queryType: 1, queryWords: '', filterOption: [false, true, false], orderBy: 0, isAscending: false, pageno: 0 }))
        rs.push(library.getItemsByAuthor({ queryType: 2, queryWords: ['fdf fdfd', '', 'grgr'], filterOption: [false, false, false], orderBy: 0, isAscending: false, pageno: 0 }, 0))
        rs.push(library.getItemsOfFav({ queryType: 2, queryWords: ['', 'hyh', ''], filterOption: [false, false, true], orderBy: 0, isAscending: false, pageno: 0 }))
        return rs
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
        shell.openExternal('https://www.bilibili.com/video/BV1Yv411z7QM/?spm_id_from=333.788.recommend_more_video.-1&vd_source=dd4f8fa595f89999daf10908d21ade29')
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