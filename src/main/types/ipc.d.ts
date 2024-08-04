declare interface IDataAPI {
    getPrimaryOpenLibrary: (
        callback: (e: IpcRendererEvent, libraryId: number) => void
    ) => void,

    // ANCHOR Group
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

    // ANCHOR Library
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

    autoCompleteRecord: (
        libraryId: number,
        options: RP.AutoCompleteOptions
    ) => Promise<VO.AutoCompleteSuggestion>

    //ANCHOR Record
    queryRecordRecmds: (
        libraryId: number,
        options: RP.QueryRecordRecommendationsOptions
    ) => Promise<DTO.PagedResult<VO.RecordRecommendation>>

    queryRecordDetail: (
        libraryId: number,
        recordId: number,
    ) => Promise<VO.RecordDetail | undefined>

    querySimilarRecordRecmds: (
        libraryId: number,
        recordId: number,
        count?: number
    ) => Promise<VO.RecordRecommendation[]>

    editRecord: (
        libraryId: number,
        formData: RP.EditRecordFormData,
    ) => Promise<DTO.ResponseResult<void>>

    addRecordFromMetadata: (
        libraryId: number,
        param: RP.AddRecordFromMetadataParam
    ) => Promise<DTO.ResponseResult<void>>

    batchProcessingRecord: (
        libraryId: number,
        type: RP.RecordBatchProcessingType,
        recordIds?: number[]
    ) => Promise<void>

    deleteRecordByAttribute: (
        libraryId: number,
        formData: RP.DeleteRecordByAttributeFormData,
    ) => Promise<void>

    //ANCHOR Author

    queryAuthorDetail: (
        libraryId: number | bigint,
        authorId: number | bigint
    ) => Promise<VO.AuthorDetail | undefined>

    queryAuthorRecmds: (
        libraryId: number,
        options: RP.QueryAuthorRecommendationsOptions
    ) => Promise<DTO.PagedResult<VO.AuthorRecommendation>>

    /**
     * 编辑作者
     */
    editAuthor: (
        libraryId: number,
        formData: RP.EditAuthorFormData
    ) => Promise<boolean>

    deleteAuthor: (
        libraryId: number,
        authorId: number
    ) => Promise<boolean>

    //ANCHOR Tag

    queryTagDetails: (
        libraryId: number,
        options: RP.QueryTagDetailsOptions
    ) => Promise<DTO.PagedResult<VO.TagDetail>>

    deleteTag: (
        libraryId: number,
        tagId: number
    ) => Promise<void>

    editTag: (
        libraryId: number,
        tagId: number,
        newValue: string,
    ) => Promise<void>

    //ANCHOR Dirname

    queryDirnameDetails: (
        libraryId: number,
        options: RP.QueryDirnameDetailsOptions
    ) => Promise<DTO.PagedResult<VO.DirnameDetail>>

    deleteDirname: (
        libraryId: number,
        dirnameId: number
    ) => Promise<void>

    editDirname: (
        libraryId: number,
        dirnameId: number,
        newValue: string
    ) => Promise<DTO.ResponseResult<void>>

    startsWithReplaceDirname: (
        libraryId: number,
        target: string,
        replace: string
    ) => Promise<DTO.ResponseResult<void>>

    // ANCHOR Series

    editSeries: (
        libraryId: number,
        seriesId: number,
        newValue: string
    ) => Promise<DTO.ResponseResult<void>>

    deleteSeries: (
        libraryId: number,
        seriesId: number
    ) => Promise<DTO.ResponseResult<void>>

    removeRecordFromSeries: (
        libraryId: number,
        recordId: number,
        seriesId: number
    ) => Promise<void>

    // ANCHOR Role
    getRoles: (
        libraryId: number,
    ) => Promise<DTO.ResponseResult<VO.Role[]>>

    createRole: (
        libraryId: number,
        roleName: string
    ) => Promise<DTO.ResponseResult<VO.Role>>,

    editRole: (
        libraryId: number,
        role: VO.Role,
    ) => Promise<void>,

    deleteRole: (
        libraryId: number,
        roleId: number,
    ) => Promise<void>,
}

export interface IElectronAPI {
    /******************** app ********************/
    config: (
        type: 'set' | 'get' | 'all' | 'reset',
        key?: keyof Config,
        value?: string
    ) => Promise<string | Config | void>

    relaunch: () => Promise<void>

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