import { BrowserWindow } from 'electron'

class windowManager {
    private static instance: windowManager
    private winMap

    private constructor() {
        this.winMap = new Map<number, BrowserWindow>()
    }

    public static getInstance(): windowManager {
        if (!windowManager.instance) {
            windowManager.instance = new windowManager();
        }
        return windowManager.instance
    }

    add(win: BrowserWindow): void {
        this.winMap.set(win.webContents.id, win)
    }

    remove(win: BrowserWindow): void {
        this.winMap.delete(win.webContents.id)
    }

    getWindowInstanceByWebContentId(webContentId: number): BrowserWindow | undefined {
        return this.winMap.get(webContentId)
    }
}

export default windowManager.getInstance()