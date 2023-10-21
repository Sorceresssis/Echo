import { BrowserWindow, app, Menu } from "electron"
import bootCheck from "./app/Bootcheck"
import { updateHandle } from "./app/autoUpdater"
import { createWindow } from "./window/main.window"

async function bootstrap() {
    Menu.setApplicationMenu(null) // 加快启动速度 
    app.on("ready", () => {
        // 检查启动
        bootCheck()

        // 检查更新
        updateHandle()

        // 等待bootCheck完成后再引入，否则有些文件夹不存在
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
