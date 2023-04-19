import { promises } from "dns"
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

    /******************** Item ********************/
    searchSuggest: () => Promise<string[]>
    getAttributeItem: (LibraryID: number, attribute: number, pageno: number, pagesize: number, filterWords: string[]) => Promise<string[]>
    getItems: (libraryID: number) => Promise<item[]>

    /******************** 对话框 ********************/
    openFile: () => Promise<any>




    config: (index: string, newValue: any = null) => Promise<any>

    /******************** 系统 ********************/
    openUrlExternal: (url: string) => Promise<void>
    showItemInFolder: (fullPath: string) => Promise<string>

    /******************** 窗口 ********************/
    windowRelaunch: () => Promise<void>
    createMainWindow: (library: library) => Promise<any>
    createItemWinodw: (libraryID: number, itemID: number) => Promise<any>
    windowMinmize: () => Promise<any>
    windowMaxmize: () => Promise<any>
    windowIsMaxmize: (callback: (e: any, value: any) => void) => Promise<any>
    windowClose: () => Promise<any>
}

export interface INodeAPI {

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
    interface item {
        id: number
        title: string
        isFav: number
        hyperlink: string
        flieName: string
        folder_id: number
        tags: string
        authorsID: string
        authors: string
    }
}