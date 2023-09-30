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
import AutocompleteService from "../service/AutocompleteService"
import AuthorService from "../service/AuthorService"
import RecordService from "../service/RecordService"
import DirnameService from "../service/DirnameService"
import SeriesService from "../service/SeriesService"
import TagService from "../service/TagService"

const container = new Container()

// 单例的GroupDB
container.bind<GroupDB>(DI_TYPES.GroupDB).toConstantValue(new GroupDB(appConfig.getGroupDBFilePath()))

// GroupDao,LibraryDao,LibraryExtraDao依赖GroupDB
container.bind<GroupDao>(DI_TYPES.GroupDao).to(GroupDao).inSingletonScope()
container.bind<LibraryDao>(DI_TYPES.LibraryDao).to(LibraryDao).inSingletonScope()
container.bind<LibraryExtraDao>(DI_TYPES.LibraryExtraDao).to(LibraryExtraDao).inSingletonScope()

// GroupService,LibraryService依赖GroupDao,LibraryDao,LibraryExtraDao
container.bind<GroupService>(DI_TYPES.GroupService).to(GroupService).inSingletonScope()
container.bind<LibraryService>(DI_TYPES.LibraryService).to(LibraryService).inSingletonScope()



// 正在操作的Library
container.bind<DILibrary>(DI_TYPES.Library).toConstantValue({
    id: 0,
    dbConnection: null as any,
})

// 依赖的LibraryDB是动态的，所以不能使用inSingletonScope
container.bind<AuthorDao>(DI_TYPES.AuthorDao).to(AuthorDao).inSingletonScope()
container.bind<DirnameDao>(DI_TYPES.DirnameDao).to(DirnameDao).inSingletonScope()
container.bind<RecordDao>(DI_TYPES.RecordDao).to(RecordDao).inSingletonScope()
container.bind<RecordAuthorDao>(DI_TYPES.RecordAuthorDao).to(RecordAuthorDao).inSingletonScope()
container.bind<RecordExtraDao>(DI_TYPES.RecordExtraDao).to(RecordExtraDao).inSingletonScope()
container.bind<RecordSeriesDao>(DI_TYPES.RecordSeriesDao).to(RecordSeriesDao).inSingletonScope()
container.bind<RecordTagDao>(DI_TYPES.RecordTagDao).to(RecordTagDao).inSingletonScope()
container.bind<SeriesDao>(DI_TYPES.SeriesDao).to(SeriesDao).inSingletonScope()
container.bind<TagDao>(DI_TYPES.TagDao).to(TagDao).inSingletonScope()

// Service
container.bind<AutocompleteService>(DI_TYPES.AutocompleteService).to(AutocompleteService).inSingletonScope()
container.bind<AuthorService>(DI_TYPES.AuthorService).to(AuthorService).inSingletonScope()
container.bind<RecordService>(DI_TYPES.RecordService).to(RecordService).inSingletonScope()
container.bind<DirnameService>(DI_TYPES.DirnameService).to(DirnameService).inSingletonScope()
container.bind<SeriesService>(DI_TYPES.SeriesService).to(SeriesService).inSingletonScope()
container.bind<TagService>(DI_TYPES.TagService).to(TagService).inSingletonScope()


export default container