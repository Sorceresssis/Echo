import { ipcMain, IpcMainInvokeEvent, dialog } from "electron"
import DIContainer from '../DI/DIContainer'
import DI_TYPES, { DILibrary } from "../DI/DITypes"
import { exceptionalHandler } from '../util/common'
import LibraryDB from "../db/LibraryDB"
import Result from "../util/Result"
import AutocompleteService from "../service/AutocompleteService"
import RecordService from "../service/RecordService"
import AuthorService from "../service/AuthorService"
import TagService from "../service/TagService"
import DirnameService from "../service/DirnameService"
import SeriesService from "../service/SeriesService"


const { rebindLibrary, closeLibraryDB } = function () {
    const library = DIContainer.get<DILibrary>(DI_TYPES.Library)
    return {
        rebindLibrary: function (libraryId: number) {
            library.id = libraryId
            library.dbConnection = new LibraryDB(libraryId)
        },
        closeLibraryDB: function () {
            library.dbConnection?.close()
        }
    }
}()

function generateCatchFn(title: string, suggest?: string) {
    return function (e: any) {
        // 修复数据库
        DIContainer.get<DILibrary>(DI_TYPES.Library).dbConnection.checkAndRepair()
        // 弹出错误提示
        dialog.showErrorBox(title, suggest ? `${suggest}\n${e.message}` : e.message)
    }
}

function ipcMainLibrary() {
    ipcMain.handle('record:autoComplete', exceptionalHandler((e: IpcMainInvokeEvent, libraryId: number, options: DTO.AcOptions): VO.AcSuggestion[] => {
        rebindLibrary(libraryId)
        return DIContainer.get<AutocompleteService>(DI_TYPES.AutocompleteService).query(options.type, options.queryWord, options.ps)
    }, generateCatchFn('record:autoComplete'), [], closeLibraryDB))


    ipcMain.handle('record:queryRecmds', exceptionalHandler((e: IpcMainInvokeEvent, libraryId: number, options: DTO.QueryRecordRecommendationsOptions): DTO.Page<VO.RecordRecommendation> => {
        rebindLibrary(libraryId)
        return DIContainer.get<RecordService>(DI_TYPES.RecordService).queryRecordRecmds(options)
    }, generateCatchFn('record:queryRecmds'), { total: 0, rows: [] }, closeLibraryDB))


    ipcMain.handle('record:queryDetail', exceptionalHandler((e: IpcMainInvokeEvent, libraryId: number, recordId: number): VO.RecordDetail | undefined => {
        rebindLibrary(libraryId)
        return DIContainer.get<RecordService>(DI_TYPES.RecordService).queryRecordDetail(recordId)
    }, generateCatchFn('record:queryDetail'), void 0, closeLibraryDB))


    ipcMain.handle('record:querySimilarRecmds', exceptionalHandler((e: IpcMainInvokeEvent, libraryId: number, recordId: number, count?: number): VO.RecordRecommendation[] => {
        rebindLibrary(libraryId)
        return DIContainer.get<RecordService>(DI_TYPES.RecordService).querySimilarRecordRecmds(recordId, count)
    }, generateCatchFn('record:querySimilarRecmds'), [], closeLibraryDB))


    ipcMain.handle('record:edit', exceptionalHandler((e: IpcMainInvokeEvent, libraryId: number, formData: DTO.EditRecordForm, options: DTO.EditRecordOptions): Result => {
        rebindLibrary(libraryId)
        const recordService = DIContainer.get<RecordService>(DI_TYPES.RecordService)
        return options.batch
            ? recordService.addBatchRecord(formData, options.distinct)
            : recordService.editRecord(formData)
    }, generateCatchFn('record:edit'), Result.error('runtime error'), closeLibraryDB))


    ipcMain.handle('record:batchProcessing', exceptionalHandler((e: IpcMainInvokeEvent, libraryId: number, type: DTO.RecordBatchProcessingType, recordIds: number[]): void => {
        rebindLibrary(libraryId)
        DIContainer.get<RecordService>(DI_TYPES.RecordService).batchProcessing(type, recordIds)
    }, generateCatchFn('record:batchProcessing'), void 0, closeLibraryDB))


    ipcMain.handle('record:deleteByAttribute', exceptionalHandler((e: IpcMainInvokeEvent, libraryId: number, formData: DTO.DeleteRecordByAttributeForm) => {
        rebindLibrary(libraryId)
        DIContainer.get<RecordService>(DI_TYPES.RecordService).recycleRecordByAttribute(formData)
    }, generateCatchFn('record:batchDelete'), void 0, closeLibraryDB))


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


    ipcMain.handle('tag:edit', exceptionalHandler((e: IpcMainInvokeEvent, libraryId: number, tagId: number, newValue: string): void => {
        rebindLibrary(libraryId)
        DIContainer.get<TagService>(DI_TYPES.TagService).editTag(tagId, newValue)
    }, generateCatchFn('tag:edit'), void 0, closeLibraryDB))


    ipcMain.handle('tag:delete', exceptionalHandler((e: IpcMainInvokeEvent, libraryId: number, tagId: number): void => {
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
    }, generateCatchFn('dirname:edit'), Result.error('runtime error'), closeLibraryDB))


    ipcMain.handle('dirname:delete', exceptionalHandler((e: IpcMainInvokeEvent, libraryId: number, dirnameId: number): void => {
        rebindLibrary(libraryId)
        DIContainer.get<DirnameService>(DI_TYPES.DirnameService).deleteDirname(dirnameId)
    }, generateCatchFn('dirname:delete'), void 0, closeLibraryDB))


    ipcMain.handle('dirname:startsWithReplace', exceptionalHandler((e: IpcMainInvokeEvent, libraryId: number, target: string, replace: string): Result => {
        rebindLibrary(libraryId)
        return DIContainer.get<DirnameService>(DI_TYPES.DirnameService).startsWithReplacePath(target, replace)
    }, generateCatchFn('dirname:startsWithReplace'), Result.error('runtime error'), closeLibraryDB))


    //ANCHOR Series

    ipcMain.handle('series:edit', exceptionalHandler((e: IpcMainInvokeEvent, libraryId: number, seriesId: number, newValue: string): Result => {
        rebindLibrary(libraryId)
        DIContainer.get<SeriesService>(DI_TYPES.SeriesService).editSeries(seriesId, newValue)
        return Result.success()
    }, generateCatchFn('series:edit'), Result.error(), closeLibraryDB))


    ipcMain.handle('series:delete', exceptionalHandler((e: IpcMainInvokeEvent, libraryId: number, seriesId: number): Result => {
        rebindLibrary(libraryId)
        DIContainer.get<SeriesService>(DI_TYPES.SeriesService).deleteSeries(seriesId)
        return Result.success()
    }, generateCatchFn('series:delete'), Result.error(), closeLibraryDB))


    ipcMain.handle('series:removeRecord', exceptionalHandler((e: IpcMainInvokeEvent, libraryId: number, recordId: number, seriesId: number): void => {
        rebindLibrary(libraryId)
        DIContainer.get<SeriesService>(DI_TYPES.SeriesService).removeRecordFromSeries(recordId, seriesId)
    }, generateCatchFn('series:removeRecord'), void 0, closeLibraryDB))
}


export default ipcMainLibrary