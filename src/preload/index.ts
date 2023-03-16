// index.ts
import { contextBridge, ipcRenderer } from "electron"

contextBridge.exposeInMainWorld('electronAPI', {
    getAllDatabase: () => ipcRenderer.invoke('userData:getAllDatabase'),
    addGroup: (groupName: string) => ipcRenderer.invoke('userData:addGroup', groupName),

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

contextBridge.exposeInMainWorld("ipcRenderer", ipcRenderer)