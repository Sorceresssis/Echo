// main-window.ts
import { app, BrowserWindow, Menu } from "electron";
import { resolve } from "path";
const isDev = !app.isPackaged;

export function createItemWindow(): BrowserWindow {
    Menu.setApplicationMenu(null)
    const win = new BrowserWindow({
        width: 1025,
        height: 634,
        minWidth: 720,
        minHeight: 600,
        show: false,
        // 取消默认的标题栏
        // frame: false,
        backgroundColor: "#ffffff",
        webPreferences: {
            preload: resolve(__dirname, "../../preload/index.js")
        }
    });

    if (isDev) {
        win?.loadURL(`http://localhost:${process.env.PORT || 5173}/item/index.html`);
        win.webContents.openDevTools();
    } else {
        win?.loadFile(resolve(__dirname, "../render/item/index.html"));
        // 虽然菜单栏消失了，但是依然可以通过快捷键进行菜单操作，比如ctrl+shift+i打开开发者工具，为避免这种情况，我们需要去掉菜单栏window.removeMenu();
        win.removeMenu();
    }
    win.once('ready-to-show', () => {
        win.show()
    })
    win.on('unmaximize', () => {
        win.webContents.send('window:isMaxmize', false)
    })
    win.on('maximize', () => {
        win.webContents.send('window:isMaxmize', true)
    })
    win.on('closed', () => {
        win.destroy();
    });
    return win;
}