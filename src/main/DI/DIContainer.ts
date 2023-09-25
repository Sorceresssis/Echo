import appConfig from "../app/config"
import 'reflect-metadata'
import { Container } from "inversify"
import DI_TYPES from "./DITypes"
import GroupDB from "../db/GroupDB"
import GroupDao from "../dao/GroupDao"
import LibraryDao from "../dao/LibraryDao"
import LibraryExtraDao from "../dao/LibraryExtraDao"
import GroupService from "../service/GroupService"
import LibraryService from "../service/LibraryService"
import AuthorDao from "../dao/AuthorDao"

const container = new Container()

// 单例的GroupDB
container.bind<GroupDB>(DI_TYPES.GroupDB).toConstantValue(new GroupDB(appConfig.getGroupDBFilePath()))

// GroupDao,LibraryDao,LibraryExtraDao依赖GroupDB
container.bind<GroupDao>(GroupDao).toSelf().inSingletonScope()
container.bind<LibraryDao>(LibraryDao).toSelf().inSingletonScope()
container.bind<LibraryExtraDao>(LibraryExtraDao).toSelf().inSingletonScope()

// GroupService,LibraryService依赖GroupDao,LibraryDao,LibraryExtraDao
container.bind<GroupService>(GroupService).toSelf().inSingletonScope()
container.bind<LibraryService>(LibraryService).toSelf().inSingletonScope()


container.bind<number>(DI_TYPES.LibraryId).toConstantValue(0)
// 依赖的LibraryDB是动态的，所以不能使用inSingletonScope
container.bind<AuthorDao>(AuthorDao).toSelf()


export default container