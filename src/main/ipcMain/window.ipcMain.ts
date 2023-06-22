import { BrowserWindow, ipcMain, IpcMainInvokeEvent, app } from 'electron'
import { createWindow } from '../window/main.window'
import { createItemWindow } from '../window/record.window'

export function ipcMainWindow() {
    ipcMain.handle('window:relaunch', (): void => {
        app.relaunch()
        app.exit()
    })

    ipcMain.handle('window:createMainWindow', (e: IpcMainInvokeEvent, library: library): void => {
        createWindow(library)
    })

    ipcMain.handle('window:createItemWindow', (e: IpcMainInvokeEvent, libraryID, itemID): void => {
        createItemWindow()
    })

    /*
    e.sender.id 是webContents实例的唯一，每一个BrowserView实例都有两个webContents实例，一个是主webContents,另一个是创建子窗口或浏览器视图的webContents
    所以BrowserView的实例id和webContents的实例id存在关系，1-1,2 ; 2-3,4 ; 3-5,6
    综上，BrowserView实例id和对应webContents实例id的关系为  BrowserView.id = Math.floor((webContent.id - 1) / 2) + 1
    */
    ipcMain.handle('window:minmize', (e: IpcMainInvokeEvent): void => {
        BrowserWindow.fromId(Math.floor((e.sender.id - 1) / 2) + 1)?.minimize()
    })

    ipcMain.handle('window:maxmize', (e: IpcMainInvokeEvent): void => {
        let win = BrowserWindow.fromId(Math.floor((e.sender.id - 1) / 2) + 1)
        if (win?.isMaximized()) {
            win.restore()
        }
        else {
            win?.maximize()
        }
    })

    ipcMain.handle('window:close', (e: IpcMainInvokeEvent): void => {
        BrowserWindow.fromId(Math.floor((e.sender.id - 1) / 2) + 1)?.close()
    })
}