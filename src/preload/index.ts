import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron"

contextBridge.exposeInMainWorld('electronAPI', {
    /******************** app ********************/
    config: (
        type: 'set' | 'get' | 'all' | 'reset',
        key?: keyof Config,
        value?: string
    ) => ipcRenderer.invoke('app:config', type, key, value),

    relaunch: () => ipcRenderer.invoke('app:relaunch'),

    // ANCHOR group

    getGroups: () => ipcRenderer.invoke('group:getGroups'),

    renameGroup: (
        id: number,
        name: string
    ) => ipcRenderer.invoke('group:rename', id, name),

    addGroup: (
        name: string
    ) => ipcRenderer.invoke('group:add', name),

    deleteGroup: (
        id: number
    ) => ipcRenderer.invoke('group:delete', id),

    sortGroup: (
        currId: number,
        tarNextId: number
    ) => ipcRenderer.invoke('group:sort', currId, tarNextId),


    // ANCHOR library

    getPrimaryOpenLibrary: (
        callback: (e: IpcRendererEvent, libraryId: number) => void
    ) => ipcRenderer.on('library:primaryOpenLibrary', callback),

    queryLibraryDetail: (
        id: number,
    ) => ipcRenderer.invoke('library:queryDetail', id),

    renameLibrary: (
        id: number,
        name: string
    ) => ipcRenderer.invoke('library:rename', id, name),

    addLibrary: (
        groupId: number,
        name: string
    ) => ipcRenderer.invoke('library:add', groupId, name),

    deleteLibrary: (
        id: number
    ) => ipcRenderer.invoke('library:delete', id),

    sortLibrary: (
        currId: number,
        tarNextId: number,
        moveToGroupId: number
    ) => ipcRenderer.invoke('library:sort', currId, tarNextId, moveToGroupId),

    editLibraryExtra: (
        data: DTO.LibraryExtraForm
    ) => ipcRenderer.invoke('library:editExtra', data),

    exportLibrary: (
        libraryId: number,
        exportDir: string
    ) => ipcRenderer.invoke('library:export', libraryId, exportDir),

    importLibrary: (
        groupId: number,
        importFiles: string[]
    ) => ipcRenderer.invoke('library:import', groupId, importFiles),


    // ANCHOR record

    autoCompleteRecord: (
        libraryId: number,
        options: DTO.AcOptions
    ) => ipcRenderer.invoke('record:autoComplete', libraryId, options),

    queryRecordRecmds: (
        libraryId: number,
        options: DTO.QueryRecordRecommendationsOptions
    ) => ipcRenderer.invoke('record:queryRecmds', libraryId, options),

    deleteRecordByAttribute: (
        libraryId: number,
        formData: DTO.DeleteRecordByAttributeForm
    ) => ipcRenderer.invoke('record:deleteByAttribute', libraryId, formData),

    queryRecordDetail: (
        libraryId: number,
        recordId: number
    ) => ipcRenderer.invoke('record:queryDetail', libraryId, recordId),

    editRecord: (
        libraryId: number,
        formData: DTO.EditRecordForm,
        options: DTO.EditRecordOptions
    ) => ipcRenderer.invoke('record:edit', libraryId, formData, options),

    batchProcessingRecord: (
        libraryId: number,
        type: DTO.RecordBatchProcessingType,
        recordIds?: number[]
    ) => ipcRenderer.invoke('record:batchProcessing', libraryId, type, recordIds),


    /******************** author ********************/
    queryAuthorDetail: (
        libraryId: number,
        authorId: number
    ) => ipcRenderer.invoke('author:queryDetail', libraryId, authorId),

    queryAuthorRecmds: (
        libraryId: number,
        options: DTO.QueryAuthorRecommendationsOptions
    ) => ipcRenderer.invoke('author:queryRecmds', libraryId, options),

    editAuthor: (
        libraryId: number,
        formData: DTO.EditAuthorForm
    ) => ipcRenderer.invoke('author:edit', libraryId, formData),

    deleteAuthor: (
        libraryId: number,
        authorId: number
    ) => ipcRenderer.invoke('author:delete', libraryId, authorId),



    /******************** tag ********************/

    queryTagDetails: (
        libraryId: number,
        options: DTO.QueryTagDetailsOptions
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



    /******************** dirname ********************/

    queryDirnameDetails: (
        libraryId: number,
        options: DTO.QueryDirnameDetailsOptions
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



    /******************** dialog ********************/

    openDialog: (
        type: OpenDialogType,
        multiSelect: boolean,
        title?: string
    ) => ipcRenderer.invoke('dialog:open', type, multiSelect, title),



    /******************** system ********************/

    openInBrowser: (
        hyperlink: string
    ) => ipcRenderer.invoke('system:openInBrowser', hyperlink),

    openInExplorer: (
        path: string
    ) => ipcRenderer.invoke('system:openInExplorer', path),

    openFile: (
        path: string
    ) => ipcRenderer.invoke('system:openFile', path),

    writeClipboard: (
        text: string
    ) => ipcRenderer.invoke('system:writeClipboard', text),

    readdir: (
        dirPath: string
    ) => ipcRenderer.invoke('system:readdir', dirPath),


    /******************** window ********************/

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