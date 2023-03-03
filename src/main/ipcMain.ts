import { app, ipcMain, BrowserWindow, dialog } from "electron";
import { } from './connectSQL'
const path = require('path');


export function IPCMainHandle() {
    ipcMain.handle('data:getAllDatabase', async () => {
        // 判读文件是否存在

        return path.resolve(path.dirname(app.getPath('exe')), "config.json");
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