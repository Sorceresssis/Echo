import { injectable, inject } from "inversify"
import InjectType from "../provider/injectType"
import DIContainer from "../provider/container"
import type GroupDB from "../db/GroupDB"
import type GroupDao from "../dao/GroupDao"
import type LibraryService from "./LibraryService"

@injectable()
class GroupService {
    public constructor(
        @inject(InjectType.GroupDao) private groupDao: GroupDao,
        @inject(InjectType.LibraryService) private libraryService: LibraryService,
    ) { }

    public queryGroups(): VO.Group[] {
        const groups = this.groupDao.getGroupsSorted() as VO.Group[]
        groups.forEach(group => {
            group.librarys = this.libraryService.querySortedLibrarysByGroupId(group.id)
        })
        return groups
    }

    public rename(id: Entity.PK, name: string): boolean {
        return this.groupDao.updateNameById(id, name) > 0
    }

    public create(name: string): void {
        DIContainer.get<GroupDB>(InjectType.GroupDB).transactionExec(() => {
            // 获取第一位group的id
            const headId = this.groupDao.getIdByPrevId(0)
            // 新插入Group的prevId和nextId都默认为0，所以要先查询有没有第一位group。
            const id = this.groupDao.insert(name)
            // 如果headId存在, 把新添加的group的作为新的链表的头
            if (headId !== void 0) { this.insertNode(id, 0, headId) }
        })
    }

    public delete(id: Entity.PK): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            DIContainer.get<GroupDB>(InjectType.GroupDB).transactionExec(() => {
                this.removeNode(id) // 先删除链接关系
                this.groupDao.deleteById(id) // 删除group记录
                // 删除group下的所有library
                this.libraryService.deleteByGroupId(id).then(() => {
                    resolve()
                }).catch(() => {
                    reject()
                    throw new Error()
                })
            })
        })
    }

    public changeOrder(curId: Entity.PK, tarNextId: Entity.PK) {
        const curNextId = this.groupDao.getNextIdById(curId)
        // 要移动到的位置和当前位置相同，不需要移动，而且会导致死循环
        if (curNextId === void 0 || curNextId === tarNextId) return

        DIContainer.get<GroupDB>(InjectType.GroupDB).transactionExec(() => {
            this.removeNode(curId)
            // 一定是先把要移动的节点链接删除然后再去查询tarPrevId，因为可能要移动到原来的位置。这样会导致要移动的nextId指向自己
            // tarNextId可能为0，表示要移到最后
            const tarPrevId = this.groupDao.getIdByNextId(tarNextId) ?? 0
            this.insertNode(curId, tarPrevId, tarNextId)
        })
    }

    private insertNode(id: Entity.PK, prevId: Entity.PK, nextId: Entity.PK): void {
        // 1. 修改新节点的前驱节点为prevId, 后继节点nextId
        this.groupDao.updatePrevIdNextIdById(id, prevId, nextId)
        // 2. 把新节点的前驱节点的nextId 指向新节点
        this.groupDao.updateNextIdById(prevId, id)
        // 3. 把新节点的后继节点的prevId 指向新节点
        this.groupDao.updatePrevIdById(nextId, id)
    }

    private removeNode(id: Entity.PK): void {
        // 1. 获取被删除节点的前驱节点和后继节点
        const [prevId, nextId] = this.groupDao.getPrevIdNextIdById(id) ?? [0, 0]
        // 2. 当prevId不为0, 修改前驱节点的nextId 为后继节点的id
        if (prevId) { this.groupDao.updateNextIdById(prevId, nextId) }
        // 3. 当nextId不为0, 修改后继节点的prevId 为前驱节点的id
        if (nextId) { this.groupDao.updatePrevIdById(nextId, prevId) }
    }
}

export default GroupService