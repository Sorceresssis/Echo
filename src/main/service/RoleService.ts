import { injectable, inject } from "inversify"
import InjectType from "../provider/injectType"
import { type LibraryEnv } from "../provider/container"
import type RoleDao from "../dao/RoleDao"
import type RecordAuthorRoleDao from "../dao/RecordAuthorRoleDao"
import ResponseResult from "../pojo/ResponseResult"

@injectable()
class RoleService {
    public constructor(
        @inject(InjectType.LibraryEnv) private libEnv: LibraryEnv,
        @inject(InjectType.RoleDao) private roleDao: RoleDao,
        @inject(InjectType.RecordAuthorRoleDao) private recordAuthorRoleDao: RecordAuthorRoleDao
    ) { }

    public queryRoles(): VO.Role[] {
        return this.roleDao.queryRoles()
    }

    public createRole(name: string): DTO.ResponseResult<VO.Role> {
        name = name.trim()
        if (name === '') {
            return ResponseResult.error('role name cannot be empty')
        }
        const existingRole = this.roleDao.queryIdByName(name)
        if (existingRole) {
            return ResponseResult.error('role name already exists')
        }
        const id = this.roleDao.insert(name)
        return ResponseResult.success({ id, name })
    }

    public editRole(id: number, name: string): void {
        name = name.trim()
        if (name === '') throw new Error('role name cannot be empty')
        const existingRole = this.roleDao.queryIdByName(name)
        this.libEnv.db.transactionExec(() => {
            if (existingRole && existingRole !== id) {
                this.recordAuthorRoleDao.updateRoleIdByRoleId(id, existingRole)
                this.roleDao.delete(id)
            } else {
                this.roleDao.update(id, name)
            }
        })
    }

    public deleteRole(id: number): void {
        this.libEnv.db.transactionExec(() => {
            this.roleDao.delete(id)
            this.recordAuthorRoleDao.deleteByRoleId(id)
        })
    }
}


export default RoleService