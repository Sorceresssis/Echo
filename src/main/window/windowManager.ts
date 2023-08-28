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

    remove(webContentId: number): void {
        this.winMap.delete(webContentId)
    }

    getWindowInstanceByWebContentId(webContentId: number): BrowserWindow | undefined {
        return this.winMap.get(webContentId)
    }
}

export default windowManager.getInstance()