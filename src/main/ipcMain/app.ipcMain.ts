import { app, ipcMain, IpcMainInvokeEvent } from 'electron'
import config from '../app/config'

export default function ipcMainApp() {
    ipcMain.handle('app:config', (e: IpcMainInvokeEvent, label: ConfigLabel, value: any | null) => {
        return config.set(label, value)
    })

    ipcMain.handle('app:version', () => {
        return app.getVersion()
    })
}