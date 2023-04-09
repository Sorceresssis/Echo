// index.ts
import { BrowserWindow, app } from "electron";
import { createWindow } from "./mainWindow";
import { IPCMain } from './ipcMain'
import { readConfig } from './config'
import { checkBootDir } from './checkDir'
async function bootstrap() {
    app.on("ready", () => {
        // 读取配置信息
        readConfig()
        // 检查文件夹
        checkBootDir()
        // 开启监听
        IPCMain()
        // 启动窗口
        createWindow(null)
        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) createWindow(null)
        })
    });
}
bootstrap();

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
