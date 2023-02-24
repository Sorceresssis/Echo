// types.d.ts
import type { ipcRenderer } from "electron"
import path from "path"

export interface IElectronAPI {
    getAllDatabase: () => Promise<any>
    openFile: () => Promise<any>
}

declare global {
    interface Window {
        electronAPI: IElectronAPI
        NodeAPI: INodeAPI
    }
}