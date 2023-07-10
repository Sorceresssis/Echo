import { dialog, ipcMain, IpcMainInvokeEvent } from 'electron'
import path from 'path'
import { config } from '../config'
import { GroupDao } from '../dao/groupDao'
import { ca } from 'element-plus/es/locale'

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

    ipcMain.handle('group:rename', (e: IpcMainInvokeEvent, id: number, newName: string): boolean => {
        try {
            groupDao.renameGroup(id, newName)
            return true
        } catch (e: any) {
            dialog.showErrorBox('RenameGroup Error', e.message)
            return false
        }
    })

    ipcMain.handle('library:getLibraryNameByID', (e: IpcMainInvokeEvent, id: number): string => {
        return groupDao.getLibraryNameByID(id)
    })


    ipcMain.handle('library:rename', (e: IpcMainInvokeEvent, id: number, newName: string): boolean => {
        try {
            groupDao.renameLibrary(id, newName)
            return true
        } catch (e: any) {
            dialog.showErrorBox('RenameLibrary Error', e.message)
            return false
        }
    })
    ipcMain.handle('library:add', (event: IpcMainInvokeEvent, a) => {

    })
    ipcMain.handle('library:updataOrder', (event: IpcMainInvokeEvent, a) => {

    })
    ipcMain.handle('library:delete', (event: IpcMainInvokeEvent, a) => {

    })
    ipcMain.handle('library:move', (event: IpcMainInvokeEvent, a) => {

    })
}