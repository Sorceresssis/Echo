import { BrowserWindow, app } from "electron";
import { createWindow } from "./window/main.window";
import { config, readConfig } from './config'
import { mkdirsSync } from './util/FileManager'
import { IPCMain } from './ipcMain'
const path = require('path');

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


// 检查文件夹是否存在 ，否则sqlite报错
export function checkBootDir() {
    // 检查数据库文件夹
    mkdirsSync(path.resolve(config.userDataPath, "database"))
    // 图片存放位置
    mkdirsSync(path.resolve(config.userDataPath, "image"))
}