import { ipcMain, IpcMainInvokeEvent } from 'electron'
import fs from 'fs'
import path from 'path'
import { config } from '../config'
import { GroupDao } from '../dao/groupDao'
import Result from '../pojo/result'

export function ipcMainGroup() {
    const groupDao = new GroupDao(path.resolve(config.userDataPath, "database/group.db"))

    ipcMain.handle('group:getGroups', (e: IpcMainInvokeEvent): IGroup[] => {
        groupDao.getGroups()
        return []
    })

    ipcMain.handle('group:add', (e: IpcMainInvokeEvent, a) => {
    })

    ipcMain.handle('group:delete', (e: IpcMainInvokeEvent, a) => {

    })

    ipcMain.handle('group:updataOrder', (e: IpcMainInvokeEvent, a) => {

    })

    ipcMain.handle('group:rename', (e: IpcMainInvokeEvent, a): Result => {
        return Result.success()
    })

    ipcMain.handle('library:getLibraryNameByID', (e: IpcMainInvokeEvent, id: number): Result => {
        try {
            return Result.success(groupDao.getLibraryNameByID(id))
        }
        catch (e: any) {
            return Result.error(e.message)
        }
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