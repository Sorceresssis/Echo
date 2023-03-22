// index.ts
import { BrowserWindow, app } from "electron";
import { createWindow } from "./mainWindow";
import { IPCMain } from './ipcMain'
import { readConfig, writeConfig } from './config'
import { checkDir } from './checkDir'
async function bootstrap() {
    app.on("ready", () => {
        // 读取配置信息
        readConfig()
        // 检查文件夹
        checkDir()
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
        // 写入配置信息
        writeConfig()
        app.quit();
    }
});
