// main-window.ts
import { BrowserWindow, app } from "electron";
import { resolve } from "path";
const isDev = !app.isPackaged;

export function createWindow(): BrowserWindow {
    const minWidth = 800;
    const minHeight = 600;
    // const preloadUrl = "";
    const window = new BrowserWindow({
        minWidth,
        minHeight,
        frame: false,
        backgroundColor: "#ffffff",
        webPreferences: {
            preload: resolve(__dirname, "../preload/index.js")
        }
    });

    if (isDev) {
        window?.loadURL(`http://localhost:${process.env.PORT || 5173}`);
        window.webContents.openDevTools();
    } else {
        window?.loadFile(resolve(__dirname, "../render/index.html"));
        window.removeMenu();
    }

    window.on("closed", () => {
        window.destroy();
    });

    return window;
}

