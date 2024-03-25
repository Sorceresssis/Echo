import { dialog, ipcMain, IpcMainInvokeEvent } from 'electron'
import InjectType from "../provider/injectType"
import DIContainer from '../provider/container'
import { exceptionalHandler } from '../util/common'
import GroupService from '../service/GroupService'
import LibraryService from '../service/LibraryService'

function generateCatchFn(title: string, suggest?: string) {
    return function (e: any) {
        // 弹出错误提示
        dialog.showErrorBox(title, suggest ? `${suggest}\n${e.message}` : e.message)
    }
}

export default function ipcMainGroup() {
    ipcMain.handle('group:getGroups', exceptionalHandler((): VO.Group[] => {
        return DIContainer.get<GroupService>(InjectType.GroupService).queryGroups()
    }, generateCatchFn('group:getGroups Error'), []))


    ipcMain.handle('group:rename', exceptionalHandler((e: IpcMainInvokeEvent, id: number, name: string): boolean => {
        return DIContainer.get<GroupService>(InjectType.GroupService).rename(id, name)
    }, generateCatchFn('group:rename Error'), false))


    ipcMain.handle('group:add', exceptionalHandler((e: IpcMainInvokeEvent, name: string): void => {
        DIContainer.get<GroupService>(InjectType.GroupService).create(name)
    }, generateCatchFn('group:add Error'), void 0))


    ipcMain.handle('group:delete', exceptionalHandler((e: IpcMainInvokeEvent, id: number): void => {
        DIContainer.get<GroupService>(InjectType.GroupService).delete(id)
    }, generateCatchFn('group:delete Error'), void 0))


    ipcMain.handle('group:sort', exceptionalHandler((e: IpcMainInvokeEvent, currId: number, tarNextId: number): void => {
        DIContainer.get<GroupService>(InjectType.GroupService).sort(currId, tarNextId)
    }, generateCatchFn('group:sort Error'), void 0))


    ipcMain.handle('library:queryDetail', exceptionalHandler((e: IpcMainInvokeEvent, id: number): VO.LibraryDetail | undefined => {
        return DIContainer.get<LibraryService>(InjectType.LibraryService).queryLibraryDetail(id)
    }, generateCatchFn('library:queryDetail Error'), void 0))


    ipcMain.handle('library:rename', exceptionalHandler((e: IpcMainInvokeEvent, id: number, name: string): boolean => {
        return DIContainer.get<LibraryService>(InjectType.LibraryService).rename(id, name)
    }, generateCatchFn('library:rename Error'), false))


    ipcMain.handle('library:add', exceptionalHandler((e: IpcMainInvokeEvent, groupId: number, name: string): void => {
        DIContainer.get<LibraryService>(InjectType.LibraryService).create(name, groupId)
    }, generateCatchFn('library:add Error'), void 0))


    ipcMain.handle('library:delete', exceptionalHandler((e: IpcMainInvokeEvent, id: number): void => {
        DIContainer.get<LibraryService>(InjectType.LibraryService).delete(id)
    }, generateCatchFn('library:delete Error'), void 0))


    ipcMain.handle('library:sort', exceptionalHandler((e: IpcMainInvokeEvent, currId: number, tarNextId: number, moveToGroupId: number): void => {
        DIContainer.get<LibraryService>(InjectType.LibraryService).sort(currId, tarNextId, moveToGroupId)
    }, generateCatchFn('library:sort Error'), void 0))


    ipcMain.handle('library:editExtra', exceptionalHandler((e: IpcMainInvokeEvent, data: DTO.LibraryExtraForm): boolean => {
        return DIContainer.get<LibraryService>(InjectType.LibraryService).editLibraryExtra(data)
    }, generateCatchFn('library:editExtra Error'), false))


    ipcMain.handle('library:export', exceptionalHandler((e: IpcMainInvokeEvent, libraryId: number, exportDir: string): void => {
        DIContainer.get<LibraryService>(InjectType.LibraryService).exportLibrary(libraryId, exportDir)
    }, generateCatchFn('library:export Error'), void 0))


    ipcMain.handle('library:import', exceptionalHandler((e: IpcMainInvokeEvent, groupId: number, importFiles: string[]): void => {
        DIContainer.get<LibraryService>(InjectType.LibraryService).importLibrary(groupId, importFiles)
    }, generateCatchFn('library:import Error'), void 0))
}