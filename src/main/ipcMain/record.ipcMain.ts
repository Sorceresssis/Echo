import { ipcMain, IpcMainInvokeEvent, dialog } from "electron"
import tokenizer from "../util/tokenizer"
import { LibraryDao } from "../dao/libraryDao"

export function ipcMainLibrary() {
    ipcMain.handle('record:add', (e: IpcMainInvokeEvent, libraryId: number, RecordForm: any, option: any): boolean => {
        let libraryDao
        try {
            libraryDao = new LibraryDao(libraryId)
            return true
        } catch {
            // dialog.showErrorBox()
            return false
        } finally {
            libraryDao?.destroy()
        }
    })

    ipcMain.handle('record:queryProfiles', (e: IpcMainInvokeEvent, libraryId: number, option: any): any => {
        let libraryDao = new LibraryDao(libraryId)

        // // 开始分词
        // console.log(tokenizer.doSegment('这是一个基于Node.js的中文分词模块。'))
        // return libraryDao.test()

        return tokenizer.doSegment('这是一个基于Node.js的中文分词模块。')
    })

    ipcMain.handle('record:autoComplete', (e: IpcMainInvokeEvent, libraryId: number, option: any): ACSuggestion[] => {
        let libraryDao = new LibraryDao(libraryId)
        libraryDao.autoComplete(option.type, option.queryWord, option.pagesize)
        return []
    })



    // ipcMain.handle('library:autoComplete', async (e: IpcMainInvokeEvent, libraryID: number, type: number, queryWords: string, pagesize: number) => {
    //     let library: DBLibrary = new DBLibrary(path.resolve(config.userDataPath, `database/${libraryID}.db`))
    //     return await library.autoComplete(type, queryWords, pagesize)
    // })
    // ipcMain.handle('library:getItems', async (e: IpcMainInvokeEvent, libraryID: number) => {
    //     //TODO 检查文件夹image/1/authorProfile coverimage
    //     checkImageDir(libraryID)
    //     let library: DBLibrary = new DBLibrary(path.resolve(config.userDataPath, `database/${libraryID}.db`))
    //     return await library.getItems({ queryType: 0, queryWords: '', filterOption: [false, false, false], orderBy: 0, isAscending: true, pageno: 0 })
    // })
    // ipcMain.handle('library:getItemsByAuthor', async (e: IpcMainInvokeEvent, libraryID: number, getItemsOption: getItemsOption, authorID: number) => {
    //     let library: DBLibrary = new DBLibrary(path.resolve(config.userDataPath, `database/${libraryID}.db`))
    //     return await library.getItemsByAuthor(getItemsOption, authorID)
    // })
    // ipcMain.handle('library:getItemsOfFav', async (e: IpcMainInvokeEvent, libraryID: number, getItemsOption: getItemsOption) => {
    //     let library: DBLibrary = new DBLibrary(path.resolve(config.userDataPath, `database/${libraryID}.db`))
    //     return await library.getItemsOfFav(getItemsOption)
    // })
    // ipcMain.handle('library:getAuthorList', async (e: IpcMainInvokeEvent, libraryID: number, type: number, queryWords: string | [string, string, string]) => {
    //     let library: DBLibrary = new DBLibrary(path.resolve(config.userDataPath, `database/${libraryID}.db`))
    //     let authorList: authorProfile[] = await library.getAuthorList(type, queryWords)
    //     for (let i = 0; i < authorList.length; i++) {
    //         let str = authorList[i].itemIDs
    //         const fourthCommaIndex = str.indexOf(',', str.indexOf(',', str.indexOf(',') + 1) + 1)
    //         if (fourthCommaIndex != -1) {
    //             // 截取前面三个逗号的部分
    //             authorList[i].itemIDs = str.slice(0, fourthCommaIndex)
    //         }
    //     }
    //     return authorList
    // })
    // ipcMain.handle('library:getAttributes', async (e: IpcMainInvokeEvent, libraryID: number, type: number, pageno: number) => {
    //     let library: DBLibrary = new DBLibrary(path.resolve(config.userDataPath, `database/${libraryID}.db`))
    //     return await library.getAttributes(type, pageno)
    // })
    // ipcMain.handle('library:addItem', (e: IpcMainInvokeEvent, libraryID: number) => {
    // })
}