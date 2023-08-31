import { ipcMain, IpcMainInvokeEvent, dialog } from "electron"
import { unlinkSync, isLegalAbsolutePath } from "../util/FileManager"
import LibraryDao from "../dao/libraryDao"
import ImageService from "../service/ImageService"
import QueryLibraryService from "../service/QueryRecordService"
import QueryAuthorService from "../service/QueryAuthorService"
import ManageRecordSerivce from "../service/ManageRecordSerivce"
import Result from "../util/Result"

// 多个窗口可能同时调用，所有不能使用唯一的LibraryDao
export default function ipcMainLibrary() {
    ipcMain.handle('record:autoComplete', (e: IpcMainInvokeEvent, libraryId: number, options: DTO.AcOptions): VO.AcSuggestion[] => {
        const libraryDao = new LibraryDao(libraryId)
        try {
            return libraryDao.autoComplete(options.type, options.queryWord, options.ps)
        } catch (e: any) {
            dialog.showErrorBox('record:autoComplete', e.message)
            return []
        } finally {
            libraryDao.destroy()
        }
    })

    ipcMain.handle('record:queryDetail', (e: IpcMainInvokeEvent, libraryId: number, recordId: number): VO.RecordDetail | undefined => {
        const libraryDao = new LibraryDao(libraryId)
        try {
            return libraryDao.queryRecordDetail(recordId)
        } catch (e: any) {
            dialog.showErrorBox('record:queryDetail', e.message)
            return
        } finally {
            libraryDao.destroy()
        }
    })

    ipcMain.handle('record:edit', (e: IpcMainInvokeEvent, libraryId: number, formData: DTO.EditRecordForm, options: DTO.EditRecordOptions): Result | undefined => {
        const manageRecordSerivce = new ManageRecordSerivce(libraryId)
        try {
            return manageRecordSerivce.edit(formData, options)
        } catch (e: any) {
            dialog.showErrorBox('record:edit', e.message)
            return
        } finally {
            manageRecordSerivce.close()
        }
    })

    ipcMain.handle('record:delete', (e: IpcMainInvokeEvent, libraryId: number, recordId: number) => {

    })

    ipcMain.handle('record:deleteByAttribute', (e: IpcMainInvokeEvent, libraryId: number, formData: DTO.DeleteRecordByAttributeForm) => {
        const manageRecordSerivce = new ManageRecordSerivce(libraryId)
        try {
            return manageRecordSerivce.deleteByAttribute(formData)
        } catch (e: any) {
            dialog.showErrorBox('record:batchDelete', e.message)
            return
        } finally {
            manageRecordSerivce.close()
        }
    })

    ipcMain.handle('author:queryRecmds', (e: IpcMainInvokeEvent, libraryId: number, options: DTO.QueryAuthorRecommendationsOptions): DTO.Page<VO.AuthorRecommendation> => {
        const queryAuthorService = new QueryAuthorService(libraryId)
        try {
            return queryAuthorService.queryAuthorRecmds(options)
        } catch (e: any) {
            dialog.showErrorBox('author:queryRecmds', e.message)
            return { total: 0, rows: [] }
        } finally {
            queryAuthorService.close()
        }
    })

    ipcMain.handle('author:query', (e: IpcMainInvokeEvent, libraryId: number, authorId: number): VO.Author | undefined => {
        const libraryDao = new LibraryDao(libraryId)
        try {
            return libraryDao.queryAuthor(authorId)
        } catch (e: any) {
            dialog.showErrorBox('author:query', e.message)
            return
        } finally {
            libraryDao.destroy()
        }
    })

    ipcMain.handle('author:edit', async (e: IpcMainInvokeEvent, libraryId: number, formData: DTO.EditAuthorForm,) => {
        const libraryDao = new LibraryDao(libraryId)
        try {
            const author: Entity.Author = {
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
                if (author.avatar) {
                    // 保存新的头像
                    const imageService = new ImageService(formData.avatar, libraryId)
                    const avatar = imageService.handleAuthorAvatar()
                    if (avatar) {
                        author.avatar = avatar
                    }
                }
            }
            // 判断添加还是修改
            formData.id === 0 ? libraryDao.addAuthor(author) : libraryDao.editAuthor(author)
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

    ipcMain.handle('tag:query', (e: IpcMainInvokeEvent, libraryId: number, options: DTO.QueryAttributesOptions): DTO.Page<VO.TextAttribute> | undefined => {
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

    ipcMain.handle('dirname:query', (e: IpcMainInvokeEvent, libraryId: number, options: DTO.QueryAttributesOptions): DTO.Page<VO.TextAttribute> | undefined => {
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

    ipcMain.handle('dirname:startsWithReplace', (e: IpcMainInvokeEvent, libraryId: number, target: string, replace: string): Result => {
        const libraryDao = new LibraryDao(libraryId)
        try {
            // 过滤掉window的 不合法的盘符
            if (isLegalAbsolutePath(target) && isLegalAbsolutePath(replace)) {
                libraryDao.startsWithReplaceDirname(target, replace)
                return Result.success()
            }
            else {
                return Result.error('路径不合法')
            }
        } catch (e: any) {
            dialog.showErrorBox('dirname:startsWithReplace', e.message)
            return Result.error(e.message)
        } finally {
            libraryDao.destroy()
        }
    })
}