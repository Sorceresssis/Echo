import appConfig from "../app/config"
import 'reflect-metadata'
import { Container } from "inversify"
import DI_TYPES, { DILibrary } from "./DITypes"
import GroupDB from "../db/GroupDB"
import GroupDao from "../dao/GroupDao"
import LibraryDao from "../dao/LibraryDao"
import LibraryExtraDao from "../dao/LibraryExtraDao"
import GroupService from "../service/GroupService"
import LibraryService from "../service/LibraryService"
import AuthorDao from "../dao/AuthorDao"
import DirnameDao from "../dao/DirnameDao"
import RecordDao from "../dao/RecordDao"
import RecordAuthorDao from "../dao/RecordAuthorDao"
import RecordExtraDao from "../dao/RecordExtraDao"
import RecordSeriesDao from "../dao/RecordSeriesDao"
import RecordTagDao from "../dao/RecordTagDao"
import SeriesDao from "../dao/SeriesDao"
import TagDao from "../dao/TagDao"
import AuthorService from "../tmpService/AuthorService"
import RecordService from "../tmpService/RecordService"
import DirnameService from "../tmpService/DirnameService"
import SeriesService from "../tmpService/SeriesService"
import TagService from "../tmpService/TagService"

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



// 正在操作的Library
container.bind<DILibrary>(DI_TYPES.Library).toConstantValue({
    id: 0,
    dbConnection: null as any,
})

// 依赖的LibraryDB是动态的，所以不能使用inSingletonScope
container.bind<AuthorDao>(AuthorDao).toSelf().inSingletonScope()
container.bind<DirnameDao>(DirnameDao).toSelf().inSingletonScope()
container.bind<RecordDao>(RecordDao).toSelf().inSingletonScope()
container.bind<RecordAuthorDao>(RecordAuthorDao).toSelf().inSingletonScope()
container.bind<RecordExtraDao>(RecordExtraDao).toSelf().inSingletonScope()
container.bind<RecordSeriesDao>(RecordSeriesDao).toSelf().inSingletonScope()
container.bind<RecordTagDao>(RecordTagDao).toSelf().inSingletonScope()
container.bind<SeriesDao>(SeriesDao).toSelf().inSingletonScope()
container.bind<TagDao>(TagDao).toSelf().inSingletonScope()

// Service
container.bind<AuthorService>(AuthorService).toSelf().inSingletonScope()
container.bind<DirnameService>(DirnameService).toSelf().inSingletonScope()
container.bind<RecordService>(RecordService).toSelf().inSingletonScope()
container.bind<SeriesService>(SeriesService).toSelf().inSingletonScope()
container.bind<TagService>(TagService).toSelf().inSingletonScope()


export default container