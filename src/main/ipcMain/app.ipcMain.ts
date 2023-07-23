import { app, ipcMain, IpcMainInvokeEvent } from 'electron'
import config from '../app/config'

export default function ipcMainApp() {
    ipcMain.handle('app:config', (e: IpcMainInvokeEvent, name: ConfigName, value: any | null) => {
        return config.set(name, value)
    })

    ipcMain.handle('app:version', () => {
        return app.getVersion()
    })
}