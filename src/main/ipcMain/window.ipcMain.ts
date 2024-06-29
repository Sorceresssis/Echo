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