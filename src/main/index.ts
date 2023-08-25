import { BrowserWindow, app } from "electron";
import { createWindow } from "./window/main.window"
import bootCheck from "./app/Bootcheck"
import IPCMain from './ipcMain'

async function bootstrap() {
    app.on("ready", () => {
        bootCheck()         // 检查启动项
        IPCMain()           // 开启通信
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