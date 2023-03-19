// index.ts
import { contextBridge, ipcRenderer } from "electron"

contextBridge.exposeInMainWorld('electronAPI', {
    getAllDatabase: () => ipcRenderer.invoke('userData:getAllDatabase'),
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




    openFile: () => ipcRenderer.invoke('dialog:openFile'),

    windowMinmize: () => ipcRenderer.invoke('window:windowMinmize'),
    windowMaxmize: () => ipcRenderer.invoke('window:windowMaxmize'),
    windowAcceptIsMaxmize: (callback: () => void) => ipcRenderer.on('window:windowIsMaxmize', callback),
    windowClose: () => ipcRenderer.invoke('window:windowClose')
})

contextBridge.exposeInMainWorld('NodeAPI', {

})

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    ping: () => ipcRenderer.invoke('ping'),
})