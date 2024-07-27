import { dialog, ipcMain, IpcMainInvokeEvent } from 'electron'
import InjectType from "../provider/injectType"
import DIContainer from '../provider/container'
import { exceptionHandleWrapper } from '../utils/common'
import type GroupService from '../service/GroupService'
import type LibraryService from '../service/LibraryService'

const genErrorHandler = (title: string, suggest?: string) => {
    return function (e: any) {
        dialog.showErrorBox(title, suggest ? `${suggest}\n${e.message}` : e.message)
    }
}

export default function ipcMainGroup() {
    ipcMain.handle('group:getGroups', exceptionHandleWrapper((): VO.Group[] => {
        return DIContainer.get<GroupService>(InjectType.GroupService).queryGroups()
    }, genErrorHandler('group:getGroups Error'), []))


    ipcMain.handle('group:rename', exceptionHandleWrapper((e: IpcMainInvokeEvent, id: number, name: string): boolean => {
        return DIContainer.get<GroupService>(InjectType.GroupService).rename(id, name)
    }, genErrorHandler('group:rename Error'), false))


    ipcMain.handle('group:create', exceptionHandleWrapper((e: IpcMainInvokeEvent, name: string): void => {
        DIContainer.get<GroupService>(InjectType.GroupService).create(name)
    }, genErrorHandler('group:create Error'), void 0))


    ipcMain.handle('group:delete', exceptionHandleWrapper((e: IpcMainInvokeEvent, id: number): void => {
        // TODO Promse
        DIContainer.get<GroupService>(InjectType.GroupService).delete(id)
    }, genErrorHandler('group:delete Error'), void 0))


    ipcMain.handle('group:changeOrder', exceptionHandleWrapper((e: IpcMainInvokeEvent, currId: number, tarNextId: number): void => {
        DIContainer.get<GroupService>(InjectType.GroupService).changeOrder(currId, tarNextId)
    }, genErrorHandler('group:sort Error'), void 0))


    ipcMain.handle('library:queryDetail', exceptionHandleWrapper((e: IpcMainInvokeEvent, id: number): VO.LibraryDetail | undefined => {
        return DIContainer.get<LibraryService>(InjectType.LibraryService).queryLibraryDetail(id)
    }, genErrorHandler('library:queryDetail Error'), void 0))


    ipcMain.handle('library:rename', exceptionHandleWrapper((e: IpcMainInvokeEvent, id: number, name: string): boolean => {
        return DIContainer.get<LibraryService>(InjectType.LibraryService).rename(id, name)
    }, genErrorHandler('library:rename Error'), false))


    ipcMain.handle('library:create', exceptionHandleWrapper((e: IpcMainInvokeEvent, groupId: number, name: string): void => {
        DIContainer.get<LibraryService>(InjectType.LibraryService).create(name, groupId)
    }, genErrorHandler('library:create Error'), void 0))


    ipcMain.handle('library:delete', exceptionHandleWrapper((e: IpcMainInvokeEvent, id: number): void => {
        // TODO Promse
        DIContainer.get<LibraryService>(InjectType.LibraryService).delete(id)
    }, genErrorHandler('library:delete Error'), void 0))


    ipcMain.handle('library:changeOrder', exceptionHandleWrapper((
        e: IpcMainInvokeEvent, currId: number, tarNextId: number, moveToGroupId: number
    ): void => {
        DIContainer.get<LibraryService>(InjectType.LibraryService).changeOrder(currId, tarNextId, moveToGroupId)
    }, genErrorHandler('library:sort Error'), void 0))


    ipcMain.handle('library:editExtra', exceptionHandleWrapper((
        e: IpcMainInvokeEvent, data: RP.LibraryExtraFormData
    ): boolean => {
        return DIContainer.get<LibraryService>(InjectType.LibraryService).editLibraryExtra(data)
    }, genErrorHandler('library:editExtra Error'), false))


    ipcMain.handle('library:export', exceptionHandleWrapper((
        e: IpcMainInvokeEvent, libraryId: number, exportDir: string
    ): void => {
        DIContainer.get<LibraryService>(InjectType.LibraryService).exportLibrary(libraryId, exportDir)
    }, genErrorHandler('library:export Error'), void 0))


    ipcMain.handle('library:import', exceptionHandleWrapper((
        e: IpcMainInvokeEvent, groupId: number, importFiles: string[]
    ): void => {
        DIContainer.get<LibraryService>(InjectType.LibraryService).importLibrary(groupId, importFiles)
    }, genErrorHandler('library:import Error'), void 0))
}