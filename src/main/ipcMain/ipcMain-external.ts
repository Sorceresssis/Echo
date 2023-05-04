import { clipboard, ipcMain, IpcMainInvokeEvent, shell } from "electron";
const { exec } = require('child_process');
const path = require('path');

export function IPCMain_external() {
    /**
     * 用户默认浏览器打开链接
     */
    ipcMain.handle('external:openUrl', (e: IpcMainInvokeEvent, url: string) => {
        if (url != '') shell.openExternal(url)

    })
    /**
     * 打开文件 1.用系统默认方式打开 2.指定应用程序打开
     */
    ipcMain.handle('external:openFile', async (e: IpcMainInvokeEvent, path: string) => {
        // 先判断路径合法

    })
    /**
     * 在电脑的文件资源管理器中打开。如果是文件夹，直接打开文件夹。如果是文件，打开文件所在的文件夹，滚动到文件的位置并高亮标记。
     */
    ipcMain.handle('external:openFileInExplorer', () => {

    })
    ipcMain.handle('external:clibboardWriteText', (e: IpcMainInvokeEvent, text: string) => {
        clipboard.writeText(text)
    })
}

const openFileByApp = (appPath: string, filePath: string) => {
    exec(`"${appPath}" "${filePath}"`, (error: any, stdout: any, stderr: any) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
    });
}
