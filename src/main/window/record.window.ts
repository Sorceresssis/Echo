import { app, BrowserWindow } from "electron"
import windowManager from "./windowManager"
import { resolve } from "path"

const isPackaged = app.isPackaged

export function createWindow(libraryId: number, recordId: number): BrowserWindow {
    const win = new BrowserWindow({
        width: 1025,
        height: 649,
        minWidth: 700,
        minHeight: 600,
        show: false,
        frame: false,
        backgroundColor: "#ffffff",
        webPreferences: {
            preload: resolve(__dirname, "../../preload/index.js"),
            sandbox: true, // 开启沙箱模式
            webSecurity: isPackaged, // TODO 为了开发方便，关闭安全策略，打包时打开
        }
    })

    windowManager.add(win)

    if (isPackaged) {
        win?.loadFile(resolve(__dirname, "../../render/record/index.html"))
    } else {
        win?.loadURL(`http://localhost:${process.env.PORT || 5173}/record/`)
        win.webContents.openDevTools()
    }

    win.once('ready-to-show', () => {
        win.webContents.send('window:getRecordWindowParams', libraryId, recordId)
        win.show()
    })

    win.on('unmaximize', () => {
        win.webContents.send('window:isMaxmize', false)
    })

    win.on('maximize', () => {
        win.webContents.send('window:isMaxmize', true)
    })

    win.on('closed', () => {
        win.destroy()
    })
    return win
}

export default { createWindow }