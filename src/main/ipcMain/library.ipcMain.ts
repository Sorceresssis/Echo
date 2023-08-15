import { ipcMain, IpcMainInvokeEvent, dialog } from "electron"
import LibraryQueryService from "../service/libraryQueryService"
import ImageService from "../service/ImageService"
import LibraryDao from "../dao/libraryDao"
import { unlinkSync, isLegalAbsolutePath } from "../util/FileManager"
import tokenizer from "../util/tokenizer"

// 多个窗口可能同时调用，所有不能使用唯一的LibraryDao
export default function ipcMainLibrary() {
    ipcMain.handle('record:autoComplete', (e: IpcMainInvokeEvent, libraryId: number, options: AcOptions): AcSuggestion[] => {
        const libraryDao = new LibraryDao(libraryId)
        try {
            return libraryDao.autoComplete(options.type, tokenizer(options.queryWord), options.ps)
        } catch (e: any) {
            dialog.showErrorBox('record:autoComplete', e.message)
            return []
        } finally {
            libraryDao.destroy()
        }
    })

    ipcMain.handle('record:queryProfiles', (e: IpcMainInvokeEvent, libraryId: number, option: any): any => {
        // let libraryDao = new LibraryDao(libraryId)
        return
    })

    ipcMain.handle('record:addRecord', (e: IpcMainInvokeEvent, libraryId: number, recordForm: RecordForm, option: RecordFormOptions): boolean => {

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

    ipcMain.handle('record:delete', (e: IpcMainInvokeEvent, libraryId: number, recordId: number) => {

    })

    ipcMain.handle('record:batchDelete', (e: IpcMainInvokeEvent, libraryId: number,) => {

    })

    ipcMain.handle('author:queryRecmds', (e: IpcMainInvokeEvent, libraryId: number) => {
        const libraryDao = new LibraryDao(libraryId)
        try {

        } catch (e: any) {
            dialog.showErrorBox('author:queryRecmds', e.message)
            return
        } finally {
            libraryDao.destroy()
        }
    })

    ipcMain.handle('author:queryDetail', (e: IpcMainInvokeEvent, libraryId: number, authorId: number): AuthorDetail | undefined => {
        const libraryDao = new LibraryDao(libraryId)
        try {
            return libraryDao.queryAuthorDetail(authorId)
        } catch (e: any) {
            dialog.showErrorBox('author:queryDetail', e.message)
            return
        } finally {
            libraryDao.destroy()
        }
    })

    ipcMain.handle('author:edit', async (e: IpcMainInvokeEvent, libraryId: number, formData: EditAuthorForm,) => {
        const libraryDao = new LibraryDao(libraryId)
        try {
            const author: Author = {
                id: formData.id,
                name: formData.name.trim(),
                avatar: formData.avatar.length ? formData.avatar : null,
                intro: formData.intro.trim(),
            }
            if (formData.avatar !== formData.originAvatar) {
                // 删除旧的头像
                if (formData.originAvatar.length) {
                    unlinkSync(formData.originAvatar)
                }
                // 保存新的头像
                const imageService = new ImageService(formData.avatar, libraryId)
                const avatar = imageService.handleAuthorAvatar()
                if (avatar) {
                    author.avatar = avatar
                }
            }
            // 判断添加还是修改
            if (formData.id === 0) {
                libraryDao.addAuthor(author)
            } else {
                libraryDao.editAuthor(author)
            }
            return true
        } catch (e: any) {
            dialog.showErrorBox('author:edit', e.message)
            return false
        } finally {
            libraryDao.destroy()
        }
    })

    ipcMain.handle('author:delete', (e: IpcMainInvokeEvent, libraryId: number, authorId: number) => {
        const libraryDao = new LibraryDao(libraryId)
        try {
            return libraryDao.deleteAuthor(authorId)
        } catch (e: any) {
            dialog.showErrorBox('author:delete', e.message)
            return
        } finally {
            libraryDao.destroy()
        }
    })

    ipcMain.handle('tag:query', (e: IpcMainInvokeEvent, libraryId: number, options: QueryAttributesOptions) => {
        const libraryDao = new LibraryDao(libraryId)
        try {
            return libraryDao.queryTags(options.queryWork, options.sortField, options.asc, options.pn, options.ps)
        } catch (e: any) {
            dialog.showErrorBox('tag:query', e.message)
            return
        } finally {
            libraryDao.destroy()
        }
    })

    ipcMain.handle('tag:edit', (e: IpcMainInvokeEvent, libraryId: number, tagId: number, newValue: string) => {
        const libraryDao = new LibraryDao(libraryId)
        try {
            return libraryDao.editTag(tagId, newValue)
        } catch (e: any) {
            dialog.showErrorBox('tag:edit', e.message)
            return
        } finally {
            libraryDao.destroy()
        }
    })

    ipcMain.handle('tag:delete', (e: IpcMainInvokeEvent, libraryId: number, tagId: number) => {
        const libraryDao = new LibraryDao(libraryId)
        try {
            return libraryDao.deleteTag(tagId)
        } catch (e: any) {
            dialog.showErrorBox('tag:delete', e.message)
            return
        } finally {
            libraryDao.destroy()
        }
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

    ipcMain.handle('dirname:edit', (e: IpcMainInvokeEvent, libraryId: number, dirnameId: number, newValue: string) => {
        const libraryDao = new LibraryDao(libraryId)
        try {
            return libraryDao.editDirname(dirnameId, newValue)
        } catch (e: any) {
            dialog.showErrorBox('dirname:edit', e.message)
            return
        } finally {
            libraryDao.destroy()
        }
    })

    ipcMain.handle('dirname:delete', (e: IpcMainInvokeEvent, libraryId: number, dirnameId: number) => {
        const libraryDao = new LibraryDao(libraryId)
        try {
            return libraryDao.deleteDirname(dirnameId)
        } catch (e: any) {
            dialog.showErrorBox('dirname:delete', e.message)
            return
        } finally {
            libraryDao.destroy()
        }
    })

    ipcMain.handle('dirname:startsWithReplace', (e: IpcMainInvokeEvent, libraryId: number, target: string, replace: string) => {
        const libraryDao = new LibraryDao(libraryId)
        try {
            // 过滤掉window的 不合法的盘符
            if (isLegalAbsolutePath(target) && isLegalAbsolutePath(replace)) {
                libraryDao.startsWithReplaceDirname(target, replace)
                return { code: 1 }
            }
            else {
                return { code: 0, msg: '路径不合法' }
            }
        } catch (e: any) {
            dialog.showErrorBox('dirname:startsWithReplace', e.message)
            return { code: 0, msg: e.message }
        } finally {
            libraryDao.destroy()
        }
    })
}