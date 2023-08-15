import ipcMainGroup from './group.ipcMain'
import ipcMainLibrary from './library.ipcMain'
import ipcMainWindow from './window.ipcMain'
import ipcMainApp from './app.ipcMain'
import ipcMainDialog from './dialog.ipcMain'
import ipcMainSystem from './system.ipcMain'

export default function IPCMain() {
    ipcMainGroup()
    ipcMainLibrary()
    ipcMainWindow()
    ipcMainApp()
    ipcMainDialog()
    ipcMainSystem()
}