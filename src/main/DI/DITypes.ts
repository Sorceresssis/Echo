import LibraryDB from "../db/LibraryDB"

const DI_TYPES = {
    GroupDB: Symbol('GroupDB'),
    GroupDao: Symbol('GroupDao'),
    LibraryDao: Symbol('LibraryDao'),
    LibraryExtraDao: Symbol('LibraryExtraDao'),
    GroupService: Symbol('GroupService'),
    LibraryService: Symbol('LibraryService'),

    Library: Symbol('Library'),
}

export type DILibrary = {
    id: number,
    dbConnection: LibraryDB,
}

export default DI_TYPES