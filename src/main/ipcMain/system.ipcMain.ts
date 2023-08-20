import { clipboard, ipcMain, IpcMainInvokeEvent, shell, dialog } from "electron"
import { exec } from "child_process"
import path from "path"
import fs from "fs"

export default function ipcMainSystem() {
    // 用系统默认方式打开url
    ipcMain.handle('system:openExternal', (e: IpcMainInvokeEvent, url: string) => {
        if (url === '') return
        shell.openExternal(url)
    })

    // 打开资源管理器中的路径如果是文件夹，直接打开文件夹。如果是文件，打开文件所在的文件夹，滚动到文件的位置并高亮标记
    ipcMain.handle('system:openInExplorer', (e: IpcMainInvokeEvent, fullPath: string) => {
        try {
            if (fullPath === '') return
            const resolvedPath = path.resolve(fullPath)
            fs.stat(resolvedPath, (err, stats) => {
                if (err) return
                stats.isDirectory() ? shell.openPath(resolvedPath) : shell.showItemInFolder(resolvedPath)
            })
        } catch (e: any) {
            dialog.showErrorBox('open path in explorer', e.message)
        }
    })

    // 打开路径中的文件(一定是个文件)，如果该文件用户指定了打开软件，用指定的软件打开，否则用系统默认方式打开
    ipcMain.handle('system:openFile', async (e: IpcMainInvokeEvent, fullPath: string) => {
        if (fullPath === '' || fs.statSync(fullPath).isDirectory()) return
        shell.openPath(fullPath)
        // TODO 在判断扩展名，查用户指定的打开方式，如果没有指定，用系统默认方式打开  
        // const appPath = getAssociatedApp(path.extname(fullPath))
        // appPath ? exec(appPath + ' ' + fullPath) : shell.openPath(fullPath)
    })

    // 复制到剪贴板
    ipcMain.handle('system:writeClipboard', (e: IpcMainInvokeEvent, text: string) => {
        clipboard.writeText(text)
    })

    ipcMain.handle('system:pathSep', (e: IpcMainInvokeEvent) => path.sep)
}