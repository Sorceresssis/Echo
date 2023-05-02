import { contextBridge, ipcRenderer, app } from "electron"

contextBridge.exposeInMainWorld('electronAPI', {
    /******************** 开始准备 ********************/
    startOpenDB: (callback: (e: any, value: library) => void) => ipcRenderer.on('app:startOpenLibrary', callback),
    config: (index: string, newValue: any = null) => ipcRenderer.invoke('app:config', index, newValue),

    /******************** group ********************/
    getGroups: () => ipcRenderer.invoke('group:getGroups'),
    addGroup: (groupName: string) => ipcRenderer.invoke('group:add', groupName),
    updataOrderGroup: (groupsId: number[]) => ipcRenderer.invoke('group:updataOrder', groupsId),
    renameGroup: (groupID: number, rename: string) => ipcRenderer.invoke('group:rename', groupID, rename),
    deleteGroup: (groupID: number) => ipcRenderer.invoke('group:delete', groupID),

    /******************** library ********************/
    addLibrary: (groupID: number, LibraryName: string) => ipcRenderer.invoke('library:add', groupID, LibraryName),
    updataOrderLibrary: (groupID: number, librarysId: number[]) => ipcRenderer.invoke('library:updataOrder', groupID, librarysId),
    renameLibrary: (LibraryID: number, rename: string) => ipcRenderer.invoke('library:rename', LibraryID, rename),
    deleteLibrary: (LibraryID: number) => ipcRenderer.invoke('library:delete', LibraryID),
    moveLibrary: (toGroupId: number, moveLibraryId: number) => ipcRenderer.invoke('library:move', toGroupId, moveLibraryId),

    /******************** Items ********************/
    libraryAutoComplete: (LibraryID: number, type: number, queryWords: string, pagesize: number) =>
        ipcRenderer.invoke('library:autoComplete', LibraryID, type, queryWords, pagesize),
    getItems: (libraryID: number) => ipcRenderer.invoke('library:getItems', libraryID),
    getItemsByAuthor: (libraryID: number, getItemsOption: getItemsOption, authorID: number) => ipcRenderer.invoke('library:getItemsByAuthor', libraryID, getItemsOption, authorID),
    getItemsOfFav: (libraryID: number, getItemsOption: getItemsOption) => ipcRenderer.invoke('library:getItemsOfFav', libraryID, getItemsOption),
    getAuthorList: (libraryID: number, type: number, queryWords: string | [string, string, string]) => ipcRenderer.invoke('library:getAuthorList', libraryID, type, queryWords),
    getAttributes: (libraryID: number, type: number, pageno: number) => ipcRenderer.invoke('library:getAttributes', libraryID, type, pageno),




    /******************** 其他 ********************/
    devTest: () => ipcRenderer.invoke('dev:test'),

    /******************** 系统 ********************/
    openFile: () => ipcRenderer.invoke('dialog:selectFile'),
    openUrlExternal: (url: string) => ipcRenderer.invoke('shell:openUrlExternal', url),
    showItemInFolder: (fulllPath: string) => ipcRenderer.invoke('shell:showItemInFolder', fulllPath),

    /******************** 窗口 ********************/
    windowRelaunch: () => ipcRenderer.invoke('window:relaunch'),
    createMainWindow: (library: library) => ipcRenderer.invoke('window:createMainWindow', library),
    createItemWinodw: (libraryID: number, itemID: number) => ipcRenderer.invoke('window:createItemWindow', libraryID, itemID),
    windowMinmize: () => ipcRenderer.invoke('window:minmize'),
    windowMaxmize: () => ipcRenderer.invoke('window:maxmize'),
    windowIsMaxmize: (callback: (e: any, value: boolean) => void) => ipcRenderer.on('window:isMaxmize', callback),
    windowClose: () => ipcRenderer.invoke('window:close')
})

contextBridge.exposeInMainWorld('versionAPI', {
    appVersion: () => ipcRenderer.invoke('app:version'),
    electronVersion: process.versions.electron,
    chromeVersion: process.versions.chrome,
    nodeVersion: process.versions.node,
})