import { BrowserWindow, app, Menu } from "electron"
import bootCheck from "./app/Bootcheck"
import { createWindow } from "./window/main.window"

async function bootstrap() {
    Menu.setApplicationMenu(null) // 加快启动速度 
    app.on("ready", () => {
        bootCheck()     // 检查启动

        const IPCMain = require('./ipcMain') // 等待bootCheck完成后再引入，否则有些文件夹不存在
        IPCMain.default()    // 开启通信   

        createWindow()  // 启动窗口
        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) createWindow()
        })
    });
}

bootstrap();
app.on('window-all-closed', () => {
    // TODO 彻底关闭app时，查询正在执行的一些任务，如果有，提示用户
    // 任务， 任务名称， 任务进度， 任务状态
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('before-quit', (event) => {
    // if (isTaskRunning) {
    //     // 有任务正在进行，显示询问对话框
    //     const choice = dialog.showMessageBoxSync(mainWindow, {
    //         type: 'question',
    //         buttons: ['继续关闭', '取消关闭'],
    //         title: '警告',
    //         message: '有任务正在进行，确定要关闭应用吗？',
    //     });

    //     if (choice === 1) {
    //         // 用户选择取消关闭
    //         event.preventDefault(); // 阻止应用程序关闭
    //     }
    // }

    // 导入导出任务
})