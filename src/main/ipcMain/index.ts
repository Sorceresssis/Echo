import { app, ipcMain, IpcMainInvokeEvent } from "electron";
import { setConfig } from '../config'
import { IPCMain_external } from "./ipcMain-external";
import { IPCMain_dialog } from "./ipcMain-dialog";
import { IPCMain_dbLibrary } from "./ipcMain-dbLibrary";

import { ipcMainGroup } from './group.ipcMain';
import { ipcMainWindow } from "./window.ipcMain";


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
    IPCMain_dbLibrary()

    /******************** 其他 ********************/
    ipcMain.handle('dev:test', async () => {
        return 'test'
    })
    ipcMainWindow()
    ipcMainGroup()
}