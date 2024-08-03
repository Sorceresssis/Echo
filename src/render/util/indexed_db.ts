class IndexedDB {
    private db: IDBDatabase | null = null
    public constructor(
        private dbName: string,
        private version: number = 1,
    ) {
    }

    public open(defineStore: (db: IDBDatabase) => any) {
        return new Promise((resolve, reject) => {
            const request = window.indexedDB.open(this.dbName, this.version);

            request.onsuccess = (event: Event) => {
                const db = (event.target as IDBOpenDBRequest).result
                this.db = db
                resolve(this)
            }

            request.onerror = (event: Event) => {
                reject(event)
            }

            request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
                const db = (event.target as IDBOpenDBRequest).result
                defineStore(db)
            };
        })
    }

    public async get<T>(storeName: string, key: string) {
        const transaction = this.db!.transaction([storeName], 'readonly');

    }
}


export default IndexedDB;