import 'reflect-metadata'
import { Container } from "inversify"
import InjectType from "./injectType"
import appPaths from "../app/appPaths"
import GroupDB from "../db/GroupDB"
import GroupDao from "../dao/GroupDao"
import LibraryDao from "../dao/LibraryDao"
import LibraryExtraDao from "../dao/LibraryExtraDao"
import GroupService from "../service/GroupService"
import LibraryService from "../service/LibraryService"

import AuthorDao from "../dao/AuthorDao"
import DirnameDao from "../dao/DirnameDao"
import RecordAuthorDao from "../dao/RecordAuthorDao"
import RecordAuthorRoleDao from '../dao/RecordAuthorRoleDao'
import RecordDao from "../dao/RecordDao"
import RecordExtraDao from "../dao/RecordExtraDao"
import RecordSeriesDao from "../dao/RecordSeriesDao"
import RecordTagDao from "../dao/RecordTagDao"
import RoleDao from '../dao/RoleDao'
import SeriesDao from "../dao/SeriesDao"
import TagDao from "../dao/TagDao"
import AutocompleteService from "../service/AutocompleteService"
import AuthorService from "../service/AuthorService"
import RoleService from '../service/RoleService'
import RecordService from "../service/RecordService"
import DirnameService from "../service/DirnameService"
import SeriesService from "../service/SeriesService"
import TagService from "../service/TagService"

import type LibraryDB from "../db/LibraryDB"

const container = new Container()

// 单例的GroupDB
container.bind<GroupDB>(InjectType.GroupDB).toConstantValue(new GroupDB(appPaths.getGroupDBFilePath()))

// GroupDao,LibraryDao,LibraryExtraDao依赖GroupDB
container.bind<GroupDao>(InjectType.GroupDao).to(GroupDao).inSingletonScope()
container.bind<LibraryDao>(InjectType.LibraryDao).to(LibraryDao).inSingletonScope()
container.bind<LibraryExtraDao>(InjectType.LibraryExtraDao).to(LibraryExtraDao).inSingletonScope()

// GroupService,LibraryService依赖GroupDao,LibraryDao,LibraryExtraDao
container.bind<GroupService>(InjectType.GroupService).to(GroupService).inSingletonScope()
container.bind<LibraryService>(InjectType.LibraryService).to(LibraryService).inSingletonScope()


export interface LibraryEnv {
    id: number,
    db: LibraryDB,
    genRecordImagesDirPathConstructor: ReturnType<typeof appPaths.genLibraryImagesDirPathConstructor>['genRecordImagesDirPathConstructor'],
    genAuthorImagesDirPathConstructor: ReturnType<typeof appPaths.genLibraryImagesDirPathConstructor>['genAuthorImagesDirPathConstructor'],
}

// 正在操作的Library
container.bind<LibraryEnv>(InjectType.LibraryEnv).toConstantValue({
    id: 0,
    db: null,
    recordImagesDirPathConstructor: null,
    authorImagesDirPathConstructor: null,
} as any)

// 依赖的LibraryDB是动态的，所以不能使用inSingletonScope
container.bind<RecordDao>(InjectType.RecordDao).to(RecordDao).inSingletonScope()
container.bind<RecordExtraDao>(InjectType.RecordExtraDao).to(RecordExtraDao).inSingletonScope()
container.bind<AuthorDao>(InjectType.AuthorDao).to(AuthorDao).inSingletonScope()
container.bind<RoleDao>(InjectType.RoleDao).to(RoleDao).inSingletonScope()
container.bind<RecordAuthorDao>(InjectType.RecordAuthorDao).to(RecordAuthorDao).inSingletonScope()
container.bind<RecordAuthorRoleDao>(InjectType.RecordAuthorRoleDao)
    .to(RecordAuthorRoleDao).inSingletonScope()
container.bind<DirnameDao>(InjectType.DirnameDao).to(DirnameDao).inSingletonScope()
container.bind<TagDao>(InjectType.TagDao).to(TagDao).inSingletonScope()
container.bind<RecordTagDao>(InjectType.RecordTagDao).to(RecordTagDao).inSingletonScope()
container.bind<SeriesDao>(InjectType.SeriesDao).to(SeriesDao).inSingletonScope()
container.bind<RecordSeriesDao>(InjectType.RecordSeriesDao).to(RecordSeriesDao).inSingletonScope()

// Service
container.bind<AutocompleteService>(InjectType.AutocompleteService).to(AutocompleteService).inSingletonScope()
container.bind<AuthorService>(InjectType.AuthorService).to(AuthorService).inSingletonScope()
container.bind<RoleService>(InjectType.RoleService).to(RoleService).inSingletonScope()
container.bind<RecordService>(InjectType.RecordService).to(RecordService).inSingletonScope()
container.bind<DirnameService>(InjectType.DirnameService).to(DirnameService).inSingletonScope()
container.bind<SeriesService>(InjectType.SeriesService).to(SeriesService).inSingletonScope()
container.bind<TagService>(InjectType.TagService).to(TagService).inSingletonScope()


export default container