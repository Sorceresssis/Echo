import { app, Notification, shell } from "electron"
import { Worker } from "worker_threads"
import fs from "fs"
import path from "path"
import fse from "fs-extra"
import appPaths from "../app/appPaths"
import { formatCurrentTime } from "../utils/common"
import { injectable, inject } from "inversify"
import InjectType from "../provider/injectType"
import DIContainer from "../provider/container"
import Result from "../utils/Result"
import i18n from "../locale"
import type { zipperOperation } from "./worker/zipper.worker"
import type { unzipperOperation } from "./worker/unzipper.worker"
import type GroupDB from "../db/GroupDB"
import type GroupDao from "../dao/GroupDao"
import type LibraryDao from "../dao/LibraryDao"
import type LibraryExtraDao from "../dao/LibraryExtraDao"

@injectable()
class LibraryService {
    public constructor(
        @inject(InjectType.GroupDao) private groupDao: GroupDao,
        @inject(InjectType.LibraryDao) private libraryDao: LibraryDao,
        @inject(InjectType.LibraryExtraDao) private libraryExtraDao: LibraryExtraDao,
    ) { }

    public queryLibraryDetail(id: number): VO.LibraryDetail | undefined {
        const lib = this.libraryDao.getLibraryById(id) as VO.LibraryDetail | undefined
        if (lib === void 0) return

        const extra = this.libraryExtraDao.getLibraryExtraById(id)!
        lib.use_auxiliary_st = extra.use_auxiliary_st
        lib.auxiliary_st = extra.auxiliary_st
        lib.intro = extra.intro
        return lib
    }

    public querySortedLibrarysByGroupId(groupId: Entity.PK): VO.Library[] {
        const librarys = this.libraryDao.getLibrarysSortedByGroupId(groupId) as VO.Library[]
        librarys.forEach(lib => lib.dataPath = appPaths.getLibraryDirPath(lib.id))
        return librarys
    }

    public rename(id: number, name: string): boolean {
        return this.libraryDao.updateNameById(id, name) > 0
    }

    public editLibraryExtra(data: Entity.LibraryExtra): boolean {
        if (data.id === 0) return false
        return this.libraryExtraDao.update(data) > 0
    }

    public create(name: string, groupId: number): Entity.PK {
        let newId: Entity.PK = 0
        DIContainer.get<GroupDB>(InjectType.GroupDB).transactionExec(() => {
            const headId = this.libraryDao.getIdByGroupIdPrevId(groupId, 0)
            newId = this.libraryDao.insert(name, groupId)
            if (headId !== void 0) { this.insertNode(newId, 0, headId) }
            // 创建library_extra记录
            this.libraryExtraDao.insert({
                id: newId,
                use_auxiliary_st: 1,
                auxiliary_st: '',
                intro: '',
            })
        })
        return newId
    }

    public delete(id: Entity.PK): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            DIContainer.get<GroupDB>(InjectType.GroupDB).transactionExec(async () => {
                this.removeNode(id)
                this.libraryDao.deleteById(id)
                this.libraryExtraDao.deleteById(id)

                fse.remove(appPaths.getLibraryDirPath(id)).then(() => {
                    resolve()
                }).catch(() => {
                    reject()
                    throw new Error()
                })
            })
        })
    }

    public deleteByGroupId(groupId: Entity.PK): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            DIContainer.get<GroupDB>(InjectType.GroupDB).transactionExec(async () => {
                let completed = 0
                const ids = this.libraryDao.getIdsByGroupId(groupId)
                for (const id in ids) {
                    this.delete(ids[id]).then(() => {
                        completed++
                        if (completed === ids.length) {
                            resolve()
                        }
                    }).catch(() => {
                        reject()
                        throw new Error('')
                    })
                }
            })
        })
    }

    /* 注意tarNextId可能为0, 所以groupId是为了再tarNextId为0的情况下找到要插入位置 */
    public changeOrder(curId: number, tarNextId: number, moveToGroupId: number): void {
        DIContainer.get<GroupDB>(InjectType.GroupDB).transactionExec(() => {
            const curGroupId = this.libraryDao.getGroupIdById(curId)
            const tarGroupId = tarNextId === 0 ? moveToGroupId : this.libraryDao.getGroupIdById(tarNextId)
            if (curGroupId === void 0 || tarGroupId === void 0) return // 如果curId或tarNextId不存在, 直接返回

            const curNextId = this.libraryDao.getNextIdById(curId)!
            // 自己移动到自己的位置, 直接返回, tarNextId可能为0, 每一个group都有一个0的library，所以还有验证groupId
            if (curNextId === tarNextId && curGroupId === tarGroupId) return

            this.removeNode(curId) // 把curId从原来的位置删除
            // 插入位置前驱的id，注意tarNextId可能为0
            const tarPrevId = this.libraryDao.getIdByGroupIdNextId(tarGroupId, tarNextId) ?? 0
            this.insertNode(curId, tarPrevId, tarNextId) // 把curId插入到新的位置

            if (curGroupId !== tarGroupId) {
                this.libraryDao.updateGroupIdById(curId, tarGroupId) // 修改curId的group_id为tarGroupId
            }
        })
    }

    private insertNode(id: Entity.PK, prevId: Entity.PK, nextId: Entity.PK): void {
        this.libraryDao.updatePrevIdNextIdById(id, prevId, nextId)
        this.libraryDao.updateNextIdById(prevId, id)
        this.libraryDao.updatePrevIdById(nextId, id)
    }

    private removeNode(id: Entity.PK): void {
        const [prevId, nextId] = this.libraryDao.getPrevIdNextIdById(id) ?? [0, 0]
        if (prevId) { this.libraryDao.updateNextIdById(prevId, nextId) }
        if (nextId) { this.libraryDao.updatePrevIdById(nextId, prevId) }
    }

    public exportLibrary(libraryId: number, exportDir: string): void {
        const libInfo = this.libraryDao.getLibraryById(libraryId)
        const groupId = this.libraryDao.getGroupIdById(libraryId)
        if (!libInfo || !groupId) {
            throw new Error(`Library ${libraryId} not found`)
        }
        const libExtra = this.libraryExtraDao.getLibraryExtraById(libraryId)
        const groupInfo = this.groupDao.getGroupById(groupId)

        const exportPath = path.join(exportDir,
            `Echo_${groupInfo?.name}-${libInfo.name}_${formatCurrentTime()}.zip`)
        const ops: zipperOperation[] = [
            {
                type: "String",
                source: JSON.stringify({ name: libInfo.name, intro: libExtra?.intro, }),
                data: { name: "desc.json" }
            },
            {
                type: "Dir",
                dirpath: appPaths.getLibraryDirPath(libraryId),
                destpath: false,
            }
        ]

        const worker = new Worker(path.join(__dirname, "worker/zipper.worker"))
        worker.postMessage({ exportPath: exportPath, ops: ops })
        worker.on('message', (result: Result) => {
            const notification = result.code
                ? new Notification({
                    title: `${libInfo.name} ${i18n.global.t('exportSuccess')}`,
                    body: i18n.global.t('exportSuccessOpenDir'),
                }).addListener('click', () => shell.showItemInFolder(exportPath))
                : new Notification({
                    title: `${libInfo.name} ${i18n.global.t('exportFailed')}`,
                    body: result.msg,
                })

            notification.show()
            worker.terminate()
        })
    }

    public importLibrary(GroupId: number, importFiles: string[]): void {
        const worker = new Worker(path.join(__dirname, "worker/unzipper.worker"))

        // 用于保存解压后的文件
        const tmpPath = appPaths.getImportLibraryTmpDirPath()
        const ops: unzipperOperation[] = [
            { type: 'read', entryName: 'desc.json' },
            { type: 'extract', entryName: 'library.db', tragetPath: tmpPath },
            { type: 'extract', entryName: 'images/', tragetPath: tmpPath },
        ]

        let importFileIdx = -1

        worker.postMessage({
            zipFilePath: importFiles[++importFileIdx],
            ops: ops
        })
        worker.on('message', (result: Result) => {
            try {
                // 解压失败
                if (result.code === 0) throw Error('unzip error')

                const opResults: Result[] = result.data

                // 没有取到desc.json, library.db
                if (opResults[0].code === 0 || opResults[1].code === 0) throw Error('error import file')

                const { name, intro } = JSON.parse(Buffer.from(opResults[0].data).toString('utf-8'))

                // 解析的数据不正确,错误的导入文件
                if (name === void 0 || intro === void 0) throw Error('error import file')

                // 数据提取后，再向数据库中插入数据s
                const id = this.create(name, GroupId)
                this.libraryExtraDao.update({
                    id: id,
                    use_auxiliary_st: 1,
                    auxiliary_st: '',
                    intro: intro,
                })

                // 移动 
                fs.renameSync(tmpPath, appPaths.getLibraryDirPath(id))

                new Notification({
                    title: `${i18n.global.t('importSuccess')}  (${importFileIdx + 1}/${importFiles.length})`,
                    body: path.basename(importFiles[importFileIdx])
                }).show()
            } catch (err: any) {

                new Notification({
                    title: `${i18n.global.t('importFailed')}  (${importFileIdx + 1}/${importFiles.length})`,
                    body: `${path.basename(importFiles[importFileIdx])}\n ${i18n.global.t('importFailedReason')}`
                }).show()
            }

            if (importFileIdx === importFiles.length - 1) {
                worker.terminate()
            } else {
                // 开始导入下一个文件
                worker.postMessage({
                    zipFilePath: importFiles[++importFileIdx],
                    ops: ops
                })
            }
        })
    }
}

export default LibraryService