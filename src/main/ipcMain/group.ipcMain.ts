import { ipcMain, IpcMainInvokeEvent } from 'electron'
import { handleError } from '../util/common'
import 'reflect-metadata'
import DIContainer from '../DI/DIContainer'
import GroupService from '../service/GroupService'
import LibraryService from '../service/LibraryService'


export default function ipcMainGroup() {
    ipcMain.handle('group:getGroups', handleError((): VO.Group[] => {
        return DIContainer.get<GroupService>(GroupService).queryGroups()
    }, [], 'group:getGroups Error'))


    ipcMain.handle('group:rename', handleError((e: IpcMainInvokeEvent, id: number, name: string): boolean => {
        return DIContainer.get<GroupService>(GroupService).rename(id, name)
    }, false, 'group:rename Error'))


    ipcMain.handle('group:add', handleError((e: IpcMainInvokeEvent, name: string): void => {
        DIContainer.get<GroupService>(GroupService).create(name)
    }, void 0, 'group:add Error'))


    ipcMain.handle('group:delete', handleError((e: IpcMainInvokeEvent, id: number): void => {
        DIContainer.get<GroupService>(GroupService).delete(id)
    }, void 0, 'group:delete Error'))


    ipcMain.handle('group:sort', handleError((e: IpcMainInvokeEvent, currId: number, tarNextId: number): void => {
        DIContainer.get<GroupService>(GroupService).sort(currId, tarNextId)
    }, void 0, 'group:sort Error'))


    ipcMain.handle('library:queryDetail', handleError((e: IpcMainInvokeEvent, id: number): VO.LibraryDetail | undefined => {
        return DIContainer.get<LibraryService>(LibraryService).queryLibraryDetail(id)
    }, void 0, 'library:queryDetail Error'))


    ipcMain.handle('library:rename', handleError((e: IpcMainInvokeEvent, id: number, name: string): boolean => {
        return DIContainer.get<LibraryService>(LibraryService).rename(id, name)
    }, false, 'library:rename Error'))


    ipcMain.handle('library:add', handleError((e: IpcMainInvokeEvent, groupId: number, name: string): void => {
        DIContainer.get<LibraryService>(LibraryService).create(name, groupId)
    }, void 0, 'library:add Error'))


    ipcMain.handle('library:delete', handleError((e: IpcMainInvokeEvent, id: number): void => {
        DIContainer.get<LibraryService>(LibraryService).delete(id)
    }, void 0, 'library:delete Error'))

    ipcMain.handle('library:sort', handleError((e: IpcMainInvokeEvent, currId: number, tarNextId: number, moveToGroupId: number): void => {
        DIContainer.get<LibraryService>(LibraryService).sort(currId, tarNextId, moveToGroupId)
    }, void 0, 'library:sort Error'))


    ipcMain.handle('library:editExtra', handleError((e: IpcMainInvokeEvent, data: DTO.LibraryExtraForm): boolean => {
        return DIContainer.get<LibraryService>(LibraryService).editLibraryExtra(data)
    }, false, 'library:editExtra Error'))
}