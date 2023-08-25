type Result = {
    code: number
    msg?: string
    data: any
}

export interface IElectronAPI {
    /******************** app ********************/
    config: (
        key: string,
        newValue?: any
    ) => Promise<any>


    /******************** group ********************/
    /**
     * 获取所有的group和library
     * @returns Groups
     */
    getGroups: () => Promise<Group[]>

    /**
     * 重命名group
     * @param id group的id
     * @param newName 新的名字
     * @returns 是否修改成功
     */
    renameGroup: (
        id: number,
        newName: string
    ) => Promise<boolean>

    /** 
     * 添加group
     */
    addGroup: (
        name: string
    ) => Promise<boolean>

    /** 
     * 删除group
     */
    deleteGroup: (
        id: number
    ) => Promise<boolean>

    /** 
     * 排序group
     */
    sortGroup: (
        currId: number,
        tarNextId: number
    ) => Promise<void>

    /******************** library ********************/

    /** 
     * 获取后台发送要打开的library
     */
    getPrimaryOpenLibrary: (
        callback: (e: IpcRendererEvent, libraryId: number) => void
    ) => void,

    /** 
     * 通过libraryId获取libraryName
     */
    getLibraryNameByID: (
        id: number
    ) => Promise<string | null>

    /** 
     * 重命名library
     */
    renameLibrary: (
        id: number,
        newName: string
    ) => Promise<boolean>

    /** 
     * 添加library
     */
    addLibrary: (
        groupId: number,
        name: string
    ) => Promise<boolean>

    /** 
     * 删除library
     */
    deleteLibrary: (
        id: number
    ) => Promise<boolean>

    /** 
     * 排序library
     */
    sortLibrary: (
        currId: number,
        tarNextId: number,
        groupId: number
    ) => Promise<void>

    /******************** record ********************/

    /** 
     * 自动补齐
     */
    autoCompleteRecord: (
        libraryId: number,
        options: DTO.AcOptions
    ) => Promise<VO.AcSuggestion>

    deleteRecordByAttribute: (
        libraryId: number,
        formData: DTO.DeleteRecordByAttributeForm
    ) => Promise<void>

    /**
     * 更具recordId获取record的所有信息
     */
    queryRecordDetail: (
        libraryId: number,
        recordId: number
    ) => Promise<VO.RecordDetail>

    /**
     * 编辑和添加record 
     */
    editRecord: (
        libraryId: number,
        formData: DTO.EditRecordForm,
        options: DTO.EditRecordOptions
    ) => Promise<Result>


    /******************** author ********************/
    queryAuthor: (
        libraryId: number,
        authorId: number
    ) => Promise<VO.Author | undefined>

    /**
     * 编辑作者
     */
    editAuthor: (
        libraryId: number,
        formData: DTO.EditAuthorForm
    ) => Promise<boolean>

    /******************** tag ********************/
    queryTags: (
        libraryId: number,
        options: DTO.QueryAttributesOptions
    ) => Promise<DTO.Page<VO.TextAttribute>>

    deleteTag: (
        libraryId: number,
        tagId: number
    ) => Promise<boolean>

    editTag: (
        libraryId: number,
        tagId: number,
        newValue: string
    ) => Promise<boolean>

    /******************** dirname ********************/
    queryDirnames: (
        libraryId: number,
        options: DTO.QueryAttributesOptions
    ) => Promise<DTO.Page<VO.TextAttribute>>

    deleteDirname: (
        libraryId: number,
        dirnameId: number
    ) => Promise<boolean>

    editDirname: (
        libraryId: number,
        dirnameId: number,
        newValue: string
    ) => Promise<boolean>

    startsWithReplaceDirname: (
        libraryId: number,
        target: string,
        replace: string
    ) => Promise<Result>,


    /******************** dialog ********************/

    openDialog: (
        type: OpenDialogType,
        multiSelect: boolean
    ) => Promise<string[]>


    /******************** system ********************/

    openExternal: (
        url: string
    ) => Promise<void>

    openInExplorer: (
        fullPath: string
    ) => Promise<void>

    openFile: (
        fullPath: string
    ) => Promise<void>

    writeClipboard: (
        text: string
    ) => Promise<void>


    /******************** window ********************/

    createMainWindow: (
        libraryId: number
    ) => Promise<boolean>

    createItemWinodw: (
        ibraryId: number,
        itemId: number
    ) => Promise<void>

    windowRelaunch: () => Promise<void>

    windowMinmize: () => Promise<void>

    windowMaxmize: () => Promise<void>

    windowIsMaxmize: (
        allback: (e: IpcRendererEvent, value: any) => void
    ) => Promise<any>

    windowClose: () => Promise<void>
}

export interface ISystemAPI {
    pathSep: () => Promise<'\\' | '/'>
}

export interface IVersionAPI {
    app: () => Promise<string>
    electron: string
    chrome: string
    node: string
}

declare global {
    interface Window {
        electronAPI: IElectronAPI
        versionAPI: IVersionAPI
        systemAPI: ISystemAPI
    }
}