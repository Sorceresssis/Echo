
import { autoUpdater } from "electron-updater"

export function updateHandle() {

    autoUpdater.setFeedURL({
        provider: "github",
        owner: "Sorceresssis",
        repo: "echo",
        releaseType: "draft",
    })

    autoUpdater.autoDownload = false

    autoUpdater.on('error', (error) => {
        console.log('error-', error)
    })

    autoUpdater.on('checking-for-update', () => {
        console.log('checking-for-update')
    })

    autoUpdater.on('update-available', () => {
        console.log('update-available')
    })

    autoUpdater.on('update-not-available', () => {
        console.log('update-not-available')
    })

    autoUpdater.on('download-progress', (progressObj) => {
        console.log('download-progress', progressObj)
    })

    autoUpdater.on('update-downloaded', (info) => {
        console.log('update-downloaded', info)
    })

    autoUpdater.checkForUpdatesAndNotify().then((result) => {
        console.log('checkForUpdatesAndNotify-success', result)
    }).catch((error) => {
        console.log('checkForUpdatesAndNotify-error', error)
    })
} 