import { BrowserWindow, app, Menu } from "electron"
// import { updateHandle } from "./app/autoUpdater"
import { createWindow } from "./window/main.window"

async function bootstrap() {
    Menu.setApplicationMenu(null)
    app.on("ready", () => {
        // 检查更新
        // updateHandle()

        const IPCMain = require('./ipcMain')
        IPCMain.default()

        createWindow()  // 启动窗口

        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) createWindow()
        })
    });
}

bootstrap();
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
