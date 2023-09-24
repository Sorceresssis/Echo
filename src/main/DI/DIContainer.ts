import { Container } from "inversify"
import TYPES from "./types"
import appConfig from "../app/config"
import GroupDB from "../db/GroupDB"
import GroupDao from "../dao/GroupDao"
import LibraryDao from "../dao/LibraryDao"
import GroupService from "../service/GroupService"
import LibraryService from "../service/LibraryService"
import LibraryExtraDao from "../dao/LibraryExtraDao"

const container = new Container()

// 单例的GroupDB
container.bind<GroupDB>(TYPES.GroupDB).toConstantValue(new GroupDB(appConfig.getGroupDBFilePath()))

// GroupDao,LibraryDao,LibraryExtraDao依赖GroupDB
container.bind<GroupDao>(GroupDao).toSelf().inSingletonScope()
container.bind<LibraryDao>(LibraryDao).toSelf().inSingletonScope()
container.bind<LibraryExtraDao>(LibraryExtraDao).toSelf().inSingletonScope()

// GroupService,LibraryService依赖GroupDao,LibraryDao,LibraryExtraDao
container.bind<GroupService>(GroupService).toSelf().inSingletonScope()
container.bind<LibraryService>(LibraryService).toSelf().inSingletonScope()


// container.get(TYPES.GroupDB)
// container.rebind(TYPES.LibraryDB).toConstantValue()
// LIbraryDB 不能加inSingletonScope,

export default container