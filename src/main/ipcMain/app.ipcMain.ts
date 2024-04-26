import { app, ipcMain, IpcMainInvokeEvent } from 'electron'
import appConfig from '../app/config'

export default function ipcMainApp() {
    ipcMain.handle('app:config', (e: IpcMainInvokeEvent, type: 'get' | 'all' | 'set' | 'reset', key?: keyof Config, value?: string): string | Config | void => {
        switch (type) {
            case 'get':
                return key ? appConfig.get(key) : ''
            case 'all':
                return appConfig.all()
            case 'set':
                return key && value ? appConfig.set(key, value) : ''
            case 'reset':
                appConfig.reset()
                return
            default:
                throw new Error('config operation error')
        }
    })

    ipcMain.handle('app:version', () => {
        return app.getVersion()
    })

    ipcMain.handle('app:relaunch', (): void => {
        app.relaunch()
        app.exit()
    })
} 