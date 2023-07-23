import { IPCMain_external } from './ipcMain-external'
import { IPCMain_dialog } from './dialog.ipcMain'

import ipcMainGroup from './group.ipcMain'
import ipcMainLibrary from './library.ipcMain'
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