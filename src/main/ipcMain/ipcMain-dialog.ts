import { ipcMain, dialog, IpcMainInvokeEvent } from "electron";

/*
filters: [
{ name: 'Images', extensions: ['jpg', 'png', 'gif'] },
{ name: 'VIDEO', extensions: ['mkv', 'avi', 'mp4'] },
{ name: 'Custom File Type', extensions: ['as'] },
{ name: 'All Files', extensions: ['*'] } ] 
*/

enum OpenDialogType { DIR = 0, FILE, IMAGE, VIDEO }
export function IPCMain_dialog() {
    ipcMain.handle('dialog:openDialog', async (e: IpcMainInvokeEvent, type: OpenDialogType, multiSelections: boolean) => {
        let option: Electron.OpenDialogOptions = new Object()
        option.properties = type === OpenDialogType.DIR ? ['openDirectory'] : ['openFile']
        switch (type) {
            case OpenDialogType.FILE:
                option.filters = [{ name: 'All Files', extensions: ['*'] }]
                break
            case OpenDialogType.IMAGE:
                option.filters = [{ name: 'Images', extensions: ['jpg', 'png'] }]
                break
            case OpenDialogType.VIDEO:
                option.filters = [{ name: 'Videos', extensions: ['mkv', 'avi', 'mp4'] }]
                break
        }
        if (multiSelections) option.properties.push('multiSelections')
        const { canceled, filePaths } = await dialog.showOpenDialog(option)
        return canceled ? null : multiSelections ? filePaths : filePaths[0]
    })
}