import type { ipcRenderer } from "electron"
import { StepInstance } from "element-plus"
import { type } from "os"
import path from "path"

export interface IElectronAPI {
    /******************** 开始准备 ********************/
    startOpenDB: (callback: (e: any, value: library) => void) => Promise<any>,
    config: (index: string, newValue: any = null) => Promise<any>


    /******************** db_group ********************/
    getGroups: () => Promise<Group[]>
    addGroup: (groupName: string) => Promise<number | null>
    updataOrderGroup: (groupsId: number[]) => Promise<void>
    renameGroup: (groupID: number, rename: string) => Promise<boolean>
    deleteGroup: (groupID: number) => Promise<boolean>

    addLibrary: (groupID: number, LibraryName: string) => Promise<number | null>
    updataOrderLibrary: (groupID: number, librarysId: number[]) => Promise<void>
    renameLibrary: (LibraryID: number, rename: string) => Promise<boolean>
    deleteLibrary: (LibraryID: number) => Promise<boolean>
    moveLibrary: (toGroupId: number, moveLibraryId: number) => Promise<boolean>


    getLibraryNameByID: (id: number) => Promise<string>

    /******************** library ********************/
    libraryAutoComplete: (LibraryID: number, type: number, queryWords: string, pagesize: number) => Promise<AutoComplete[]>
    getItems: (libraryID: number) => Promise<itemProfile[]>
    getItemsByAuthor: (libraryID: number, getItemsOption: getItemsOption, authorID: number) => Promise<itemProfile[]>
    getItemsOfFav: (libraryID: number, getItemsOption: getItemsOption) => Promise<itemProfile[]>
    getAuthorList: (libraryID: number, type: number, queryWords: string | [string, string, string]) => Promise<authorProfile[]>
    getAttributes: (libraryID: number, type: number, pageno: number) => Promise<LibraryAttribute[]>


    /******************** 其他 ********************/
    devTest: () => Promise<any>


    /******************** dialog ********************/
    openDialog: (type: OpenDialogType, multiSelections: boolean) => Promise<string | string[]>


    /******************** external ********************/
    openUrl: (url: string) => Promise<void>
    showItemInFolder: (fullPath: string) => Promise<string>
    clibboardWriteText: (text: string) => Promise<void>


    /******************** window ********************/
    createMainWindow: (library: library) => Promise<void>
    createItemWinodw: (libraryID: number, itemID: number) => Promise<void>
    windowRelaunch: () => Promise<void>
    windowMinmize: () => Promise<void>
    windowMaxmize: () => Promise<void>
    windowIsMaxmize: (callback: (e: IpcRendererEvent, value: any) => void) => Promise<any>
    windowClose: () => Promise<void>
}

export interface IVersionAPI {
    appVersion: () => Promise<string>
    electronVersion: string
    chromeVersion: string
    nodeVersion: string
}

declare global {
    interface Window {
        electronAPI: IElectronAPI
        versionAPI: IVersionAPI
    }
    interface group {
        id: number
        name: string
        librarys: library[]
    }

    declare interface itemProfile {
        id: number
        title: string
        createTime: string
        hits: number
        hasImage: number
        isFav: number
        hyperlink: string
        folder_id: number
        authorIDs: string
        authorNames: string
        tags: string
    }
    type AutoComplete = {
        type: string
        id: number
        value: string
    }
    type getItemsOption = {
        // queryType: noQuery, commonQuery, advancedQuery
        queryType: number,
        queryWords: string | [string, string, string],
        // filterOptionIndex: [noHyperlink, noFile, noImage]
        filterOption: [boolean, boolean, boolean],
        // orderField: time, hits, title
        orderBy: number,
        isAscending: boolean,
        pageno: number
    }

    declare type authorProfile = {
        id: number
        name: string
        intro: string
        itemCount: number
        itemIDs: string
    }

    type LibraryAttribute = {
        id: number
        value: string
        itemCount: number
    }
}