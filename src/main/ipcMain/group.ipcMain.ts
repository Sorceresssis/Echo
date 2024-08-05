import { dialog, ipcMain, IpcMainInvokeEvent } from 'electron'
import InjectType from "../provider/injectType"
import DIContainer from '../provider/container'
import type GroupService from '../service/GroupService'
import type LibraryService from '../service/LibraryService'
import { exceptionHandleWrap } from '../utils/common'


function showErrorBox(title: string, error: any, suggest?: string) {
    const content: string[] = [String(error)]
    if (suggest) {
        content.push('\n\n')
        content.push('Suggest:\n')
        content.push(suggest)
    }

    dialog.showErrorBox(title, content.join(''))
}

export default function ipcMainGroup() {
    const groupService = DIContainer.get<GroupService>(InjectType.GroupService)
    const libraryService = DIContainer.get<LibraryService>(InjectType.LibraryService)

    ipcMain.handle('group:getGroups', exceptionHandleWrap((e: IpcMainInvokeEvent): VO.Group[] => {
        return groupService.queryGroups()
    }, (e) => { showErrorBox('group:getGroups', e) }))

    ipcMain.handle('group:rename', (e: IpcMainInvokeEvent, id: number, name: string): boolean => {
        try {
            return groupService.rename(id, name)
        } catch (e) {
            showErrorBox('group:rename', e)
            throw e
        }
    })

    ipcMain.handle('group:create', (e: IpcMainInvokeEvent, name: string): void => {
        try {
            groupService.create(name)
        } catch (e) {
            showErrorBox('group:create', e)
            throw e
        }
    })

    ipcMain.handle('group:delete', async (e: IpcMainInvokeEvent, id: number): Promise<void> => {
        try {
            await groupService.delete(id)
        } catch (e) {
            showErrorBox('group:delete', e)
            throw e
        }
    })

    ipcMain.handle('group:changeOrder', (e: IpcMainInvokeEvent, currId: number, tarNextId: number): void => {
        try {
            groupService.changeOrder(currId, tarNextId)
        } catch (e) {
            showErrorBox('group:changeOrder', e)
            throw e
        }
    })

    ipcMain.handle('library:queryDetail', (e: IpcMainInvokeEvent, id: number): VO.LibraryDetail | undefined => {
        try {
            return libraryService.queryLibraryDetail(id)
        } catch (e) {
            showErrorBox('library:queryDetail', e)
            throw e
        }
    })

    ipcMain.handle('library:rename', (e: IpcMainInvokeEvent, id: number, name: string): boolean => {
        try {
            return libraryService.rename(id, name)
        } catch (e) {
            showErrorBox('library:rename', e)
            throw e
        }
    })

    ipcMain.handle('library:create', (e: IpcMainInvokeEvent, groupId: number, name: string): void => {
        try {
            libraryService.create(name, groupId)
        } catch (e) {
            showErrorBox('library:create', e)
            throw e
        }
    })

    ipcMain.handle('library:delete', async (e: IpcMainInvokeEvent, id: number): Promise<void> => {
        try {
            await libraryService.delete(id)
        } catch (e) {
            showErrorBox('library:delete', e)
            throw e
        }
    })

    ipcMain.handle('library:changeOrder', (e: IpcMainInvokeEvent, currId: number, tarNextId: number, moveToGroupId: number): void => {
        try {
            libraryService.changeOrder(currId, tarNextId, moveToGroupId)
        } catch (e) {
            showErrorBox('library:changeOrder', e)
            throw e
        }
    })

    ipcMain.handle('library:editExtra', (e: IpcMainInvokeEvent, data: RP.LibraryExtraFormData): boolean => {
        try {
            return libraryService.editLibraryExtra(data)
        } catch (e) {
            showErrorBox('library:editExtra', e)
            throw e
        }
    })

    ipcMain.handle('library:export', (e: IpcMainInvokeEvent, libraryId: number, exportDir: string): void => {
        try {
            libraryService.exportLibrary(libraryId, exportDir)
        } catch (e) {
            showErrorBox('library:export', e)
            throw e
        }
    })

    ipcMain.handle('library:import', (e: IpcMainInvokeEvent, groupId: number, importFiles: string[]): void => {
        try {
            libraryService.importLibrary(groupId, importFiles)
        } catch (e) {
            showErrorBox('library:import', e)
            throw e
        }
    })
}