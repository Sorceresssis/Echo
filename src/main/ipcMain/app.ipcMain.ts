import { app, ipcMain, IpcMainInvokeEvent } from 'electron'
import config, { Config } from '../app/config'

export default function ipcMainApp() {
    ipcMain.handle('app:config', (e: IpcMainInvokeEvent, key: keyof Config, value?: string) => {
        return value ? config.set(key, value) : config.get(key)
    })

    ipcMain.handle('app:version', () => {
        return app.getVersion()
    })

    ipcMain.handle('app:relaunch', (): void => {
        app.relaunch()
        app.exit()
    })
}