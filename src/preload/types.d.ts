import type { ipcRenderer } from "electron"
import path from "path"

export interface IElectronAPI {
    /******************** 开始准备 ********************/
    getGroups: () => Promise<group[]>
    startOpenDB: (callback: (e: any, value: library) => void) => Promise<any>,

    /******************** group ********************/
    addGroup: (groupName: string) => Promise<number | null>
    updataOrderGroup: (groupsId: number[]) => Promise<void>
    renameGroup: (groupID: number, rename: string) => Promise<boolean>
    deleteGroup: (groupID: number) => Promise<boolean>

    /******************** library ********************/
    addLibrary: (groupID: number, LibraryName: string) => Promise<number | null>
    updataOrderLibrary: (groupID: number, librarysId: number[]) => Promise<void>
    renameLibrary: (LibraryID: number, rename: string) => Promise<boolean>
    deleteLibrary: (LibraryID: number) => Promise<boolean>
    moveLibrary: (toGroupId: number, moveLibraryId: number) => Promise<boolean>

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