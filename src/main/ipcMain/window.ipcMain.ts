import { ipcMain, IpcMainInvokeEvent, dialog } from 'electron'
import mainWindow from '../window/main.window'
import recordWindow from '../window/record.window'
import windowManager from '../window/windowManager'

export default function ipcMainWindow() {
    ipcMain.handle('window:createMainWindow', (e: IpcMainInvokeEvent, libraryId: number): void => {
        try {
            mainWindow.createWindow(libraryId)
        } catch (e: any) {
            dialog.showErrorBox('Error', e.message)
        }
    })

    ipcMain.handle('window:createRecordWindow', (e: IpcMainInvokeEvent, libraryId, recordId): void => {
        recordWindow.createWindow(libraryId, recordId)
    })

    /*
    e.sender.id 是webContents实例的唯一，每一个BrowserView实例都有两个webContents实例，一个是主webContents,另一个是创建子窗口或浏览器视图的webContents
    所以BrowserView的实例id和webContents的实例id存在关系，1-1,2 ; 2-3,4 ; 3-5,6
    综上，BrowserView实例id和对应webContents实例id的关系为  BrowserView.id = Math.floor((webContent.id - 1) / 2) + 1
    */
    ipcMain.handle('window:minmize', (e: IpcMainInvokeEvent): void => {
        windowManager.getWindowInstanceByWebContentId(e.sender.id)?.minimize()
    })

    ipcMain.handle('window:maxmize', (e: IpcMainInvokeEvent): void => {
        let win = windowManager.getWindowInstanceByWebContentId(e.sender.id)
        if (win?.isMaximized()) {
            win.restore()
        }
        else {
            win?.maximize()
        }
    })

    ipcMain.handle('window:close', (e: IpcMainInvokeEvent): void => {
        windowManager.getWindowInstanceByWebContentId(e.sender.id)?.close()
        windowManager.remove(e.sender.id)
    })
}