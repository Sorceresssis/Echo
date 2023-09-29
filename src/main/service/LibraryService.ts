import fs from "fs"
import appConfig from "../app/config"
import { injectable, inject } from "inversify"
import DIContainer from "../DI/DIContainer"
import DI_TYPES from "../DI/DITypes"
import GroupDB from "../db/GroupDB"
import LibraryDao from "../dao/LibraryDao"
import LibraryExtraDao from "../dao/LibraryExtraDao"


@injectable()
class LibraryService {
	private libraryDao: LibraryDao
	private libraryExtraDao: LibraryExtraDao

	public constructor(
		@inject(DI_TYPES.LibraryDao) libraryDao: LibraryDao,
		@inject(DI_TYPES.LibraryExtraDao) libraryExtraDao: LibraryExtraDao,
	) {
		this.libraryDao = libraryDao
		this.libraryExtraDao = libraryExtraDao
	}

	public queryLibraryDetail(id: number): VO.LibraryDetail | undefined {
		const lib = this.libraryDao.queryLibraryById(id) as VO.LibraryDetail | undefined
		if (lib) {
			const extra = this.libraryExtraDao.queryLibraryExtraById(id) as Entity.LibraryExtra
			lib.useAuxiliarySt = extra.useAuxiliarySt ? true : false // 把1,0转换为true, false
			lib.auxiliarySt = extra.auxiliarySt
			lib.intro = extra.intro
		}
		return lib
	}

	public querySortedLibrarysByGroupId(groupId: number): VO.LibraryProfile[] {
		const librarys = this.libraryDao.querySortedLibrarysByGroupId(groupId) as VO.LibraryProfile[]
		librarys.forEach(l => l.dataPath = appConfig.getLibraryDirPath(l.id))
		return librarys
	}

	public rename(id: number, name: string): boolean {
		return this.libraryDao.updateLibraryName(id, name) > 0
	}

	public editLibraryExtra(data: DTO.LibraryExtraForm): boolean {
		return this.libraryExtraDao.updateLibraryExtra(data) > 0
	}

	public create(name: string, groupId: number): void {
		DIContainer.get<GroupDB>(DI_TYPES.GroupDB).transaction(() => {
			const headId = this.libraryDao.queryLibraryIdByGroupIdPrevId(groupId, 0)
			const id = this.libraryDao.insertLibrary(name, groupId)
			if (headId !== void 0) { this.insertNode(id, 0, headId) }
			// 创建library_extra记录
			this.libraryExtraDao.insertLibraryExtra({
				id: id,
				auxiliarySt: '',
				useAuxiliarySt: 1,
				intro: '',
			})
		})
	}

	public delete(id: number): void {
		DIContainer.get<GroupDB>(DI_TYPES.GroupDB).transaction(() => {
			this.removeNode(id) // 断开链接
			this.libraryDao.deleteLibraryById(id) // 删除library记录
			this.libraryExtraDao.deleteLibraryExtraById(id) // 删除library_extra记录
			this.deleteFileData(id) // 删除文件数据
		})
	}

	public deleteByGroupId(groupId: number): void {
		DIContainer.get<GroupDB>(DI_TYPES.GroupDB).transaction(() => {
			this.libraryDao.queryLibraryIdsByGroupId(groupId).forEach(LibId => {
				// 由于是全部删除，所以不需要断开链接
				this.libraryDao.deleteLibraryById(LibId) // 删除library记录
				this.libraryExtraDao.deleteLibraryExtraById(LibId) // 删除library_extra记录
				this.deleteFileData(LibId) // 删除文件数据
			})
		})
	}

	/* 注意tarNextId可能为0, 所以groupId是为了再tarNextId为0的情况下找到要插入位置 */
	public sort(curId: number, tarNextId: number, moveToGroupId: number): void {
		DIContainer.get<GroupDB>(DI_TYPES.GroupDB).transaction(() => {
			const curGroupId = this.libraryDao.queryLibraryGroupIdById(curId)
			const tarGroupId = tarNextId === 0 ? moveToGroupId : this.libraryDao.queryLibraryGroupIdById(tarNextId)
			if (curGroupId === void 0 || tarGroupId === void 0) return // 如果curId或tarNextId不存在, 直接返回

			const curNextId = this.libraryDao.queryLibraryNextIdById(curId)!
			// 自己移动到自己的位置, 直接返回, tarNextId可能为0, 每一个group都有一个0的library，所以还有验证groupId
			if (curNextId === tarNextId && curGroupId === tarGroupId) return

			this.removeNode(curId) // 把curId从原来的位置删除
			// 插入位置前驱的id，注意tarNextId可能为0
			const tarPrevId = this.libraryDao.queryLibraryIdByGroupIdNextId(tarGroupId, tarNextId) || 0
			this.insertNode(curId, tarPrevId, tarNextId) // 把curId插入到新的位置

			if (curGroupId !== tarGroupId) {
				this.libraryDao.updateLibraryGroupId(curId, tarGroupId) // 修改curId的group_id为tarGroupId
			}
		})
	}

	private insertNode(id: PrimaryKey, prevId: PrimaryKey, nextId: PrimaryKey): void {
		this.libraryDao.updateLibraryPrevIdNextId(id, prevId, nextId)
		this.libraryDao.updateLibraryNextId(prevId, id)
		this.libraryDao.updateLibraryPrevId(nextId, id)
	}

	private removeNode(id: PrimaryKey): void {
		const [prevId, nextId] = this.libraryDao.queryLibraryPrevIdNextIdById(id) || [0, 0]
		if (prevId) { this.libraryDao.updateLibraryNextId(prevId, nextId) }
		if (nextId) { this.libraryDao.updateLibraryPrevId(nextId, prevId) }
	}

	private deleteFileData(id: number): void {
		const dataPath = appConfig.getLibraryDirPath(id)
		if (fs.existsSync(dataPath)) {
			fs.rmSync(dataPath, { recursive: true })
		}
	}
}

export default LibraryService