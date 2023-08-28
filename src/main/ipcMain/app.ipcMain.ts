import { app, ipcMain, IpcMainInvokeEvent } from 'electron'
import config from '../app/config'

export default function ipcMainApp() {
    ipcMain.handle('app:config', (e: IpcMainInvokeEvent, name: ConfigKey, value: any | null) => {
        return config.set(name, value)
    })

    ipcMain.handle('app:version', () => {
        return app.getVersion()
    })

    ipcMain.handle('app:relaunch', (): void => {
        app.relaunch()
        app.exit()
    })
}