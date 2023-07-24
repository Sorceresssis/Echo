import { IPCMain_external } from './ipcMain-external'

import ipcMainGroup from './group.ipcMain'
import ipcMainLibrary from './library.ipcMain'
import ipcMainWindow from './window.ipcMain'
import ipcMainApp from './app.ipcMain'
import ipcMainDialog from './dialog.ipcMain'


export default function IPCMain() {
    IPCMain_external()

    ipcMainGroup()
    ipcMainLibrary()
    ipcMainWindow()
    ipcMainApp()
    ipcMainDialog()
}