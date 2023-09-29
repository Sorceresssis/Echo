import LibraryDB from "../db/LibraryDB"

const DI_TYPES = {
    GroupDB: Symbol('GroupDB'),
    GroupDao: Symbol('GroupDao'),
    LibraryDao: Symbol('LibraryDao'),
    LibraryExtraDao: Symbol('LibraryExtraDao'),
    GroupService: Symbol('GroupService'),
    LibraryService: Symbol('LibraryService'),

    Library: Symbol('Library'),
    AuthorDao: Symbol('AuthorDao'),
    DirnameDao: Symbol('DirnameDao'),
    RecordDao: Symbol('RecordDao'),
    RecordAuthorDao: Symbol('RecordAuthorDao'),
    RecordExtraDao: Symbol('RecordExtraDao'),
    RecordSeriesDao: Symbol('RecordSeriesDao'),
    RecordTagDao: Symbol('RecordTagDao'),
    SeriesDao: Symbol('SeriesDao'),
    TagDao: Symbol('TagDao'),
    AuthorService: Symbol('AuthorService'),
    DirnameService: Symbol('DirnameService'),
    RecordService: Symbol('RecordService'),
    SeriesService: Symbol('SeriesService'),
    TagService: Symbol('TagService'),
}

export type DILibrary = {
    id: number,
    dbConnection: LibraryDB,
}

export default DI_TYPES