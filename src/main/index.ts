// index.ts
import { BrowserWindow, app, dialog, ipcMain } from "electron";
import { createWindow } from "./mainWindow";
import { IPCMainHandle } from './ipcMain'
import { readConfig, writeConfig } from './config'

async function bootstrap() {
    app.on("ready", () => {
        // 读取配置信息
        readConfig()
        // 开启监听
        IPCMainHandle()
        // 启动窗口
        createWindow()
        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) createWindow()
        })
    });
}
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        // 写入配置信息
        writeConfig()
        app.quit();
    }
});


bootstrap();