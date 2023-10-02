import { BrowserWindow, app } from "electron"
import windowManager from "./windowManager"
import { resolve } from "path"

const isDev = !app.isPackaged

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
            webSecurity: false, // 为了开发方便，关闭安全策略，打包时打开
        }
    })
    windowManager.add(win)

    if (isDev) {
        win?.loadURL(`http://localhost:${process.env.PORT || 5173}`)
        win.webContents.openDevTools()
    } else {
        win?.loadFile(resolve(__dirname, "../../render/index.html"))
        win.removeMenu();
        // 虽然菜单栏消失了，但是依然可以通过快捷键进行菜单操作，比如ctrl+shift+i打开开发者工具，为避免这种情况，我们需要去掉菜单栏window.removeMenu();
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