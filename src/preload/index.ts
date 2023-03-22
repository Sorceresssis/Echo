// index.ts
import { contextBridge, ipcRenderer } from "electron"

contextBridge.exposeInMainWorld('electronAPI', {
    /******************** 开始准备 ********************/
    getGroups: () => ipcRenderer.invoke('userData:getGroups'),
    startOpenDB: (callback: (e: any, value: any) => void) => ipcRenderer.on('startOpenDB', callback),


    // group
    addGroup: (groupName: string) => ipcRenderer.invoke('userData:addGroup', groupName),
    renameGroup: (groupID: number, rename: string) => ipcRenderer.invoke('userData:renameGroup', groupID, rename),
    deleteGroup: (groupID: number) => ipcRenderer.invoke('userData:deleteGroup', groupID),
    updataOrderGroup: () => ipcRenderer.invoke('userData:'),
    // database
    addDatabase: (groupID: number) => ipcRenderer.invoke('userData:addDatabase', groupID),
    renameDatabase: (databaseID: number, rename: string) => ipcRenderer.invoke('userData:renameDatabase', databaseID, rename),
    moveDatabase: () => ipcRenderer.invoke('userData:'),
    deleteDatabase: () => ipcRenderer.invoke('userData:'),
    updataOrderDatabase: () => ipcRenderer.invoke('userData:'),

    /******************** 对话框 ********************/
    openFile: () => ipcRenderer.invoke('dialog:openFile'),


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