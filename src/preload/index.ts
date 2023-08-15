import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron"

contextBridge.exposeInMainWorld('electronAPI', {
    config: (index: string, newValue: any = null) => ipcRenderer.invoke('app:config', index, newValue),

    /******************** group ********************/
    getGroups: () => ipcRenderer.invoke('group:getGroups'),
    renameGroup: (id: number, newName: string) => ipcRenderer.invoke('group:rename', id, newName),
    addGroup: (name: string) => ipcRenderer.invoke('group:add', name),
    deleteGroup: (id: number) => ipcRenderer.invoke('group:delete', id),
    sortGroup: (currId: number, tarNextId: number) => ipcRenderer.invoke('group:sort', currId, tarNextId),

    /******************** library ********************/
    getPrimaryOpenLibrary: (callback: (e: IpcRendererEvent, libraryId: number) => void) =>
        ipcRenderer.on('library:primaryOpenLibrary', callback),
    getLibraryNameByID: (id: number) => ipcRenderer.invoke('library:getLibraryNameByID', id),
    renameLibrary: (id: number, newName: string) => ipcRenderer.invoke('library:rename', id, newName),
    addLibrary: (groupId: number, name: string) => ipcRenderer.invoke('library:add', groupId, name),
    deleteLibrary: (id: number) => ipcRenderer.invoke('library:delete', id),
    sortLibrary: (currId: number, tarNextId: number, groupId: number) => ipcRenderer.invoke('library:sort', currId, tarNextId, groupId),

    /******************** record ********************/
    autoCompleteRecord: (libraryId: number, options: AcOptions) => ipcRenderer.invoke('record:autoComplete', libraryId, options),

    /******************** author ********************/
    queryAuthorDetail: (libraryId: number, authorId: number) => ipcRenderer.invoke('author:queryDetail', libraryId, authorId),
    editAuthor: (libraryId: number, formData: EditAuthorForm) => ipcRenderer.invoke('author:edit', libraryId, formData),
    deleteAuthor: (libraryId: number, authorId: number) => ipcRenderer.invoke('author:delete', libraryId, authorId),

    /******************** tag ********************/
    queryTags: (libraryId: number, options: QueryAttributesOptions) => ipcRenderer.invoke('tag:query', libraryId, options),
    deleteTag: (libraryId: number, tagId: number) => ipcRenderer.invoke('tag:delete', libraryId, tagId),
    editTag: (libraryId: number, tagId: number, newValue: string) => ipcRenderer.invoke('tag:edit', libraryId, tagId, newValue),

    /******************** dirname ********************/
    queryDirnames: (libraryId: number, options: QueryAttributesOptions) => ipcRenderer.invoke('dirname:query', libraryId, options),
    deleteDirname: (libraryId: number, dirnameId: number) => ipcRenderer.invoke('dirname:delete', libraryId, dirnameId),
    editDirname: (libraryId: number, dirnameId: number, newValue: string) => ipcRenderer.invoke('dirname:edit', libraryId, dirnameId, newValue),
    startsWithReplaceDirname: (libraryId: number, target: string, replace: string) => ipcRenderer.invoke('dirname:startsWithReplace', libraryId, target, replace),

    /******************** dialog ********************/
    openDialog: (type: OpenDialogType, multiSelect: boolean) => ipcRenderer.invoke('dialog:open', type, multiSelect),

    /******************** system ********************/
    openExternal: (url: string) => ipcRenderer.invoke('system:openExternal', url),
    openInExplorer: (fullPath: string) => ipcRenderer.invoke('system:openInExplorer', fullPath),
    openFile: (fullPath: string) => ipcRenderer.invoke('system:openFile', fullPath),
    writeClipboard: (text: string) => ipcRenderer.invoke('system:writeClipboard', text),

    /******************** window ********************/
    windowRelaunch: () => ipcRenderer.invoke('window:relaunch'),
    createMainWindow: (libraryId: number) => ipcRenderer.invoke('window:createMainWindow', libraryId),
    createItemWinodw: (libraryId: number, itemId: number) => ipcRenderer.invoke('window:createItemWindow', libraryId, itemId),
    windowMinmize: () => ipcRenderer.invoke('window:minmize'),
    windowMaxmize: () => ipcRenderer.invoke('window:maxmize'),
    windowIsMaxmize: (callback: (e: IpcRendererEvent, value: boolean) => void) => ipcRenderer.on('window:isMaxmize', callback),
    windowClose: () => ipcRenderer.invoke('window:close')
})

contextBridge.exposeInMainWorld('versionAPI', {
    appVersion: () => ipcRenderer.invoke('app:version'),
    electronVersion: process.versions.electron,
    chromeVersion: process.versions.chrome,
    nodeVersion: process.versions.node,
})