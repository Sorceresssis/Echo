import { ipcMain, BrowserWindow } from 'electron'
import { autoUpdater } from 'electron-updater'
import windowManager from '../window/windowManager'
import { IpcMainEvent } from 'electron/main'

autoUpdater.setFeedURL("oss://xxx")     // 配置提供更新的程序，及build中配置的url
autoUpdater.autoDownload = false        // 关闭自动下载
let mainWindow = BrowserWindow.getFocusedWindow()

ipcMain.on("checkForUpdates", (e: IpcMainEvent) => {
    mainWindow = windowManager.getWindowInstanceByWebContentId(e.sender.id)
    autoUpdater.checkForUpdates();
});

autoUpdater.on("error", function (error) {
    printUpdaterMessage('error');
    mainWindow?.webContents.send("updateError", error);
});

// 2. 开始检查是否有更新
autoUpdater.on("checking-for-update", function () {
    printUpdaterMessage('checking');
});

// 3. 有更新时触发
autoUpdater.on("update-available", function (info) {
    printUpdaterMessage('updateAvailable');
    // 4. 告诉渲染进程有更新，info包含新版本信息
    mainWindow?.webContents.send("updateAvailable", info);
});

// 7. 收到确认更新提示，执行下载
ipcMain.on('comfirmUpdate', () => {
    autoUpdater.downloadUpdate()
})

autoUpdater.on("update-not-available", function (info) {
    printUpdaterMessage('updateNotAvailable');
});

// 8. 下载进度，包含进度百分比、下载速度、已下载字节、总字节等
// ps: 调试时，想重复更新，会因为缓存导致该事件不执行，下载直接完成，可找到C:\Users\40551\AppData\Local\xxx-updater\pending下的缓存文件将其删除（这是我本地的路径）
autoUpdater.on("download-progress", function (progressObj) {
    printUpdaterMessage('downloadProgress');
    mainWindow?.webContents.send("downloadProgress", progressObj);
});

// 10. 下载完成，告诉渲染进程，是否立即执行更新安装操作
autoUpdater.on("update-downloaded", function () {
    mainWindow?.webContents.send("updateDownloaded");
    // 12. 立即更新安装
    ipcMain.on("updateNow", (e, arg) => {
        autoUpdater.quitAndInstall();
    });
}
);

// 将日志在渲染进程里面打印出来
function printUpdaterMessage(arg: 'error' | 'checking' | 'updateAvailable' | 'downloadProgress' | 'updateNotAvailable') {
    let message = {
        error: "更新出错",
        checking: "正在检查更新",
        updateAvailable: "检测到新版本",
        downloadProgress: "下载中",
        updateNotAvailable: "无新版本",
    };
    mainWindow?.webContents.send("printUpdaterMessage", message[arg] ?? arg);
}
