import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron"


enum OpenDialogType { DIR = 0, FILE, IMAGE, VIDEO }
contextBridge.exposeInMainWorld('electronAPI', {
    config: (index: string, newValue: any = null) => ipcRenderer.invoke('app:config', index, newValue),

    /******************** Group ********************/
    getGroups: () => ipcRenderer.invoke('group:getGroups'),
    renameGroup: (id: number, newName: string) => ipcRenderer.invoke('group:rename', id, newName),
    addGroup: (name: string) => ipcRenderer.invoke('group:add', name),
    deleteGroup: (id: number) => ipcRenderer.invoke('group:delete', id),


    /******************** Library ********************/
    getPrimaryOpenLibrary: (callback: (e: IpcRendererEvent, libraryId: number) => void) =>
        ipcRenderer.on('library:primaryOpenLibrary', callback),
    getLibraryNameByID: (id: number) => ipcRenderer.invoke('library:getLibraryNameByID', id),
    renameLibrary: (id: number, newName: string) => ipcRenderer.invoke('library:rename', id, newName),
    addLibrary: (groupId: number, name: string) => ipcRenderer.invoke('library:add', groupId, name),
    deleteLibrary: (id: number) => ipcRenderer.invoke('library:delete', id),



    updataOrderGroup: (groupsId: number[]) => ipcRenderer.invoke('group:updataOrder', groupsId),
    updataOrderLibrary: (groupID: number, librarysId: number[]) => ipcRenderer.invoke('library:updataOrder', groupID, librarysId),
    moveLibrary: (toGroupId: number, moveLibraryId: number) => ipcRenderer.invoke('library:move', toGroupId, moveLibraryId),



    /******************** db_library ********************/
    libraryAutoComplete: (LibraryID: number, type: number, queryWords: string, pagesize: number) =>
        ipcRenderer.invoke('library:autoComplete', LibraryID, type, queryWords, pagesize),
    getItems: (libraryID: number) => ipcRenderer.invoke('library:getItems', libraryID),
    getItemsByAuthor: (libraryID: number, getItemsOption: getItemsOption, authorID: number) => ipcRenderer.invoke('library:getItemsByAuthor', libraryID, getItemsOption, authorID),
    getItemsOfFav: (libraryID: number, getItemsOption: getItemsOption) => ipcRenderer.invoke('library:getItemsOfFav', libraryID, getItemsOption),
    getAuthorList: (libraryID: number, type: number, queryWords: string | [string, string, string]) => ipcRenderer.invoke('library:getAuthorList', libraryID, type, queryWords),
    getAttributes: (libraryID: number, type: number, pageno: number) => ipcRenderer.invoke('library:getAttributes', libraryID, type, pageno),


    /******************** 其他 ********************/
    devTest: () => ipcRenderer.invoke('dev:test'),


    /******************** dialog ********************/
    openDialog: (type: OpenDialogType, multiSelections: boolean) => ipcRenderer.invoke('dialog:openDialog', type, multiSelections),


    /******************** external ********************/
    openUrl: (url: string) => ipcRenderer.invoke('external:openUrlExternal', url),
    showItemInFolder: (fulllPath: string) => ipcRenderer.invoke('external:showItemInFolder', fulllPath),
    clibboardWriteText: (text: string) => ipcRenderer.invoke('external:clibboardWriteText', text),


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