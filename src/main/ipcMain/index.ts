import { app, ipcMain, IpcMainInvokeEvent } from "electron";
import { setConfig } from '../config'
import { IPCMain_window } from "./ipcMain-window";
import { IPCMain_external } from "./ipcMain-external";
import { IPCMain_dialog } from "./ipcMain-dialog";
import { IPCMain_dbGoup } from "./ipcMain-dbGoup";
import { IPCMain_dbLibrary } from "./ipcMain-dbLibrary";

export function IPCMain() {
    /******************** 开始准备 ********************/
    ipcMain.handle('app:config', (e: IpcMainInvokeEvent, index: string, newValue: any | null = null) => {
        return setConfig(index, newValue)
    })
    ipcMain.handle('app:version', () => {
        return app.getVersion()
    })
    IPCMain_dialog()
    IPCMain_external()
    IPCMain_dbGoup()
    IPCMain_dbLibrary()
    IPCMain_window()
    /******************** 其他 ********************/
    ipcMain.handle('dev:test', async () => {
        return 'test'
    })
}