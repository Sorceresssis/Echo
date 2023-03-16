import type { ipcRenderer } from "electron"
import path from "path"

export interface IElectronAPI {
    getAllDatabase: () => Promise<any>
    addGroup: (groupName: string) => Promise<any>

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
    class group {
        id: number
        name: string
        isOpen: number
        databases: database[]
        constructor(id: number, name: string, isOpen: number, databases: database[]) {
            this.id = id
            this.name = name
            this.isOpen = isOpen
            this.databases = databases
        }
    }
    class database {
        id: number
        name: string
        constructor(id: number, name: string) {
            this.id = id
            this.name = name
        }
    }
}