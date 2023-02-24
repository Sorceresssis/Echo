// main-window.ts
import { BrowserWindow, app } from "electron";
import { resolve } from "path";
const isDev = !app.isPackaged;

export function createWindow(): BrowserWindow {
    const window = new BrowserWindow({
        width: 1025,
        height: 634,
        minWidth: 756,
        minHeight: 454,
        // 取消默认的标题栏
        frame: false,
        backgroundColor: "#ffffff",
        webPreferences: {
            // preload: resolve(__dirname, "../preload/index.ts")
            preload: resolve(__dirname, "../../dist/preload/index.js")
        }
    });

    if (isDev) {
        window?.loadURL(`http://localhost:${process.env.PORT || 5173}`);
        window.webContents.openDevTools();
    } else {
        window?.loadFile(resolve(__dirname, "../render/index.html"));
        // 虽然菜单栏消失了，但是依然可以通过快捷键进行菜单操作，比如ctrl+shift+i打开开发者工具，为避免这种情况，我们需要去掉菜单栏window.removeMenu();
        // window.removeMenu();
    }

    window.on("closed", () => {
        window.destroy();
    });

    return window;
}

