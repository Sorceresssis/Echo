import { ipcMain, IpcMainInvokeEvent, dialog } from "electron"
import DIContainer from '../DI/DIContainer'
import DI_TYPES from "../DI/DITypes"
// import { exceptionalHandler } from '../util/common'
import { isLegalAbsolutePath } from "../util/FileManager"
import LibraryDao from "../dao/libraryDBDao"
import RecordService from "../service/RecordService"
import ManageRecordSerivce from "../service/ManageRecordSerivce"
import AuthorService from "../service/AuthorService"
import TagService from "../service/TagService"
import DirnameService from "../service/DirnameService"
import Result from "../util/Result"
// import LibraryDB from "../db/LibraryDB"
// import appConfig from "../app/config"

// function distroyLibraryDB() {
//     const libraryDB = DIContainer.get<LibraryDB>(DI_TYPES.LibraryDB)
//     libraryDB.close()
//     DIContainer.unbind(DI_TYPES.LibraryDB)
// }

function bindLibrary(libraryId: number) {

    DIContainer.rebind<number>(DI_TYPES.LibraryId).toConstantValue(libraryId)
    // const libraryDB = new LibraryDB(appConfig.getLibraryDBFilePath(libraryId))
    // console.log(DIContainer.isBound(DI_TYPES.LibraryDB))
    // DIContainer.bind<LibraryDB>(DI_TYPES.LibraryDB).toConstantValue(libraryDB)
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
        bindLibrary(libraryId)
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

    ipcMain.handle('author:queryRecmds', (e: IpcMainInvokeEvent, libraryId: number, options: DTO.QueryAuthorRecommendationsOptions): DTO.Page<VO.AuthorRecommendation> => {
        const authorService = new AuthorService(libraryId)
        try {
            return authorService.queryAuthorRecmds(options)
        } catch (e: any) {
            dialog.showErrorBox('author:queryRecmds', e.message)
            return { total: 0, rows: [] }
        } finally {
            authorService.close()
        }
    })

    ipcMain.handle('author:queryDetail', (e: IpcMainInvokeEvent, libraryId: number, authorId: number): VO.Author | undefined => {
        const authorService = new AuthorService(libraryId)
        try {
            return authorService.queryAuthorDetail(authorId)
        } catch (e: any) {
            dialog.showErrorBox('author:query', e.message)
        } finally {
            authorService.close()
        }
    })

    ipcMain.handle('author:edit', async (e: IpcMainInvokeEvent, libraryId: number, formData: DTO.EditAuthorForm,) => {
        bindLibrary(libraryId)
        const authorService = new AuthorService(libraryId)
        try {
            authorService.editAuthor(formData)
            return true
        } catch (e: any) {
            dialog.showErrorBox('author:edit', e.message)
            return false
        } finally {
            authorService.close()
        }
    })

    ipcMain.handle('author:delete', (e: IpcMainInvokeEvent, libraryId: number, authorId: number) => {
        const authorService = new AuthorService(libraryId)
        try {
            authorService.deleteAuthor(authorId)
        } catch (e: any) {
            dialog.showErrorBox('author:delete', e.message)
        } finally {
            authorService.close()
        }
    })

    //ANCHOR Tag

    ipcMain.handle('tag:queryDetails', (e: IpcMainInvokeEvent, libraryId: number, options: DTO.QueryTagDetailsOptions): DTO.Page<VO.TagDetail> => {
        const tagService = new TagService(libraryId)
        try {
            return tagService.queryTagDetails(options)
        } catch (e: any) {
            dialog.showErrorBox('tag:query', e.message)
            return { total: 0, rows: [] }
        } finally {
            tagService.close()
        }
    })

    ipcMain.handle('tag:edit', (e: IpcMainInvokeEvent, libraryId: number, tagId: number, newValue: string) => {
        const tagService = new TagService(libraryId)
        try {
            tagService.editTag(tagId, newValue)
        } catch (e: any) {
            dialog.showErrorBox('tag:edit', e.message)
        } finally {
            tagService.close()
        }
    })

    ipcMain.handle('tag:delete', (e: IpcMainInvokeEvent, libraryId: number, tagId: number) => {
        const tagService = new TagService(libraryId)
        try {
            tagService.deleteTag(tagId)
        } catch (e: any) {
            dialog.showErrorBox('tag:delete', e.message)
        } finally {
            tagService.close()
        }
    })

    //ANCHOR Dirname

    ipcMain.handle('dirname:queryDetails', (e: IpcMainInvokeEvent, libraryId: number, options: DTO.QueryDirnameDetailsOptions): DTO.Page<VO.DirnameDetail> | undefined => {
        const dirnameService = new DirnameService(libraryId)
        try {
            return dirnameService.queryDirnameDetails(options)
        } catch (e: any) {
            dialog.showErrorBox('dirname:queryDetails', e.message)
            return { total: 0, rows: [] }
        } finally {
            dirnameService.close()
        }
    })

    ipcMain.handle('dirname:edit', (e: IpcMainInvokeEvent, libraryId: number, dirnameId: number, newValue: string): Result => {
        const dirnameService = new DirnameService(libraryId)
        try {
            return dirnameService.editDirname(dirnameId, newValue)
                ? Result.success()
                : Result.error('path is illegal')
        } catch (e: any) {
            dialog.showErrorBox('dirname:edit', e.message)
            return Result.error(e.message)
        } finally {
            dirnameService.close()
        }
    })

    ipcMain.handle('dirname:delete', (e: IpcMainInvokeEvent, libraryId: number, dirnameId: number) => {
        const dirnameService = new DirnameService(libraryId)
        try {
            dirnameService.deleteDirname(dirnameId)
        } catch (e: any) {
            dialog.showErrorBox('dirname:delete', e.message)
        } finally {
            dirnameService.close()
        }
    })

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