// index.ts
import { contextBridge, ipcRenderer } from "electron"

contextBridge.exposeInMainWorld('electronAPI', {
    getAllDatabase: () => ipcRenderer.invoke('getAllDatabase'),
    openFile: () => ipcRenderer.invoke('dialog:openFile')
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