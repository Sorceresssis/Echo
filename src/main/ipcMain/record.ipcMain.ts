import { ipcMain, IpcMainInvokeEvent } from "electron";

import { config } from '../config'
const path = require('path');

export function ipcMainRecord() {
    ipcMain.handle('record:add', (e: IpcMainInvokeEvent, libraryId: number, query: any, option: any) => {

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