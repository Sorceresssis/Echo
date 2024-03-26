import { BrowserWindow, app } from "electron"
import windowManager from "./windowManager"
import { resolve } from "path"

const isPackaged = app.isPackaged

export function createWindow(libraryId?: number): BrowserWindow {
    const win = new BrowserWindow({
        width: 1050,
        height: 649,
        minWidth: 1000,
        minHeight: 618,
        show: false,
        frame: false, // 取消默认的标题栏
        backgroundColor: "#ffffff",
        webPreferences: {
            preload: resolve(__dirname, "../../preload/index.js"),
            sandbox: true, // 开启沙箱模式
            webSecurity: isPackaged, // TODO 为了开发方便，关闭安全策略，打包时打开
        }
    })
    windowManager.add(win)

    if (isPackaged) {
        win?.loadFile(resolve(__dirname, "../../render/index.html"))
    } else {
        win?.loadURL(`http://localhost:${process.env.PORT || 5173}`)
        win.webContents.openDevTools()
    }

    win.once('ready-to-show', () => {
        win.webContents.send('library:primaryOpenLibrary', libraryId)
        win.show()
    })

    // 窗口操作
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