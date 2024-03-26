import { ipcMain, IpcMainInvokeEvent, dialog } from "electron"
import InjectType from "../provider/injectType"
import DIContainer, { type LibraryEnv } from "../provider/container"
import { exceptionalHandler } from '../util/common'
import LibraryDB from "../db/LibraryDB"
import Result from "../util/Result"
import AutocompleteService from "../service/AutocompleteService"
import RecordService from "../service/RecordService"
import AuthorService from "../service/AuthorService"
import TagService from "../service/TagService"
import DirnameService from "../service/DirnameService"
import SeriesService from "../service/SeriesService"
import appPaths from "../app/appPaths"


const { rebindLibrary, closeLibraryDB } = function () {
    // TODO 把LibraryEnv保存在一个Map里，用时取出来， 删除library时要删除对应的LibraryEnv
    const libEnvMap = new Map<number, Omit<LibraryEnv, 'id'>>()
    const boundLibEnv = DIContainer.get<LibraryEnv>(InjectType.LibraryEnv)
    return {
        rebindLibrary: function (libraryId: number) {
            // TODO 目前数据库有preObject的问题，暂时不开放此代码
            // if(boundLibEnv.id === libraryId) return
            // if (libEnvMap.has(libraryId)) {
            //     const obtainedLibEnv = libEnvMap.get(libraryId)!
            //     boundLibEnv.id = obtainedLibEnv.id
            //     boundLibEnv.db = obtainedLibEnv.db 
            // } else {
            //     boundLibEnv.id = libraryId
            //     boundLibEnv.db = new LibraryDB(libraryId) 

            //     libEnvMap.set(boundLibEnv.id, {
            //         id: boundLibEnv.id,
            //         db: boundLibEnv.db, 
            //     })
            // }
            boundLibEnv.id = libraryId

            const {
                genRecordImagesDirPathConstructor,
                genAuthorImagesDirPathConstructor
            } = appPaths.genLibraryImagesDirPathConstructor(libraryId)
            boundLibEnv.genRecordImagesDirPathConstructor = genRecordImagesDirPathConstructor
            boundLibEnv.genAuthorImagesDirPathConstructor = genAuthorImagesDirPathConstructor
            boundLibEnv.db = new LibraryDB(libraryId)
        },
        closeLibraryDB: function () {
            boundLibEnv.db?.close()
        }
    }
}()

function generateCatchFn(title: string, suggest?: string) {
    return function (e: any) {
        // 弹出错误提示
        dialog.showErrorBox(title, suggest ? `${suggest}\n${e.message}` : e.message)
    }
}

function ipcMainLibrary() {
    ipcMain.handle('record:autoComplete', exceptionalHandler((e: IpcMainInvokeEvent, libraryId: number, options: DTO.AcOptions): VO.AcSuggestion[] => {
        rebindLibrary(libraryId)
        return DIContainer.get<AutocompleteService>(InjectType.AutocompleteService).query(options.type, options.queryWord, options.ps)
    }, generateCatchFn('record:autoComplete'), [], closeLibraryDB))


    ipcMain.handle('record:queryRecmds', exceptionalHandler((e: IpcMainInvokeEvent, libraryId: number, options: DTO.QueryRecordRecommendationsOptions): DTO.Page<VO.RecordRecommendation> => {
        rebindLibrary(libraryId)
        return DIContainer.get<RecordService>(InjectType.RecordService).queryRecordRecmds(options)
    }, generateCatchFn('record:queryRecmds'), { total: 0, rows: [] }, closeLibraryDB))


    ipcMain.handle('record:queryDetail', exceptionalHandler((e: IpcMainInvokeEvent, libraryId: number, recordId: number): VO.RecordDetail | undefined => {
        rebindLibrary(libraryId)
        return DIContainer.get<RecordService>(InjectType.RecordService).queryRecordDetail(recordId)
    }, generateCatchFn('record:queryDetail'), void 0, closeLibraryDB))


    ipcMain.handle('record:querySimilarRecmds', exceptionalHandler((e: IpcMainInvokeEvent, libraryId: number, recordId: number, count?: number): VO.RecordRecommendation[] => {
        rebindLibrary(libraryId)
        return DIContainer.get<RecordService>(InjectType.RecordService).querySimilarRecordRecmds(recordId, count)
    }, generateCatchFn('record:querySimilarRecmds'), [], closeLibraryDB))


    ipcMain.handle('record:edit', exceptionalHandler(async (e: IpcMainInvokeEvent, libraryId: number, formData: DTO.EditRecordForm, options: DTO.EditRecordOptions): Promise<Result> => {
        rebindLibrary(libraryId)
        const recordService = DIContainer.get<RecordService>(InjectType.RecordService)

        const r: Result = options.batch
            ? await recordService.addBatchRecord(formData, options.distinct)
            : await recordService.editRecord(formData)
        return r
    }, generateCatchFn('record:edit'), new Promise((resolve) => { resolve(Result.error('runtime error')) }), closeLibraryDB))


    ipcMain.handle('record:batchProcessing', exceptionalHandler((e: IpcMainInvokeEvent, libraryId: number, type: DTO.RecordBatchProcessingType, recordIds: number[]): void => {
        rebindLibrary(libraryId)
        DIContainer.get<RecordService>(InjectType.RecordService).batchProcessing(type, recordIds)
    }, generateCatchFn('record:batchProcessing'), void 0, closeLibraryDB))


    ipcMain.handle('record:deleteByAttribute', exceptionalHandler((e: IpcMainInvokeEvent, libraryId: number, formData: DTO.DeleteRecordByAttributeForm) => {
        rebindLibrary(libraryId)
        DIContainer.get<RecordService>(InjectType.RecordService).recycleRecordByAttribute(formData)
    }, generateCatchFn('record:batchDelete'), void 0, closeLibraryDB))


    //ANCHOR Author

    ipcMain.handle('author:queryRecmds', exceptionalHandler((e: IpcMainInvokeEvent, libraryId: number, options: DTO.QueryAuthorRecommendationsOptions): DTO.Page<VO.AuthorRecommendation> => {
        rebindLibrary(libraryId)
        return DIContainer.get<AuthorService>(InjectType.AuthorService).queryAuthorRecmds(options)
    }, generateCatchFn('author:queryRecmds'), { total: 0, rows: [] }, closeLibraryDB))


    ipcMain.handle('author:queryDetail', exceptionalHandler((e: IpcMainInvokeEvent, libraryId: number, authorId: number): VO.AuthorDetail | undefined => {
        rebindLibrary(libraryId)
        return DIContainer.get<AuthorService>(InjectType.AuthorService).queryAuthorDetail(authorId)
    }, generateCatchFn('author:queryDetail'), void 0, closeLibraryDB))


    ipcMain.handle('author:edit', exceptionalHandler(async (e: IpcMainInvokeEvent, libraryId: number, formData: DTO.EditAuthorForm) => {
        rebindLibrary(libraryId)
        await DIContainer.get<AuthorService>(InjectType.AuthorService).editAuthor(formData)
        return true
    }, generateCatchFn('author:edit'), new Promise(() => { }), closeLibraryDB))


    ipcMain.handle('author:delete', exceptionalHandler((e: IpcMainInvokeEvent, libraryId: number, authorId: number): boolean => {
        rebindLibrary(libraryId)
        DIContainer.get<AuthorService>(InjectType.AuthorService).deleteAuthor(authorId)
        return true
    }, generateCatchFn('author:delete'), false, closeLibraryDB))


    //ANCHOR Tag

    ipcMain.handle('tag:queryDetails', exceptionalHandler((e: IpcMainInvokeEvent, libraryId: number, options: DTO.QueryTagDetailsOptions): DTO.Page<VO.TagDetail> => {
        rebindLibrary(libraryId)
        return DIContainer.get<TagService>(InjectType.TagService).queryTagDetails(options)
    }, generateCatchFn('tag:queryDetails'), { total: 0, rows: [] }, closeLibraryDB))


    ipcMain.handle('tag:edit', exceptionalHandler((e: IpcMainInvokeEvent, libraryId: number, tagId: number, newValue: string): void => {
        rebindLibrary(libraryId)
        DIContainer.get<TagService>(InjectType.TagService).editTag(tagId, newValue)
    }, generateCatchFn('tag:edit'), void 0, closeLibraryDB))


    ipcMain.handle('tag:delete', exceptionalHandler((e: IpcMainInvokeEvent, libraryId: number, tagId: number): void => {
        rebindLibrary(libraryId)
        DIContainer.get<TagService>(InjectType.TagService).deleteTag(tagId)
    }, generateCatchFn('tag:delete'), void 0, closeLibraryDB))


    //ANCHOR Dirname

    ipcMain.handle('dirname:queryDetails', exceptionalHandler((e: IpcMainInvokeEvent, libraryId: number, options: DTO.QueryDirnameDetailsOptions): DTO.Page<VO.DirnameDetail> | undefined => {
        rebindLibrary(libraryId)
        return DIContainer.get<DirnameService>(InjectType.DirnameService).queryDirnameDetails(options)
    }, generateCatchFn('dirname:queryDetails'), { total: 0, rows: [] }, closeLibraryDB))


    ipcMain.handle('dirname:edit', exceptionalHandler((e: IpcMainInvokeEvent, libraryId: number, dirnameId: number, newValue: string): Result => {
        rebindLibrary(libraryId)
        return DIContainer.get<DirnameService>(InjectType.DirnameService).editDirname(dirnameId, newValue)
    }, generateCatchFn('dirname:edit'), Result.error('runtime error'), closeLibraryDB))


    ipcMain.handle('dirname:delete', exceptionalHandler((e: IpcMainInvokeEvent, libraryId: number, dirnameId: number): void => {
        rebindLibrary(libraryId)
        DIContainer.get<DirnameService>(InjectType.DirnameService).deleteDirname(dirnameId)
    }, generateCatchFn('dirname:delete'), void 0, closeLibraryDB))


    ipcMain.handle('dirname:startsWithReplace', exceptionalHandler((e: IpcMainInvokeEvent, libraryId: number, target: string, replace: string): Result => {
        rebindLibrary(libraryId)
        return DIContainer.get<DirnameService>(InjectType.DirnameService).startsWithReplacePath(target, replace)
    }, generateCatchFn('dirname:startsWithReplace'), Result.error('runtime error'), closeLibraryDB))


    //ANCHOR Series

    ipcMain.handle('series:edit', exceptionalHandler((e: IpcMainInvokeEvent, libraryId: number, seriesId: number, newValue: string): Result => {
        rebindLibrary(libraryId)
        DIContainer.get<SeriesService>(InjectType.SeriesService).editSeries(seriesId, newValue)
        return Result.success()
    }, generateCatchFn('series:edit'), Result.error(), closeLibraryDB))


    ipcMain.handle('series:delete', exceptionalHandler((e: IpcMainInvokeEvent, libraryId: number, seriesId: number): Result => {
        rebindLibrary(libraryId)
        DIContainer.get<SeriesService>(InjectType.SeriesService).deleteSeries(seriesId)
        return Result.success()
    }, generateCatchFn('series:delete'), Result.error(), closeLibraryDB))


    ipcMain.handle('series:removeRecord', exceptionalHandler((e: IpcMainInvokeEvent, libraryId: number, recordId: number, seriesId: number): void => {
        rebindLibrary(libraryId)
        DIContainer.get<SeriesService>(InjectType.SeriesService).removeRecordFromSeries(recordId, seriesId)
    }, generateCatchFn('series:removeRecord'), void 0, closeLibraryDB))
}


export default ipcMainLibrary