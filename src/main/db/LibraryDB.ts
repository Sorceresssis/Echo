import DB from "./DB"
import fs from "fs"

export default class LibraryDB extends DB {
    public constructor(path: string) {
        if (fs.existsSync(path)) {
            super(path)
        } else {
            super(path)
            this.createTable()
        }
    }

    private createTable(): void {

    }
}