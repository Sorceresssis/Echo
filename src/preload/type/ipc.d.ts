export interface IElectronAPI {
    /******************** app ********************/
    config: (index: string, newValue: any = null) => Promise<any>

    /******************** group ********************/
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

    /******************** library ********************/
    /** 获取后台发送要打开的library */
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

    /******************** record ********************/
    /** 自动补齐 */
    autoCompleteRecord: (libraryId: number, options: AcOption) => Promise<ACSuggestion>

    /******************** author ********************/
    queryAuthorDetail: (libraryId: number, authorId: number) => Promise<AuthorDetail | undefined>
    /** 编辑作者 */
    editAuthor: (libraryId: number, formData: EditAuthorForm) => Promise<boolean>

    /******************** tag ********************/
    queryTags: (libraryId: number, options: QueryAttributesOptions) => Promise<Page>
    deleteTag: (libraryId: number, tagId: number) => Promise<boolean>
    editTag: (libraryId: number, tagId: number, newValue: string) => Promise<boolean>

    /******************** dirname ********************/
    queryDirnames: (libraryId: number, options: QueryAttributesOptions) => Promise<Page>
    deleteDirname: (libraryId: number, dirnameId: number) => Promise<boolean>
    editDirname: (libraryId: number, dirnameId: number, newValue: string) => Promise<boolean>
    startsWithReplaceDirname: (libraryId: number, target: string, replace: string) => Promise<Result>,

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