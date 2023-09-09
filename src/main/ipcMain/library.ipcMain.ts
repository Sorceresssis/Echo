import { ipcMain, IpcMainInvokeEvent, dialog } from "electron"
import { isLegalAbsolutePath } from "../util/FileManager"
import LibraryDao from "../dao/libraryDao"
import RecordService from "../service/RecordService"
import ManageRecordSerivce from "../service/ManageRecordSerivce"
import AuthorService from "../service/AuthorService"
import TagService from "../service/TagService"
import DirnameService from "../service/DirnameService"
import Result from "../util/Result"

// 多个窗口可能同时调用，所有不能使用唯一的LibraryDao
export default function ipcMainLibrary() {
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

    ipcMain.handle('record:queryRecmds', (e: IpcMainInvokeEvent, libraryId: number, options: DTO.QueryRecordRecommendationsOptions): DTO.Page<VO.RecordRecommendation> => {
        const recordService = new RecordService(libraryId)
        try {
            // return recordService.queryRecordRecmds(options) 

            return { total: 0, rows: [] }
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
            return
        } finally {
            recordService.close()
        }
    })

    ipcMain.handle('record:edit', (e: IpcMainInvokeEvent, libraryId: number, formData: DTO.EditRecordForm, options: DTO.EditRecordOptions): Result | undefined => {
        const manageRecordSerivce = new ManageRecordSerivce(libraryId)
        try {
            return manageRecordSerivce.edit(formData, options)
        } catch (e: any) {
            dialog.showErrorBox('record:edit', e.message)
            return
        } finally {
            manageRecordSerivce.close()
        }
    })

    ipcMain.handle('record:delete', (e: IpcMainInvokeEvent, libraryId: number, recordId: number) => {

    })

    ipcMain.handle('record:deleteByAttribute', (e: IpcMainInvokeEvent, libraryId: number, formData: DTO.DeleteRecordByAttributeForm) => {
        const manageRecordSerivce = new ManageRecordSerivce(libraryId)
        try {
            return manageRecordSerivce.deleteByAttribute(formData)
        } catch (e: any) {
            dialog.showErrorBox('record:batchDelete', e.message)
            return
        } finally {
            manageRecordSerivce.close()
        }
    })

    //ANCHOR Author

    ipcMain.handle('author:queryRecmds', async (e: IpcMainInvokeEvent, libraryId: number, options: DTO.QueryAuthorRecommendationsOptions): Promise<DTO.Page<VO.AuthorRecommendation>> => {
        try {
            const worker = AuthorService.getWorker(libraryId)
            worker.postMessage({
                functionName: 'queryAuthorRecmds',
                functionParams: {
                    options
                }
            })
            return await new Promise((resolve) => {
                worker.on('message', (value: any) => {
                    resolve(value)
                })
            }) as DTO.Page<VO.AuthorRecommendation>
        } catch (e: any) {
            dialog.showErrorBox('author:queryRecmds', e.message)
            return { total: 0, rows: [] }
        }
    })

    ipcMain.handle('author:queryDetail', (e: IpcMainInvokeEvent, libraryId: number, authorId: number): VO.Author | undefined => {
        const authorService = new AuthorService(libraryId)
        try {
            return authorService.queryAuthorDetail(authorId)
        } catch (e: any) {
            dialog.showErrorBox('author:query', e.message)
            return
        } finally {
            authorService.close()
        }
    })

    ipcMain.handle('author:edit', async (e: IpcMainInvokeEvent, libraryId: number, formData: DTO.EditAuthorForm,) => {
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
            }
            else {
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