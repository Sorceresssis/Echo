const InjectType = {
    userDataDirPathConstructor: Symbol('userDataDirPathConstructor'),

    GroupDB: Symbol('GroupDB'),
    GroupDao: Symbol('GroupDao'),
    LibraryDao: Symbol('LibraryDao'),
    LibraryExtraDao: Symbol('LibraryExtraDao'),
    GroupService: Symbol('GroupService'),
    LibraryService: Symbol('LibraryService'),

    LibraryEnv: Symbol('LibraryEnv'),

    AuthorDao: Symbol('AuthorDao'),
    DirnameDao: Symbol('DirnameDao'),
    RecordAuthorDao: Symbol('RecordAuthorDao'),
    RecordAuthorRoleDao: Symbol('RecordAuthorRoleDao'),
    RecordDao: Symbol('RecordDao'),
    RecordExtraDao: Symbol('RecordExtraDao'),
    RecordSeriesDao: Symbol('RecordSeriesDao'),
    RecordTagDao: Symbol('RecordTagDao'),
    RoleDao: Symbol('RoleDao'),
    SeriesDao: Symbol('SeriesDao'),
    TagDao: Symbol('TagDao'),

    AutocompleteService: Symbol('AutocompleteService'),
    AuthorService: Symbol('AuthorService'),
    DirnameService: Symbol('DirnameService'),
    RecordService: Symbol('RecordService'),
    SeriesService: Symbol('SeriesService'),
    TagService: Symbol('TagService'),
}

export default InjectType