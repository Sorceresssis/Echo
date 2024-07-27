interface Result<T> {
    code: number
    msg?: string
    data: T
}


declare interface IDataAPI {
    getPrimaryOpenLibrary: (
        callback: (e: IpcRendererEvent, libraryId: number) => void
    ) => void,

    // ANCHOR group
    getGroups: (
    ) => Promise<VO.Group[]>

    renameGroup: (
        id: number,
        name: string
    ) => Promise<boolean>

    createGroup: (
        name: string
    ) => Promise<void>

    deleteGroup: (
        id: number
    ) => Promise<void>

    changeGroupOrder: (
        currId: number,
        tarNextId: number
    ) => Promise<void>

    // ANCHOR library
    queryLibraryDetail: (
        id: number,
    ) => Promise<VO.LibraryDetail | undefined>

    renameLibrary: (
        id: number,
        name: string
    ) => Promise<boolean>

    createLibrary: (
        groupId: number,
        name: string
    ) => Promise<void>

    deleteLibrary: (
        id: number
    ) => Promise<void>

    changeLibraryOrder: (
        currId: number,
        tarNextId: number,
        moveToGroupId: number
    ) => Promise<void>

    editLibraryExtra: (
        data: RP.LibraryExtraFormData
    ) => Promise<boolean>

    exportLibrary: (
        libraryId: number,
        exportDir: string
    ) => Promise<void>,

    importLibrary: (
        groupId: number,
        importFiles: string[]
    ) => Promise<void>,






    getRoles: (
        libraryId: number,
    ) => Promise<Result<Entity.Role[]>>

}

export interface IElectronAPI {
    /******************** app ********************/
    config: (
        type: 'set' | 'get' | 'all' | 'reset',
        key?: keyof Config,
        value?: string
    ) => Promise<string | Config | void>


    relaunch: () => Promise<void>


    //ANCHOR Record

    /** 
     * 自动补齐
     */
    autoCompleteRecord: (
        libraryId: number,
        options: DTO.AcOptions
    ) => Promise<VO.AcSuggestion>

    queryRecordRecmds: (
        libraryId: number,
        options: DTO.QueryRecordRecommendationsOptions
    ) => Promise<DTO.Page<VO.RecordRecommendation>>

    querySimilarRecordRecmds: (
        libraryId: number,
        recordId: number,
        count?: number
    ) => Promise<VO.RecordRecommendation[]>

    deleteRecordByAttribute: (
        libraryId: number,
        formData: DTO.DeleteRecordByAttributeForm,
    ) => Promise<void>

    /**
     * 更具recordId获取record的所有信息
     */
    queryRecordDetail: (
        libraryId: number,
        recordId: number,
    ) => Promise<VO.RecordDetail>

    /**
     * 编辑和添加record 
     */
    editRecord: (
        libraryId: number,
        formData: DTO.EditRecordForm,
    ) => Promise<Result>

    addRecordFromMetadata: (
        libraryId: number,
        param: RP.AddRecordFromMetadataParam
    ) => Promise<Result<void>>

    batchProcessingRecord: (
        libraryId: number,
        type: DTO.RecordBatchProcessingType,
        recordIds?: number[]
    ) => Promise<void>

    //ANCHOR Author

    queryAuthorDetail: (
        libraryId: number | bigint,
        authorId: number | bigint
    ) => Promise<VO.AuthorDetail | undefined>

    queryAuthorRecmds: (
        libraryId: number,
        options: DTO.QueryAuthorRecommendationsOptions
    ) => Promise<DTO.Page<VO.AuthorRecommendation>>

    /**
     * 编辑作者
     */
    editAuthor: (
        libraryId: number,
        formData: DTO.EditAuthorForm
    ) => Promise<boolean>

    deleteAuthor: (
        libraryId: number,
        authorId: number
    ) => Promise<boolean>,

    //ANCHOR Tag

    queryTagDetails: (
        libraryId: number,
        options: DTO.QueryTagDetailsOptions
    ) => Promise<DTO.Page<VO.TagDetail>>

    deleteTag: (
        libraryId: number,
        tagId: number
    ) => Promise<boolean>

    editTag: (
        libraryId: number,
        tagId: number,
        newValue: string
    ) => Promise<boolean>

    //ANCHOR Dirname

    queryDirnameDetails: (
        libraryId: number,
        options: DTO.QueryDirnameDetailsOptions
    ) => Promise<DTO.Page<VO.DirnameDetail>>

    deleteDirname: (
        libraryId: number,
        dirnameId: number
    ) => Promise<boolean>

    editDirname: (
        libraryId: number,
        dirnameId: number,
        newValue: string
    ) => Promise<Result>

    startsWithReplaceDirname: (
        libraryId: number,
        target: string,
        replace: string
    ) => Promise<Result>,

    // ANCHOR Series

    editSeries: (
        libraryId: number,
        seriesId: number,
        newValue: string
    ) => Promise<Result>,

    deleteSeries: (
        libraryId: number,
        seriesId: number
    ) => Promise<Result>,

    removeRecordFromSeries: (
        libraryId: number,
        recordId: number,
        seriesId: number
    ) => Promise<void>,

    // ANCHOR dialog 

    openDialog: (
        type: OpenDialogType,
        multiSelect: boolean,
        title?: string
    ) => Promise<string[]>

    // ANCHOR system

    openInBrowser: (
        hyperlink: string
    ) => Promise<void>

    openInExplorer: (
        path: string,
        method?: 'showItemInFolder' | 'openPath'
    ) => Promise<Result>

    openFile: (
        path: string
    ) => Promise<Result>

    writeClipboard: (
        text: string
    ) => Promise<void>

    readdir: (
        dirPath: string
    ) => Promise<Result>,


    /******************** window ********************/

    createMainWindow: (
        libraryId: number
    ) => Promise<boolean>

    createRecordWindow: (
        libraryId: number,
        recordId: number
    ) => Promise<void>

    getRecordWindowParams: (
        callback: (e: IpcRendererEvent, libraryId: number, recordId: number) => void
    ) => void

    windowMinmize: () => Promise<void>

    windowMaxmize: () => Promise<void>

    windowIsMaxmize: (
        allback: (e: IpcRendererEvent, value: any) => void
    ) => Promise<any>

    windowClose: () => Promise<void>
}

export interface ISystemAPI {
    pathSep: () => Promise<'\\' | '/'>
}

export interface IVersionAPI {
    app: () => Promise<string>
    electron: string
    chrome: string
    node: string
}

declare global {
    interface Window {
        dataAPI: IDataAPI
        electronAPI: IElectronAPI
        versionAPI: IVersionAPI
        systemAPI: ISystemAPI
    }
}