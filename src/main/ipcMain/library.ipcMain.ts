import { ipcMain, IpcMainInvokeEvent, dialog } from "electron"
import LibraryQueryService from "../service/libraryQueryService"
import ImageService from "../service/ImageService"
import LibraryDao from "../dao/libraryDao"
import tokenizer from "../util/tokenizer"

// 多个窗口可能同时调用，所有不能使用唯一的LibraryDao
export default function ipcMainLibrary() {
    ipcMain.handle('record:autoComplete', (e: IpcMainInvokeEvent, libraryId: number, option: AcOption): AcSuggestion[] => {
        let libraryDao
        try {
            libraryDao = new LibraryDao(libraryId)
            return libraryDao.autoComplete(option.type, tokenizer(option.queryWord), option.ps)
        } catch (e: any) {
            dialog.showErrorBox('record:autoComplete', e.message)
            return []
        } finally {
            libraryDao?.destroy()
        }
    })

    ipcMain.handle('author:queryDetail', (e: IpcMainInvokeEvent, libraryId: number, authorId: number): AuthorDetail | undefined => {
        let libraryDao
        try {
            libraryDao = new LibraryDao(libraryId)
            return libraryDao.queryAuthorDetail(authorId)
        } catch (e: any) {
            dialog.showErrorBox('author:queryDetail', e.message)
            return
        } finally {
            libraryDao?.destroy()
        }
    })

    ipcMain.handle('author:edit', (e: IpcMainInvokeEvent, libraryId: number, authorForm: AuthorForm) => {
        let libraryDao
        try {
            // 判断是否要处理图片
            // if (authorForm.avatar) {
            //     const imageService = new ImageService(authorForm.avatar, libraryId)
            //     imageService.handleAuthorAvatar()
            //     设置为null
            // }
            if (authorForm.avatar === '') {
            }

            libraryDao = new LibraryDao(libraryId)
            // 判断添加还是修改
            if (authorForm.id === 0) {
                libraryDao.addAuthor(authorForm)
            } else {
                libraryDao.editAuthor(authorForm)
            }
            return true
        } catch (e: any) {
            dialog.showErrorBox('author:edit', e.message)
            return false
        } finally {
            libraryDao?.destroy()
        }
    })

    ipcMain.handle('record:addRecord', (e: IpcMainInvokeEvent, libraryId: number, recordForm: RecordForm, option: RecordFormOption): boolean => {

        // 添加属性
        // 添加dirname 返回的是dirname的id
        // 添加标签 返回的是标签的id
        // 添加系列 返回的是系列的id

        // 事务
        // record表中添加记录
        // 在record_dirname中添加记录
        // 在record_tag中添加记录
        // 在record_series中添加记录
        // 在record中添加作者id
        // record额外信息

        // 删除标签这怎么办？

        // let libraryDao
        // try {
        //     libraryDao = new LibraryDao(libraryId)
        //     return true
        // } catch (e: any) {
        //     dialog.showErrorBox('record:add', e.message)
        //     return false
        // } finally {
        //     libraryDao?.destroy()
        // }
        return true
    })

    ipcMain.handle('record:queryProfiles', (e: IpcMainInvokeEvent, libraryId: number, option: any): any => {
        // let libraryDao = new LibraryDao(libraryId)


        return
    })

    // ipcMain.handle('library:getItems', async (e: IpcMainInvokeEvent, libraryID: number) => {
    //     //TODO 检查文件夹image/1/authorProfile coverimage
    //     checkImageDir(libraryID)
    //     let library: DBLibrary = new DBLibrary(path.resolve(config.userDataPath, `database/${libraryID}.db`))
    //     return await library.getItems({ queryType: 0, queryWords: '', filterOption: [false, false, false], orderBy: 0, isAscending: true, pageno: 0 })
    // })
    // ipcMain.handle('library:getAttributes', async (e: IpcMainInvokeEvent, libraryID: number, type: number, pageno: number) => {
    //     let library: DBLibrary = new DBLibrary(path.resolve(config.userDataPath, `database/${libraryID}.db`))
    //     return await library.getAttributes(type, pageno)
    // })
    ipcMain.handle('tag:delete', (e: IpcMainInvokeEvent, libraryId: number, tagId: number) => {

    })

    ipcMain.handle('tag:edit', (e: IpcMainInvokeEvent,) => {

    })

    ipcMain.handle('tag:query', (e: IpcMainInvokeEvent, libraryId: number, pn: number, ps: number, keyword) => {

    })
}