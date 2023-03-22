import type { ipcRenderer } from "electron"
import path from "path"

export interface IElectronAPI {
    /******************** 开始准备 ********************/
    getGroups: () => Promise<group[]>
    startOpenDB: (callback: (e: any, value: database) => void) => Promise<any>,



    addGroup: (groupName: string) => Promise<any>
    renameGroup: (groupID: number, rename: string) => Promise<boolean>
    addDatabase: () => Promise<any>
    renameDatabase: (databaseID: number, rename: string) => Promise<boolean>


    /******************** 对话框 ********************/
    openFile: () => Promise<any>


    /******************** 窗口 ********************/
    createMainWindow: (library: library) => Promise<any>
    createItemWinodw: () => Promise<any>
    windowMinmize: () => Promise<any>
    windowMaxmize: () => Promise<any>
    windowIsMaxmize: (callback: (e: any, value: any) => void) => Promise<any>
    windowClose: () => Promise<any>
}

declare global {
    interface Window {
        electronAPI: IElectronAPI
        NodeAPI: INodeAPI
    }
    interface group {
        id: number
        name: string
        librarys: library[]
    }
    interface library {
        id: number
        name: string
    }
}