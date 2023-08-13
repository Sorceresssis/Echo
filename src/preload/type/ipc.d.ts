import type { ipcRenderer } from "electron"
import { StepInstance } from "element-plus"
import { type } from "os"
import path from "path"

export interface IElectronAPI {
    /******************** 开始准备 ********************/
    config: (index: string, newValue: any = null) => Promise<any>

    /******************** GroupDB ********************/
    /** 获取所有的group和library */
    getGroups: () => Promise<Group[]>
    /** 重命名group */
    renameGroup: (id: number, newName: string) => Promise<boolean>
    /** 添加group */
    addGroup: (name: string) => Promise<boolean>
    /** 删除group */
    deleteGroup: (id: number) => Promise<boolean>
    /** 排序group */
    sortGroup: (currId: number, tarNextId: number) => Promise<void>
    /** 获取优先打开的library */
    getPrimaryOpenLibrary: (callback: (e: IpcRendererEvent, libraryId: number) => void) => void,
    /** 通过libraryId获取libraryName */
    getLibraryNameByID: (id: number) => Promise<string>
    /** 重命名library */
    renameLibrary: (id: number, newName: string) => Promise<boolean>
    /** 添加library */
    addLibrary: (groupId: number, name: string) => Promise<boolean>
    /** 删除library */
    deleteLibrary: (id: number) => Promise<boolean>
    /** 排序library */
    sortLibrary: (currId: number, tarNextId: number, groupId: number) => Promise<void>

    /******************** RecordDB ********************/
    /** 自动补齐 */
    autoCompleteRecord: (libraryId: number, options: AcOption) => Promise<ACSuggestion>
    queryTags: (libraryId: number, options: QueryAttributesOptions) => Promise<Page>
    deleteTag: (libraryId: number, tagId: number) => Promise<boolean>
    editTag: (libraryId: number, tagId: number, newValue: string) => Promise<boolean>
    queryDirnames: (libraryId: number, options: QueryAttributesOptions) => Promise<Page>
    deleteDirname: (libraryId: number, dirnameId: number) => Promise<boolean>
    editDirname: (libraryId: number, dirnameId: number, newValue: string) => Promise<boolean>
    queryAuthorDetail: (libraryId: number, authorId: number) => Promise<AuthorDetail | undefined>
    /** 编辑作者 */
    editAuthor: (libraryId: number, formData: EditAuthorForm, options: EditAuthorOption) => Promise<boolean>



    /** 查询记录的简介 */
    queryRecordProfiles: (libraryId: number, option: any) => Promise<any>
    getItems: (libraryID: number) => Promise<itemProfile[]>
    getItemsByAuthor: (libraryID: number, getItemsOption: getItemsOption, authorID: number) => Promise<itemProfile[]>

    /******************** dialog ********************/
    openDialog: (type: OpenDialogType, multiSelect: boolean) => Promise<string[]>

    /******************** system ********************/
    openExternal: (url: string) => Promise<void>
    openInExplorer: (fullPath: string) => Promise<void>
    openFile: (fullPath: string) => Promise<void>
    writeClipboard: (text: string) => Promise<void>

    /******************** window ********************/
    createMainWindow: (libraryId: number) => Promise<boolean>
    createItemWinodw: (libraryId: number, itemId: number) => Promise<void>
    windowRelaunch: () => Promise<void>
    windowMinmize: () => Promise<void>
    windowMaxmize: () => Promise<void>
    windowIsMaxmize: (callback: (e: IpcRendererEvent, value: any) => void) => Promise<any>
    windowClose: () => Promise<void>
}

declare global {
    interface Window {
        electronAPI: IElectronAPI
        versionAPI: IVersionAPI
    }
    interface IVersionAPI {
        appVersion: () => Promise<string>
        electronVersion: string
        chromeVersion: string
        nodeVersion: string
    }
}