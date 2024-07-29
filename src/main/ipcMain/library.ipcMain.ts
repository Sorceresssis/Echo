import { ipcMain, IpcMainInvokeEvent, dialog } from "electron"
import appPaths from "../app/appPaths"
import InjectType from "../provider/injectType"
import DIContainer, { type LibraryEnv } from "../provider/container"
import { exceptionHandleWrap, exceptionHandleWrapAsync } from '../utils/common'
import LibraryDB from "../db/LibraryDB"
import ResponseResult from "../pojo/ResponseResult"
import type AutocompleteService from "../service/AutocompleteService"
import type RecordService from "../service/RecordService"
import type AuthorService from "../service/AuthorService"
import type TagService from "../service/TagService"
import type DirnameService from "../service/DirnameService"
import type SeriesService from "../service/SeriesService"


const { rebindLibrary, closeLibraryDB } = function () {
    const boundLibEnv = DIContainer.get<LibraryEnv>(InjectType.LibraryEnv)
    return {
        rebindLibrary: function (libraryId: number) {
            const {
                genRecordImagesDirPathConstructor,
                genAuthorImagesDirPathConstructor,
            } = appPaths.genLibraryImagesDirPathConstructor(libraryId)

            boundLibEnv.id = libraryId
            boundLibEnv.genRecordImagesDirPathConstructor = genRecordImagesDirPathConstructor
            boundLibEnv.genAuthorImagesDirPathConstructor = genAuthorImagesDirPathConstructor
            boundLibEnv.db = new LibraryDB(libraryId)
        },
        closeLibraryDB: function () {
            boundLibEnv.db.close()
        }
    }
}()

function generateCatchFn(title: string, suggest?: string) {
    return function showErrorBox(error: any) {
        const content: string[] = [String(error)]
        if (suggest) {
            content.push('\n\n')
            content.push('Suggest:\n')
            content.push(suggest)
        }

        dialog.showErrorBox(title, content.join(''))
    }
}

function ipcMainLibrary() {
    ipcMain.handle('record:autoComplete', exceptionHandleWrap((e: IpcMainInvokeEvent, libraryId: number, options: RP.AutoCompleteOptions): VO.AutoCompleteSuggestion[] => {
        rebindLibrary(libraryId)
        return DIContainer.get<AutocompleteService>(InjectType.AutocompleteService).query(options.type, options.queryWord, options.ps)
    }, generateCatchFn('record:autoComplete'), true, closeLibraryDB))


    ipcMain.handle('record:queryRecmds', exceptionHandleWrap((e: IpcMainInvokeEvent, libraryId: number, options: RP.QueryRecordRecommendationsOptions): DTO.PagedResult<VO.RecordRecommendation> => {
        rebindLibrary(libraryId)
        return DIContainer.get<RecordService>(InjectType.RecordService).queryRecordRecmds(options)
    }, generateCatchFn('record:queryRecmds'), true, closeLibraryDB))


    ipcMain.handle('record:queryDetail', exceptionHandleWrap((e: IpcMainInvokeEvent, libraryId: number, recordId: number): VO.RecordDetail | undefined => {
        rebindLibrary(libraryId)
        return DIContainer.get<RecordService>(InjectType.RecordService).queryRecordDetail(recordId)
    }, generateCatchFn('record:queryDetail'), true, closeLibraryDB))


    ipcMain.handle('record:querySimilarRecmds', exceptionHandleWrap((e: IpcMainInvokeEvent, libraryId: number, recordId: number, count?: number): VO.RecordRecommendation[] => {
        rebindLibrary(libraryId)
        return DIContainer.get<RecordService>(InjectType.RecordService).querySimilarRecordRecmds(recordId, count)
    }, generateCatchFn('record:querySimilarRecmds'), true, closeLibraryDB))


    ipcMain.handle('record:edit', exceptionHandleWrapAsync(async (e: IpcMainInvokeEvent, libraryId: number, formData: RP.EditRecordFormData): Promise<ResponseResult<void>> => {
        rebindLibrary(libraryId)
        const recordService = DIContainer.get<RecordService>(InjectType.RecordService)
        return await recordService.editRecord(formData)
    }, generateCatchFn('record:edit'), true, closeLibraryDB))

    ipcMain.handle('record:addRecordFromMetadata', async (
        e: IpcMainInvokeEvent,
        libraryId: number,
        param: RP.AddRecordFromMetadataParam
    ): Promise<ResponseResult<void>> => {
        try {
            rebindLibrary(libraryId)
            const recordService = DIContainer.get<RecordService>(InjectType.RecordService)
            if (param.type === 0) {
                if (param.operate === 0) await recordService.addRecordFromMetadata(param.dir)
                else await recordService.updateRecordFromMetadata(param.dir)
            } else if (param.type === 1) {
                await recordService.importRecordFromMultipleMetadata(param.dir, param.operate)
            } else {
                throw new Error('参数 type 错误')
            }
            return ResponseResult.success()
        } catch (e: any) {
            return ResponseResult.error(e.message)
        } finally {
            closeLibraryDB()
        }
    })

    ipcMain.handle('record:batchProcessing', exceptionHandleWrap((e: IpcMainInvokeEvent, libraryId: number, type: RP.RecordBatchProcessingType, recordIds: number[]): void => {
        rebindLibrary(libraryId)
        DIContainer.get<RecordService>(InjectType.RecordService).batchProcessing(type, recordIds)
    }, generateCatchFn('record:batchProcessing'), true, closeLibraryDB))


    ipcMain.handle('record:deleteByAttribute', exceptionHandleWrap((e: IpcMainInvokeEvent, libraryId: number, formData: DTO.DeleteRecordByAttributeForm) => {
        rebindLibrary(libraryId)
        DIContainer.get<RecordService>(InjectType.RecordService).recycleRecordByAttribute(formData)
    }, generateCatchFn('record:batchDelete'), true, closeLibraryDB))


    //ANCHOR Author

    ipcMain.handle('author:queryRecmds', exceptionHandleWrap((e: IpcMainInvokeEvent, libraryId: number, options: RP.QueryAuthorRecommendationsOptions): DTO.PagedResult<VO.AuthorRecommendation> => {
        rebindLibrary(libraryId)
        return DIContainer.get<AuthorService>(InjectType.AuthorService).queryAuthorRecmds(options)
    }, generateCatchFn('author:queryRecmds'), true, closeLibraryDB))


    ipcMain.handle('author:queryDetail', exceptionHandleWrap((e: IpcMainInvokeEvent, libraryId: number, authorId: number): VO.AuthorDetail | undefined => {
        rebindLibrary(libraryId)
        return DIContainer.get<AuthorService>(InjectType.AuthorService).queryAuthorDetail(authorId)
    }, generateCatchFn('author:queryDetail'), true, closeLibraryDB))


    ipcMain.handle('author:edit', exceptionHandleWrapAsync(async (e: IpcMainInvokeEvent, libraryId: number, formData: RP.EditAuthorFormData) => {
        rebindLibrary(libraryId)
        await DIContainer.get<AuthorService>(InjectType.AuthorService).editAuthor(formData)
        return true
    }, generateCatchFn('author:edit'), true, closeLibraryDB))


    ipcMain.handle('author:delete', exceptionHandleWrap((e: IpcMainInvokeEvent, libraryId: number, authorId: number): boolean => {
        rebindLibrary(libraryId)
        DIContainer.get<AuthorService>(InjectType.AuthorService).deleteAuthor(authorId)
        return true
    }, generateCatchFn('author:delete'), false, closeLibraryDB))


    ipcMain.handle('role:get', (e: IpcMainInvokeEvent, libraryId: number): ResponseResult<void> => {
        try {
            rebindLibrary(libraryId)
            // const data = DIContainer.get<RoleDao>(InjectType.RoleDao).query()
            return ResponseResult.success()
        } catch (e: any) {
            return ResponseResult.error()
        } finally {
            closeLibraryDB()
        }
    })


    //ANCHOR Tag
    ipcMain.handle('tag:queryDetails', exceptionHandleWrap((e: IpcMainInvokeEvent, libraryId: number, options: RP.QueryTagDetailsOptions): DTO.PagedResult<VO.TagDetail> => {
        rebindLibrary(libraryId)
        return DIContainer.get<TagService>(InjectType.TagService).queryTagDetails(options)
    }, generateCatchFn('tag:queryDetails'), true, closeLibraryDB))


    ipcMain.handle('tag:edit', exceptionHandleWrap((e: IpcMainInvokeEvent, libraryId: number, tagId: number, newValue: string): void => {
        rebindLibrary(libraryId)
        DIContainer.get<TagService>(InjectType.TagService).editTag(tagId, newValue)
    }, generateCatchFn('tag:edit'), true, closeLibraryDB))


    ipcMain.handle('tag:delete', exceptionHandleWrap((e: IpcMainInvokeEvent, libraryId: number, tagId: number): void => {
        rebindLibrary(libraryId)
        DIContainer.get<TagService>(InjectType.TagService).deleteTag(tagId)
    }, generateCatchFn('tag:delete'), true, closeLibraryDB))

    //ANCHOR Dirname
    ipcMain.handle('dirname:queryDetails', exceptionHandleWrap((
        e: IpcMainInvokeEvent,
        libraryId: number, options: RP.QueryDirnameDetailsOptions
    ): DTO.PagedResult<VO.DirnameDetail> => {
        rebindLibrary(libraryId)
        return DIContainer.get<DirnameService>(InjectType.DirnameService).queryDirnameDetails(options)
    }, generateCatchFn('dirname:queryDetails'), true, closeLibraryDB))


    ipcMain.handle('dirname:edit', exceptionHandleWrap((e: IpcMainInvokeEvent,
        libraryId: number, dirnameId: number, newValue: string
    ): ResponseResult<void> => {
        rebindLibrary(libraryId)
        return DIContainer.get<DirnameService>(InjectType.DirnameService).editDirname(dirnameId, newValue)
    }, generateCatchFn('dirname:edit'), true, closeLibraryDB))


    ipcMain.handle('dirname:delete', exceptionHandleWrap((e: IpcMainInvokeEvent, libraryId: number, dirnameId: number): void => {
        rebindLibrary(libraryId)
        DIContainer.get<DirnameService>(InjectType.DirnameService).deleteDirname(dirnameId)
    }, generateCatchFn('dirname:delete'), true, closeLibraryDB))

    ipcMain.handle('dirname:startsWithReplace', exceptionHandleWrap((
        e: IpcMainInvokeEvent,
        libraryId: number, target: string, replace: string
    ): ResponseResult<void> => {
        rebindLibrary(libraryId)
        return DIContainer.get<DirnameService>(InjectType.DirnameService).startsWithReplacePath(target, replace)
    }, generateCatchFn('dirname:startsWithReplace'), true, closeLibraryDB))


    //ANCHOR Series
    ipcMain.handle('series:edit', exceptionHandleWrap((e: IpcMainInvokeEvent, libraryId: number, seriesId: number, newValue: string): ResponseResult<void> => {
        rebindLibrary(libraryId)
        DIContainer.get<SeriesService>(InjectType.SeriesService).editSeries(seriesId, newValue)
        return ResponseResult.success()
    }, generateCatchFn('series:edit'), true, closeLibraryDB))


    ipcMain.handle('series:delete', exceptionHandleWrap((e: IpcMainInvokeEvent, libraryId: number, seriesId: number): ResponseResult<void> => {
        rebindLibrary(libraryId)
        DIContainer.get<SeriesService>(InjectType.SeriesService).deleteSeries(seriesId)
        return ResponseResult.success()
    }, generateCatchFn('series:delete'), true, closeLibraryDB))


    ipcMain.handle('series:removeRecord', exceptionHandleWrap((e: IpcMainInvokeEvent, libraryId: number, recordId: number, seriesId: number): void => {
        rebindLibrary(libraryId)
        DIContainer.get<SeriesService>(InjectType.SeriesService).removeRecordFromSeries(recordId, seriesId)
    }, generateCatchFn('series:removeRecord'), true, closeLibraryDB))
}


export default ipcMainLibrary