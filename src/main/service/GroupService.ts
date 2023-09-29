import { injectable, inject } from "inversify"
import DIContainer from "../DI/DIContainer"
import DI_TYPES from "../DI/DITypes"
import GroupDB from "../db/GroupDB"
import GroupDao from "../dao/GroupDao"
import LibraryService from "./LibraryService"

@injectable()
class GroupService {
    public constructor(
        @inject(DI_TYPES.GroupDao) private groupDao: GroupDao,
        @inject(DI_TYPES.LibraryService) private libraryService: LibraryService,
    ) {
    }

    public queryGroups(): VO.Group[] {
        const gs = this.groupDao.querySortedGroupAll() as VO.Group[]
        gs.forEach(g => g.librarys = this.libraryService.querySortedLibrarysByGroupId(g.id))
        return gs
    }

    public rename(id: number, name: string): boolean {
        return this.groupDao.updateGroupName(id, name) > 0
    }

    public create(name: string): void {
        DIContainer.get<GroupDB>(DI_TYPES.GroupDB).transaction(() => {
            // 获取第一位group的id
            const headId = this.groupDao.queryGroupIdByPrevId(0)
            // 新插入Group的prevId和nextId都默认为0，所以要先查询有没有第一位group。
            const id = this.groupDao.insertGroup(name)
            // 如果headId存在, 把新添加的group的作为新的链表的头
            if (headId !== void 0) { this.insertNode(id, 0, headId) }
        })
    }

    public delete(id: number): void {
        DIContainer.get<GroupDB>(DI_TYPES.GroupDB).transaction(() => {
            this.removeNode(id) // 先删除链接关系
            this.groupDao.deleteGroupById(id) // 删除group记录
            this.libraryService.deleteByGroupId(id) // 删除group下的所有library
        })
    }

    public sort(curId: number, tarNextId: number) {
        const curNextId = this.groupDao.queryGroupNextIdById(curId)
        // 要移动到的位置和当前位置相同，不需要移动，而且会导致死循环
        if (curNextId === void 0 || curNextId === tarNextId) return

        DIContainer.get<GroupDB>(DI_TYPES.GroupDB).transaction(() => {
            this.removeNode(curId)
            // tarNextId可能为0，表示要移到最后
            const tarPrevId = this.groupDao.queryGroupIdByNextId(tarNextId) || 0
            this.insertNode(curId, tarPrevId, tarNextId)
        })
    }

    private insertNode(id: PrimaryKey, prevId: PrimaryKey, nextId: PrimaryKey): void {
        // 1. 修改新节点的前驱节点为prevId, 后继节点nextId
        this.groupDao.updateGroupPrevIdNextId(id, prevId, nextId)
        // 2. 把新节点的前驱节点的nextId 指向新节点
        this.groupDao.updateGroupNextId(prevId, id)
        // 3. 把新节点的后继节点的prevId 指向新节点
        this.groupDao.updateGroupPrevId(nextId, id)
    }

    private removeNode(id: PrimaryKey): void {
        // 1. 获取被删除节点的前驱节点和后继节点
        const [prevId, nextId] = this.groupDao.queryGroupPrevIdNextIdById(id) || [0, 0]
        // 2. 当prevId不为0修改前驱节点的nextId 为后继节点的id
        if (prevId) { this.groupDao.updateGroupNextId(prevId, nextId) }
        // 3. 当nextId不为0修改后继节点的prevId 为前驱节点的id
        if (nextId) { this.groupDao.updateGroupPrevId(nextId, prevId) }
    }
}

export default GroupService