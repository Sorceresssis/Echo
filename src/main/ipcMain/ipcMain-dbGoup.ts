import { ipcMain } from 'electron'
import { getGroups, addGroup, updataOrderGroup, renameGroup, renameLibrary, updataOrderLibrary, addLibrary, moveLibrary, deleteGroup, deleteLibrary } from '../dbGroup'

export function IPCMain_dbGoup() {
    /******************** group ********************/
    ipcMain.handle('group:getGroups', getGroups)
    ipcMain.handle('group:add', addGroup)
    ipcMain.handle('group:updataOrder', updataOrderGroup)
    ipcMain.handle('group:rename', renameGroup)
    ipcMain.handle('group:delete', deleteGroup)

    /******************** library ********************/
    ipcMain.handle('library:add', addLibrary)
    ipcMain.handle('library:updataOrder', updataOrderLibrary)
    ipcMain.handle('library:rename', renameLibrary)
    ipcMain.handle('library:delete', deleteLibrary)
    ipcMain.handle('library:move', moveLibrary)
}
