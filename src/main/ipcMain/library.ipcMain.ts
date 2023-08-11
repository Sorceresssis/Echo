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

    ipcMain.handle('tag:query', (e: IpcMainInvokeEvent, libraryId: number, options: QueryAttributesOptions) => {
        let libraryDao
        try {
            libraryDao = new LibraryDao(libraryId)
            return libraryDao.queryTags(options.queryWork, options.sortField, options.asc, options.pn, options.ps)
        } catch (e: any) {
            dialog.showErrorBox('tag:query', e.message)
            return
        } finally {
            libraryDao?.destroy()
        }
    })

    ipcMain.handle('tag:edit', (e: IpcMainInvokeEvent, libraryId: number,) => {

    })

    ipcMain.handle('tag:delete', (e: IpcMainInvokeEvent, libraryId: number, tagId: number) => {

    })

    ipcMain.handle('dirname:query', (e: IpcMainInvokeEvent, libraryId: number, options: QueryAttributesOptions) => {
        let libraryDao
        try {
            libraryDao = new LibraryDao(libraryId)
            return libraryDao.queryDirnames(options.queryWork, options.sortField, options.asc, options.pn, options.ps)
        } catch (e: any) {
            dialog.showErrorBox('dirname:query', e.message)
            return
        } finally {
            libraryDao?.destroy()
        }
    })
}