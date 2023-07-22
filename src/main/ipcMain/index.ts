import { IPCMain_external } from './ipcMain-external'
import { IPCMain_dialog } from './ipcMain-dialog'

import ipcMainGroup from './group.ipcMain'
import ipcMainLibrary from './record.ipcMain'
import ipcMainWindow from './window.ipcMain'
import ipcMainApp from './app.ipcMain'


export default function IPCMain() {
    IPCMain_dialog()
    IPCMain_external()

    ipcMainGroup()
    ipcMainLibrary()
    ipcMainWindow()
    ipcMainApp()
}