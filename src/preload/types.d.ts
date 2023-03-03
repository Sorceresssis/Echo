// types.d.ts
import type { ipcRenderer } from "electron"
import path from "path"

export interface IElectronAPI {
    getAllDatabase: () => Promise<any>
    openFile: () => Promise<any>
    windowMinmize: () => Promise<any>
    windowMaxmize: () => Promise<any>
    windowAcceptIsMaxmize: (callback: (e: any, value: any) => void) => Promise<any>
    windowClose: () => Promise<any>
}

declare global {
    interface Window {
        electronAPI: IElectronAPI
        NodeAPI: INodeAPI
    }
}