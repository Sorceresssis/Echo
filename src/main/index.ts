// index.ts
import { BrowserWindow, app, dialog, ipcMain } from "electron";
import { createWindow } from "./main-window";

async function handleFileOpen() {
    const { canceled, filePaths } = await dialog.showOpenDialog()
    if (canceled) {
        return
    } else {
        return filePaths[0]
    }
}

async function bootstrap() {
    app.on("ready", () => {
        ipcMain.handle('getAllDatabase', () => {
            return "0k";
        })
        ipcMain.handle('dialog:openFile', handleFileOpen)
        const window = createWindow();
        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) createWindow()
        })
    });
}
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
bootstrap();
