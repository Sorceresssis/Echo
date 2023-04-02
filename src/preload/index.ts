// index.ts
import { contextBridge, ipcRenderer } from "electron"
import path from "path"

contextBridge.exposeInMainWorld('electronAPI', {
    /******************** 开始准备 ********************/
    startOpenDB: (callback: (e: any, value: library) => void) => ipcRenderer.on('startOpenDB', callback),

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
    searchSuggest: () => ipcRenderer.invoke('library:searchSuggest'),
    getAttributeItem: (LibraryID: number, attribute: number, pageno: number, pagesize: number, filterWords: string[]) =>
        ipcRenderer.invoke('library:getAttribute', LibraryID, attribute, pageno, pagesize, filterWords),
    getItems: (libraryID: number) => ipcRenderer.invoke('library:getItems', libraryID),

    /******************** 对话框 ********************/
    openFile: () => ipcRenderer.invoke('dialog:openFile'),

    getConfig: () => ipcRenderer.invoke('config'),

    /******************** 窗口 ********************/
    createMainWindow: (library: library) => ipcRenderer.invoke('window:createMainWindow', library),
    createItemWindow: () => ipcRenderer.invoke('window:createItemWindow'),
    windowMinmize: () => ipcRenderer.invoke('window:minmize'),
    windowMaxmize: () => ipcRenderer.invoke('window:maxmize'),
    windowIsMaxmize: (callback: (e: any, value: boolean) => void) => ipcRenderer.on('window:isMaxmize', callback),
    windowClose: () => ipcRenderer.invoke('window:close')
})

contextBridge.exposeInMainWorld('NodeAPI', {

})

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    ping: () => ipcRenderer.invoke('ping'),
})