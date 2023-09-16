import { dialog, ipcMain, IpcMainInvokeEvent } from 'electron'
import config from '../app/config'
import GroupDao from '../dao/groupDao'


export default function ipcMainGroup() {
    const groupDao = new GroupDao(config.getGroupDBFilePath())

    ipcMain.handle('group:getGroups', (): Group[] => {
        try {
            return groupDao.getGroups()
        } catch (e: any) {
            dialog.showErrorBox('GetGroups Error', e.message + `\nThe database of the group is damaged, it is recommended to close the software, delete the file in the path 'userData/database/group.db' and restart it`)
            return []
        }
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

    ipcMain.handle('group:add', (e: IpcMainInvokeEvent, name: string) => {
        try {
            groupDao.addGroup(name)
            return true
        } catch (e: any) {
            dialog.showErrorBox('AddGroup Error', e.message)
            return false
        }
    })

    ipcMain.handle('group:delete', (e: IpcMainInvokeEvent, id: number) => {
        try {
            groupDao.deleteGroup(id)
            return true
        } catch (e: any) {
            dialog.showErrorBox('DeleteGroup Error', e.message)
            return false
        }
    })

    ipcMain.handle('group:sort', (e: IpcMainInvokeEvent, currId: number, tarNextId: number) => {
        try {
            groupDao.sortGroup(currId, tarNextId)
        } catch (e: any) {
            dialog.showErrorBox('SortGroup Error', e.message)
        }
    })

    ipcMain.handle('library:getLibraryNameByID', (e: IpcMainInvokeEvent, id: number): string => {
        return groupDao.getLibraryNameById(id)
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

    ipcMain.handle('library:add', (e: IpcMainInvokeEvent, groupId: number, name: string) => {
        try {
            groupDao.addLibrary(groupId, name)
            return true
        } catch (e: any) {
            dialog.showErrorBox('AddLibrary Error', e.message)
            return false
        }
    })

    ipcMain.handle('library:delete', (e: IpcMainInvokeEvent, id: number) => {
        try {
            groupDao.deleteLibrary(id)
            return true
        } catch (e: any) {
            dialog.showErrorBox('DeleteLibrary Error', e.message)
            return false
        }
    })

    ipcMain.handle('library:sort', (e: IpcMainInvokeEvent, currId: number, tarNextId: number, groupId: number) => {
        try {
            groupDao.sortLibrary(currId, tarNextId, groupId)
        } catch (e: any) {
            dialog.showErrorBox('SortLibrary Error', e.message)
        }
    })

    ipcMain.handle('library:queryDetail', (e: IpcMainInvokeEvent, id: number): VO.LibraryDetail | null => {
        try {
            return groupDao.queryLibraryDetail(id)
        } catch (e: any) {
            dialog.showErrorBox('Library:QueryDetail Error', e.message)
            return null
        }
    })
}