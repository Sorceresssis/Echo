import { app, ipcMain, IpcMainInvokeEvent } from "electron";
import { setConfig } from '../config'
import { IPCMain_external } from "./ipcMain-external";
import { IPCMain_dialog } from "./ipcMain-dialog";

import { ipcMainGroup } from './group.ipcMain';
import { ipcMainLibrary } from './record.ipcMain';
import { ipcMainWindow } from "./window.ipcMain";


export function IPCMain() {
    ipcMain.handle('app:config', (e: IpcMainInvokeEvent, index: string, newValue: any | null = null) => {
        return setConfig(index, newValue)
    })
    ipcMain.handle('app:version', () => {
        return app.getVersion()
    })
    IPCMain_dialog()
    IPCMain_external()

    ipcMainGroup()
    ipcMainLibrary()
    ipcMainWindow()
}