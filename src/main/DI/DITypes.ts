import LibraryDB from "../db/LibraryDB"

const DI_TYPES = {
    GroupDB: Symbol('GroupDB'),

    Library: Symbol('Library'),
}

export type DILibrary = {
    id: number,
    dbConnection: LibraryDB,
}

export default DI_TYPES