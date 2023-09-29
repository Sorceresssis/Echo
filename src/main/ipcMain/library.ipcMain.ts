import { ipcMain, IpcMainInvokeEvent, dialog } from "electron"
import appConfig from "../app/config"
import DIContainer from '../DI/DIContainer'
import DI_TYPES, { DILibrary } from "../DI/DITypes"
import { exceptionalHandler } from '../util/common'
import LibraryDB from "../db/LibraryDB"
import { isLegalAbsolutePath } from "../util/FileManager"

import RecordService from "../service/RecordService"
import ManageRecordSerivce from "../service/ManageRecordSerivce"

import Result from "../util/Result"
import LibraryDao from "../dao/libraryDBDao"
import AuthorService from "../tmpService/AuthorService"
import TagService from "../tmpService/TagService"
import DirnameService from "../tmpService/DirnameService"
import TmmpRecordService from "../tmpService/RecordService"

const { rebindLibrary, closeLibraryDB } = function () {
    const library = DIContainer.get<DILibrary>(DI_TYPES.Library)

    return {
        rebindLibrary: function (libraryId: number) {
            library.id = libraryId
            library.dbConnection = new LibraryDB(appConfig.getLibraryDBFilePath(libraryId))
        },
        closeLibraryDB: function () {
            library.dbConnection?.close()
        }
    }
}()

function generateCatchFn(title: string, suggest?: string) {
    return function (e: any) {
        dialog.showErrorBox(title, suggest ? `${suggest}\n${e.message}` : e.message)
    }
}

function ipcMainLibrary() {
    ipcMain.handle('record:autoComplete', (e: IpcMainInvokeEvent, libraryId: number, options: DTO.AcOptions): VO.AcSuggestion[] => {
        const libraryDao = new LibraryDao(libraryId)
        try {
            return libraryDao.autoComplete(options.type, options.queryWord, options.ps)
        } catch (e: any) {
            dialog.showErrorBox('record:autoComplete', e.message)
            return []
        } finally {
            libraryDao.destroy()
        }
    })

    ipcMain.handle('record:queryRecmds', async (e: IpcMainInvokeEvent, libraryId: number, options: DTO.QueryRecordRecommendationsOptions): Promise<DTO.Page<VO.RecordRecommendation>> => {
        const recordService = new RecordService(libraryId)
        try {
            return recordService.queryRecordRecmds(options)
        } catch (e: any) {
            dialog.showErrorBox('record:queryRecmds', e.message)
            return { total: 0, rows: [] }
        } finally {
            recordService.close()
        }
    })

    ipcMain.handle('record:queryDetail', (e: IpcMainInvokeEvent, libraryId: number, recordId: number): VO.RecordDetail | undefined => {
        const recordService = new RecordService(libraryId)
        try {
            return recordService.queryRecordDetail(recordId)
        } catch (e: any) {
            dialog.showErrorBox('record:queryDetail', e.message)
        } finally {
            recordService.close()
        }
    })

    ipcMain.handle('record:edit', (e: IpcMainInvokeEvent, libraryId: number, formData: DTO.EditRecordForm, options: DTO.EditRecordOptions): Result | undefined => {
        rebindLibrary(libraryId)
        const manageRecordSerivce = new ManageRecordSerivce(libraryId)
        try {
            return options.batch
                ? manageRecordSerivce.addBatch(formData, options.distinct)
                : manageRecordSerivce.edit(formData)
        } catch (e: any) {
            dialog.showErrorBox('record:edit', e.message)
            return Result.error()
        } finally {
            manageRecordSerivce.close()
        }
    })

    ipcMain.handle('record:batchProcessing', (
        e: IpcMainInvokeEvent,
        libraryId: number,
        type: DTO.RecordBatchProcessingType,
        recordIds: number[]
    ) => {
        const recordService = new RecordService(libraryId)
        try {
            switch (type) {
                case 'recycle':
                    recordService.recycle(recordIds)
                    break
                case 'recover':
                    recordService.recover(recordIds)
                    break
                case 'delete_recycled':
                    recordService.deleteRecycled(recordIds)
                    break
                case 'delete_recycled_all':
                    recordService.deleteRecycledAll()
                    break
            }
        } catch (e: any) {
            dialog.showErrorBox('record:batchProcessing', e.message)
        } finally {
            recordService.close()
        }
    })

    ipcMain.handle('record:deleteByAttribute', (e: IpcMainInvokeEvent, libraryId: number, formData: DTO.DeleteRecordByAttributeForm) => {
        const recordService = new RecordService(libraryId)
        try {
            return recordService.recycleRecordByAttribute(formData)
        } catch (e: any) {
            dialog.showErrorBox('record:batchDelete', e.message)
        } finally {
            recordService.close()
        }
    })


    //ANCHOR Author

    ipcMain.handle('author:queryRecmds', exceptionalHandler((e: IpcMainInvokeEvent, libraryId: number, options: DTO.QueryAuthorRecommendationsOptions): DTO.Page<VO.AuthorRecommendation> => {
        rebindLibrary(libraryId)
        return DIContainer.get<AuthorService>(DI_TYPES.AuthorService).queryAuthorRecmds(options)
    }, generateCatchFn('author:queryRecmds'), { total: 0, rows: [] }, closeLibraryDB))


    ipcMain.handle('author:queryDetail', exceptionalHandler((e: IpcMainInvokeEvent, libraryId: number, authorId: number): VO.Author | undefined => {
        rebindLibrary(libraryId)
        return DIContainer.get<AuthorService>(DI_TYPES.AuthorService).queryAuthorDetail(authorId)
    }, generateCatchFn('author:queryDetail'), void 0, closeLibraryDB))


    ipcMain.handle('author:edit', exceptionalHandler((e: IpcMainInvokeEvent, libraryId: number, formData: DTO.EditAuthorForm) => {
        rebindLibrary(libraryId)
        DIContainer.get<AuthorService>(DI_TYPES.AuthorService).editAuthor(formData)
        return true
    }, generateCatchFn('author:edit'), false, closeLibraryDB))


    ipcMain.handle('author:delete', exceptionalHandler((e: IpcMainInvokeEvent, libraryId: number, authorId: number): boolean => {
        rebindLibrary(libraryId)
        DIContainer.get<AuthorService>(DI_TYPES.AuthorService).deleteAuthor(authorId)
        return true
    }, generateCatchFn('author:delete'), false, closeLibraryDB))


    //ANCHOR Tag 

    ipcMain.handle('tag:queryDetails', exceptionalHandler((e: IpcMainInvokeEvent, libraryId: number, options: DTO.QueryTagDetailsOptions): DTO.Page<VO.TagDetail> => {
        rebindLibrary(libraryId)
        return DIContainer.get<TagService>(DI_TYPES.TagService).queryTagDetails(options)
    }, generateCatchFn('tag:queryDetails'), { total: 0, rows: [] }, closeLibraryDB))


    ipcMain.handle('tag:edit', exceptionalHandler((e: IpcMainInvokeEvent, libraryId: number, tagId: number, newValue: string) => {
        rebindLibrary(libraryId)
        DIContainer.get<TagService>(DI_TYPES.TagService).editTag(tagId, newValue)
    }, generateCatchFn('tag:edit'), void 0, closeLibraryDB))


    ipcMain.handle('tag:delete', exceptionalHandler((e: IpcMainInvokeEvent, libraryId: number, tagId: number) => {
        rebindLibrary(libraryId)
        DIContainer.get<TagService>(DI_TYPES.TagService).deleteTag(tagId)
    }, generateCatchFn('tag:delete'), void 0, closeLibraryDB))


    //ANCHOR Dirname

    ipcMain.handle('dirname:queryDetails', exceptionalHandler((e: IpcMainInvokeEvent, libraryId: number, options: DTO.QueryDirnameDetailsOptions): DTO.Page<VO.DirnameDetail> | undefined => {
        rebindLibrary(libraryId)
        return DIContainer.get<DirnameService>(DI_TYPES.DirnameService).queryDirnameDetails(options)
    }, generateCatchFn('dirname:queryDetails'), { total: 0, rows: [] }, closeLibraryDB))


    ipcMain.handle('dirname:edit', exceptionalHandler((e: IpcMainInvokeEvent, libraryId: number, dirnameId: number, newValue: string): Result => {
        rebindLibrary(libraryId)
        return DIContainer.get<DirnameService>(DI_TYPES.DirnameService).editDirname(dirnameId, newValue)
    }, generateCatchFn('dirname:edit'), Result.error(), closeLibraryDB))


    ipcMain.handle('dirname:delete', exceptionalHandler((e: IpcMainInvokeEvent, libraryId: number, dirnameId: number): void => {
        rebindLibrary(libraryId)
        DIContainer.get<DirnameService>(DI_TYPES.DirnameService).deleteDirname(dirnameId)
    }, generateCatchFn('dirname:delete'), void 0, closeLibraryDB))


    ipcMain.handle('dirname:startsWithReplace', (e: IpcMainInvokeEvent, libraryId: number, target: string, replace: string): Result => {
        const libraryDao = new LibraryDao(libraryId)
        try {
            // 过滤掉window的 不合法的盘符
            if (isLegalAbsolutePath(target) && isLegalAbsolutePath(replace)) {
                libraryDao.startsWithReplaceDirname(target, replace)
                return Result.success()
            } else {
                return Result.error('路径不合法')
            }
        } catch (e: any) {
            dialog.showErrorBox('dirname:startsWithReplace', e.message)
            return Result.error(e.message)
        } finally {
            libraryDao.destroy()
        }
    })
}


export default ipcMainLibrary