import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron"

contextBridge.exposeInMainWorld('dataAPI', {
    getPrimaryOpenLibrary: (
        callback: (e: IpcRendererEvent, libraryId: number) => void
    ) => ipcRenderer.on('library:primaryOpenLibrary', callback),

    // ANCHOR Group
    getGroups: (
    ) => ipcRenderer.invoke('group:getGroups'),

    renameGroup: (
        id: number, name: string
    ) => ipcRenderer.invoke('group:rename', id, name),

    createGroup: (
        name: string
    ) => ipcRenderer.invoke('group:create', name),

    deleteGroup: (
        id: number
    ) => ipcRenderer.invoke('group:delete', id),

    changeGroupOrder: (
        currId: number,
        tarNextId: number
    ) => ipcRenderer.invoke('group:changeOrder', currId, tarNextId),

    // ANCHOR Library
    queryLibraryDetail: (
        id: number,
    ) => ipcRenderer.invoke('library:queryDetail', id),

    renameLibrary: (
        id: number,
        name: string
    ) => ipcRenderer.invoke('library:rename', id, name),

    createLibrary: (
        groupId: number,
        name: string
    ) => ipcRenderer.invoke('library:create', groupId, name),

    deleteLibrary: (
        id: number
    ) => ipcRenderer.invoke('library:delete', id),

    changeLibraryOrder: (
        currId: number,
        tarNextId: number,
        moveToGroupId: number
    ) => ipcRenderer.invoke('library:changeOrder', currId, tarNextId, moveToGroupId),

    editLibraryExtra: (
        data: RP.LibraryExtraFormData
    ) => ipcRenderer.invoke('library:editExtra', data),

    exportLibrary: (
        libraryId: number,
        exportDir: string
    ) => ipcRenderer.invoke('library:export', libraryId, exportDir),

    importLibrary: (
        groupId: number,
        importFiles: string[]
    ) => ipcRenderer.invoke('library:import', groupId, importFiles),

    // ANCHOR Record
    autoCompleteRecord: (
        libraryId: number,
        options: RP.AutoCompleteOptions
    ) => ipcRenderer.invoke('record:autoComplete', libraryId, options),

    queryRecordRecmds: (
        libraryId: number,
        options: RP.QueryRecordRecommendationsOptions
    ) => ipcRenderer.invoke('record:queryRecmds', libraryId, options),

    queryRecordDetail: (
        libraryId: number,
        recordId: number
    ) => ipcRenderer.invoke('record:queryDetail', libraryId, recordId),

    querySimilarRecordRecmds: (
        libraryId: number,
        recordId: number,
        count?: number,
    ) => ipcRenderer.invoke('record:querySimilarRecmds', libraryId, recordId, count),

    editRecord: (
        libraryId: number,
        formData: RP.EditRecordFormData,
    ) => ipcRenderer.invoke('record:edit', libraryId, formData),

    addRecordFromMetadata: (
        libraryId: number,
        param: RP.AddRecordFromMetadataParam
    ) => ipcRenderer.invoke('record:addRecordFromMetadata', libraryId, param),

    batchProcessingRecord: (
        libraryId: number,
        type: RP.RecordBatchProcessingType,
        recordIds?: number[]
    ) => ipcRenderer.invoke('record:batchProcessing', libraryId, type, recordIds),

    deleteRecordByAttribute: (
        libraryId: number,
        formData: RP.DeleteRecordByAttributeFormData
    ) => ipcRenderer.invoke('record:deleteByAttribute', libraryId, formData),

    /******************** author ********************/
    queryAuthorDetail: (
        libraryId: number,
        authorId: number
    ) => ipcRenderer.invoke('author:queryDetail', libraryId, authorId),

    queryAuthorRecmds: (
        libraryId: number,
        options: RP.QueryAuthorRecommendationsOptions
    ) => ipcRenderer.invoke('author:queryRecmds', libraryId, options),

    editAuthor: (
        libraryId: number,
        formData: RP.EditAuthorFormData
    ) => ipcRenderer.invoke('author:edit', libraryId, formData),

    deleteAuthor: (
        libraryId: number,
        authorId: number
    ) => ipcRenderer.invoke('author:delete', libraryId, authorId),

    // ANCHOR Tag

    queryTagDetails: (
        libraryId: number,
        options: RP.QueryTagDetailsOptions
    ) => ipcRenderer.invoke('tag:queryDetails', libraryId, options),

    deleteTag: (
        libraryId: number,
        tagId: number
    ) => ipcRenderer.invoke('tag:delete', libraryId, tagId),

    editTag: (
        libraryId: number,
        tagId: number,
        newValue: string
    ) => ipcRenderer.invoke('tag:edit', libraryId, tagId, newValue),

    // ANCHOR Dirname

    queryDirnameDetails: (
        libraryId: number,
        options: RP.QueryDirnameDetailsOptions
    ) => ipcRenderer.invoke('dirname:queryDetails', libraryId, options),

    deleteDirname: (
        libraryId: number,
        dirnameId: number
    ) => ipcRenderer.invoke('dirname:delete', libraryId, dirnameId),

    editDirname: (
        libraryId: number,
        dirnameId: number,
        newValue: string
    ) => ipcRenderer.invoke('dirname:edit', libraryId, dirnameId, newValue),

    startsWithReplaceDirname: (
        libraryId: number,
        target: string,
        replace: string
    ) => ipcRenderer.invoke('dirname:startsWithReplace', libraryId, target, replace),

    // ANCHOR Series

    editSeries: (
        libraryId: number,
        seriesId: number,
        newValue: string
    ) => ipcRenderer.invoke('series:edit', libraryId, seriesId, newValue),

    deleteSeries: (
        libraryId: number,
        seriesId: number
    ) => ipcRenderer.invoke('series:delete', libraryId, seriesId),

    removeRecordFromSeries: (
        libraryId: number,
        recordId: number,
        seriesId: number
    ) => ipcRenderer.invoke('series:removeRecord', libraryId, recordId, seriesId),

    // ANCHOR Role
    getRoles: (
        libraryId: number,
    ) => ipcRenderer.invoke('role:get', libraryId),

    createRole: (
        libraryId: number,
        roleName: string
    ) => ipcRenderer.invoke('role:create', libraryId, roleName),

    editRole: (
        libraryId: number,
        role: VO.Role,
    ) => ipcRenderer.invoke('role:edit', libraryId, role),

    deleteRole: (
        libraryId: number,
        roleId: number,
    ) => ipcRenderer.invoke('role:delete', libraryId, roleId),
})


contextBridge.exposeInMainWorld('electronAPI', {
    /******************** app ********************/
    config: (
        type: 'set' | 'get' | 'all' | 'reset',
        key?: keyof Config,
        value?: string
    ) => ipcRenderer.invoke('app:config', type, key, value),

    relaunch: () => ipcRenderer.invoke('app:relaunch'),

    // ANCHOR Dialog
    openDialog: (
        type: OpenDialogType,
        multiSelect: boolean,
        title?: string
    ) => ipcRenderer.invoke('dialog:open', type, multiSelect, title),

    // ANCHOR system

    openInBrowser: (
        hyperlink: string
    ) => ipcRenderer.invoke('system:openInBrowser', hyperlink),

    openInExplorer: (
        path: string,
        method?: 'showItemInFolder' | 'openPath'
    ) => ipcRenderer.invoke('system:openInExplorer', path, method),

    openFile: (
        path: string
    ) => ipcRenderer.invoke('system:openFile', path),

    writeClipboard: (
        text: string
    ) => ipcRenderer.invoke('system:writeClipboard', text),

    readdir: (
        dirPath: string
    ) => ipcRenderer.invoke('system:readdir', dirPath),

    // ANCHOR window

    createMainWindow: (
        libraryId: number
    ) => ipcRenderer.invoke('window:createMainWindow', libraryId),

    createRecordWindow: (
        libraryId: number,
        recordId: number
    ) => ipcRenderer.invoke('window:createRecordWindow', libraryId, recordId),

    getRecordWindowParams: (
        callback: (e: IpcRendererEvent, libraryId: number, recordId: number) => void
    ) => ipcRenderer.on('window:getRecordWindowParams', callback),

    windowMinmize: () => ipcRenderer.invoke('window:minmize'),

    windowMaxmize: () => ipcRenderer.invoke('window:maxmize'),

    windowIsMaxmize: (
        callback: (e: IpcRendererEvent, value: boolean) => void
    ) => ipcRenderer.on('window:isMaxmize', callback),

    windowClose: () => ipcRenderer.invoke('window:close')
})

contextBridge.exposeInMainWorld('versionAPI', {
    app: () => ipcRenderer.invoke('app:version'),
    electron: process.versions.electron,
    chrome: process.versions.chrome,
    node: process.versions.node,
})

contextBridge.exposeInMainWorld('systemAPI', {
    pathSep: () => ipcRenderer.invoke('system:pathSep')
})