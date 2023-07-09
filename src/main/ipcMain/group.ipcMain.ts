import { ipcMain, IpcMainInvokeEvent } from 'electron'
import path from 'path'
import { config } from '../config'
import { GroupDao } from '../dao/groupDao'

export function ipcMainGroup() {
    const groupDao = new GroupDao(path.resolve(config.userDataPath, "database/group.db"))

    ipcMain.handle('group:getGroups', (e: IpcMainInvokeEvent): Group[] => {
        return groupDao.getGroups()
    })

    ipcMain.handle('group:add', (e: IpcMainInvokeEvent, a) => {
    })

    ipcMain.handle('group:delete', (e: IpcMainInvokeEvent, a) => {

    })

    ipcMain.handle('group:updataOrder', (e: IpcMainInvokeEvent, a) => {

    })

    ipcMain.handle('group:rename', (e: IpcMainInvokeEvent, a): boolean => {
        return true;
    })

    ipcMain.handle('library:getLibraryNameByID', (e: IpcMainInvokeEvent, id: number): string => {
        return groupDao.getLibraryNameByID(id)
    })

    ipcMain.handle('library:add', (event: IpcMainInvokeEvent, a) => {

    })
    ipcMain.handle('library:updataOrder', (event: IpcMainInvokeEvent, a) => {

    })
    ipcMain.handle('library:rename', (event: IpcMainInvokeEvent, a) => {

    })
    ipcMain.handle('library:delete', (event: IpcMainInvokeEvent, a) => {

    })
    ipcMain.handle('library:move', (event: IpcMainInvokeEvent, a) => {

    })
}