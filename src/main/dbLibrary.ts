import Sqlite from './Sqlite'
import { StringBuffer } from './StringBuffer'
const fs = require('fs')


enum Attribute {
    // ALL 不包含folder_path
    item_title, author_name, tag_title, folder_path, All
}

interface item {
    id: number,
    title: string
    authors: ""
    tags: ""
    coverImage: ""
}

export class DBLibrary {
    static tables: string[] = ["item", "author", "tag", "folder"]
    static fields: string[] = ["item_title", "author_name", "tag_title", "folder_path"]
    dbLibrary: any

    constructor(filePath: string) {
        this.dbLibrary = new Sqlite()
        if (!fs.existsSync(filePath)) {
            this.dbLibrary.createDBLibrary(filePath)
        }
        else {
            this.dbLibrary.connect(filePath)
        }
    }
    async createDBLibrary(filePath: string) {
        this.dbLibrary.connect(filePath)
        await this.dbLibrary.exec(`
            CREATE TABLE item(
                item_id INTEGER PRIMARY KEY AUTOINCREMENT,
                item_title VARCHAR(255) NOT NULL,
                item_flieName TEXT,
                item_hyperlink TEXT,
                item_clicks INT DEFAULT 0,
                item_date DATETIME,
                item_isFav BOOLEAN DEFAULT 0,
                folder_id INTEGER); 
            CREATE TABLE item_detail(
                item_id INTEGER NOT NULL,
                item_intro TEXT,
                item_info TEXT);
            CREATE TABLE folder(
                folder_id INTEGER PRIMARY KEY AUTOINCREMENT,
                folder_path TEXT NOT NULL UNIQUE);
            CREATE TABLE tag(
                tag_id INTEGER PRIMARY KEY AUTOINCREMENT,
                tag_title VARCHAR(255) NOT NULL UNIQUE);
            CREATE TABLE item_tag(
                item_id INTEGER NOT NULL,
                tag_id INTEGER NOT NULL,
                UNIQUE(item_id, tag_id));
            CREATE TABLE author(
                author_id INTEGER PRIMARY KEY AUTOINCREMENT,
                author_name VARCHAR(255) NOT NULL UNIQUE,
                author_intro text);
            CREATE TABLE item_author(
                item_id INTEGER NOT NULL,
                author_id INTEGER NOT NULL,
                UNIQUE(item_id, author_id));`)
    }

    async getItems(lilbraryID: number, u: string[], title: string[], author: string[], tag: string[], ascending: number): Promise<item[]> {


        return []
    }
    async getAttribute(attribute: number, pageno: number, pagesize: number, filterWords: string[]): Promise<string[]> {
        // 转化CASE WHEN UPPER( author_name ) LIKE UPPER( '%filterWord%' ) THEN 1 ELSE 0 END
        let filterSQL: StringBuffer = new StringBuffer()
        filterSQL.append(`CASE WHEN UPPER( item_title ) LIKE UPPER( '%a%' ) THEN 1 ELSE 0 END`)

        if (attribute == Attribute.All) {

        } else {

        }
        return await this.dbLibrary.all(`SELECT tag_title as suggest FROM tag;`)
    }



}