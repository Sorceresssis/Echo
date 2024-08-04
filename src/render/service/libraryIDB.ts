import IndexedDB from "@/util/indexed_db";

class LibraryIDB {
    private static IDB_NAME = 'library';
    private static IDB_VERSION = 1;
    private static instance: LibraryIDB | undefined;

    private static STORE_NAME = 'library';

    private idb: IndexedDB;
    private isOpened = false;

    private constructor() {
        this.idb = new IndexedDB(LibraryIDB.IDB_NAME, LibraryIDB.IDB_VERSION)
    }

    public static getInstance() {
        if (!LibraryIDB.instance) {
            LibraryIDB.instance = new LibraryIDB()
        }
        return LibraryIDB.instance
    }

    public async open() {
        if (this.isOpened) return

        await this.idb.open(db => {
            db.createObjectStore('', {
                keyPath: 'id',
                autoIncrement: true
            })
            db.createObjectStore('', {
                keyPath: 'id',
                autoIncrement: true
            })
            db.createObjectStore('', {
                keyPath: 'id',
                autoIncrement: true
            })
        })
        this.isOpened = true
    }

    public close() {
        if (!this.isOpened) return
    }
}


export default LibraryIDB
