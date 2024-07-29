import { ipcMain, IpcMainInvokeEvent, dialog } from "electron"
import appConfig from "../app/config"
import appPaths from "../app/appPaths"
import InjectType from "../provider/injectType"
import DIContainer, { type LibraryEnv } from "../provider/container"
import { exceptionalHandler } from '../utils/common'
import LibraryDB from "../db/LibraryDB"
import Result from "../utils/Result"
import type RoleDao from "../dao/RoleDao"
import type AutocompleteService from "../service/AutocompleteService"
import type RecordService from "../service/RecordService"
import type AuthorService from "../service/AuthorService"
import type TagService from "../service/TagService"
import type DirnameService from "../service/DirnameService"
import type SeriesService from "../service/SeriesService"
import { type PagedResult } from "../pojo/page"


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
    return function (e: any) {
        // 弹出错误提示
        dialog.showErrorBox(title, suggest ? `${suggest}\n${e.message}` : e.message)
        appConfig.reset('dataPath')
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


    ipcMain.handle('record:edit', exceptionalHandler(async (e: IpcMainInvokeEvent, libraryId: number, formData: DTO.EditRecordForm): Promise<Result> => {
        rebindLibrary(libraryId)
        const recordService = DIContainer.get<RecordService>(InjectType.RecordService)
        return await recordService.editRecord(formData)
    }, generateCatchFn('record:edit'), new Promise((resolve) => { resolve(Result.error('runtime error')) }), closeLibraryDB))

    ipcMain.handle('record:addRecordFromMetadata', async (
        e: IpcMainInvokeEvent,
        libraryId: number,
        param: RP.AddRecordFromMetadataParam
    ): Promise<Result> => {
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
            return Result.success()
        } catch (e: any) {
            return Result.error(e.message)
        } finally {
            closeLibraryDB()
        }
    })

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
    }, generateCatchFn('author:edit'), new Promise((resolve => resolve(false))), closeLibraryDB))


    ipcMain.handle('author:delete', exceptionalHandler((e: IpcMainInvokeEvent, libraryId: number, authorId: number): boolean => {
        rebindLibrary(libraryId)
        DIContainer.get<AuthorService>(InjectType.AuthorService).deleteAuthor(authorId)
        return true
    }, generateCatchFn('author:delete'), false, closeLibraryDB))


    ipcMain.handle('role:get', (e: IpcMainInvokeEvent, libraryId: number): Result => {
        try {
            rebindLibrary(libraryId)
            const data = DIContainer.get<RoleDao>(InjectType.RoleDao).query()
            return Result.success(data)
        } catch (e: any) {
            return Result.error()
        } finally {
            closeLibraryDB()
        }
    })


    //ANCHOR Tag

    ipcMain.handle('tag:queryDetails', exceptionalHandler((e: IpcMainInvokeEvent, libraryId: number, options: DTO.QueryTagDetailsOptions): PagedResult<VO.TagDetail> => {
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