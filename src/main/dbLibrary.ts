import Sqlite from './Sqlite'
import { config } from './config'
import { mkdirsSync } from './checkDir'
const path = require('path');
const fs = require('fs')


enum Attribute {
    // ALL 不包含folder_path
    item_title, author_name, tag_title, folder_path, All
}

interface item {
    id: number
    title: string
    isFav: number
    hyperlink: string
    flieName: string
    folder_id: number
    tags: string
    authorsID: string
    authors: string
}

export class DBLibrary {
    static tables: string[] = ["item", "author", "tag", "folder"]
    static fields: string[] = ["item_title", "author_name", "tag_title", "folder_path"]
    dbLibrary: Sqlite | any

    constructor(filePath: string) {
        this.dbLibrary = new Sqlite()
        if (!fs.existsSync(filePath)) {
            this.createDBLibrary(filePath)
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
                item_clicks INT DEFAULT 0,
                item_hasImage BOOLEAN DEFAULT 0,
                item_isFav BOOLEAN DEFAULT 0,
                item_hyperlink TEXT,
                item_flieName TEXT,
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

    // 提供搜索建议和给用户提供信息列表
    async getAttribute(attribute: number, pageno: number, pagesize: number, filterWords: string[]): Promise<string[]> {
        // 转化CASE WHEN UPPER( author_name ) LIKE UPPER( '%filterWord%' ) THEN 1 ELSE 0 END
        let a = `CASE WHEN UPPER( item_title ) LIKE UPPER( '%a%' ) THEN 1 ELSE 0 END`

        if (attribute == Attribute.All) {

        } else {

        }
        return await this.dbLibrary.all(`SELECT tag_title as suggest FROM tag;`)
    }

    async getItems(u: string, title: string, author: string, tag: string, ascending: number): Promise<item[]> {
        //TODO 检查文件夹image/1/authorProfile coverimage
        return await this.dbLibrary.all(`SELECT t1.item_id AS id, t1.item_title AS title, t1.item_isFav AS isFav,
        t1.item_hyperlink AS hyperlink, t1.item_flieName AS flieName, t1.folder_id AS folder_id,
        GROUP_CONCAT(DISTINCT t3.tag_title) AS tags,t4.authorsID AS authorsID, t4.authors AS authors
    FROM
        item t1
        LEFT JOIN item_tag t2 ON t1.item_id = t2.item_id
        LEFT JOIN tag t3 ON t2.tag_id = t3.tag_id
        LEFT JOIN (SELECT t1.item_id,GROUP_CONCAT(t2.author_id) AS authorsID, GROUP_CONCAT(t2.author_name) AS authors
            FROM item_author t1 JOIN author t2 ON t1.author_id = t2.author_id GROUP BY t1.item_id) t4 ON t1.item_id = t4.item_id
    GROUP BY t1.item_id
    LIMIT 0 ,100;`)
    }

    async getItemsByAuthor(authorID: number) {

    }

    async getItemsOfNoAuthor() {
        `SELECT t1.item_id AS id, t1.item_title AS title, t1.item_isFav AS isFav,
            t1.item_hyperlink AS hyperlink, t1.item_flieName AS flieName, t1.folder_id AS folder_id,
            GROUP_CONCAT(DISTINCT t3.tag_title) AS tags,t4.authorsID AS authorsID, t4.authors AS authors
        FROM
        item t1
        LEFT JOIN item_tag t2 ON t1.item_id = t2.item_id
        LEFT JOIN tag t3 ON t2.tag_id = t3.tag_id
        LEFT JOIN (SELECT t1.item_id,GROUP_CONCAT(t2.author_id) AS authorsID, GROUP_CONCAT(t2.author_name) AS authors
            FROM item_author t1 JOIN author t2 ON t1.author_id = t2.author_id GROUP BY t1.item_id) t4 ON t1.item_id = t4.item_id
        WHERE t4.authors IS NULL
        GROUP BY t1.item_id;`;
        `SELECT t1.item_id AS id, t1.item_title AS title, t1.item_isFav AS isFav,
        t1.item_hyperlink AS hyperlink, t1.item_flieName AS flieName, t1.folder_id AS folder_id,
        GROUP_CONCAT(DISTINCT t3.tag_title) AS tags,t4.authorsID AS authorsID, t4.authors AS authors
    FROM
        (SELECT item_id, SUM(sore) AS sumSore
        FROM
            (SELECT item_id, 2 AS sore FROM item
            WHERE UPPER(item_title) LIKE UPPER('%a%') OR UPPER(item_title) LIKE UPPER('%俄%') UNION ALL
            SELECT t1.item_id, 1 AS sore FROM item_tag t1 JOIN tag t2 ON t1.tag_id = t2.tag_id
            WHERE UPPER(t2.tag_title) LIKE UPPER('%a%') OR UPPER(t2.tag_title) LIKE UPPER('%鬼%') UNION ALL
            SELECT t1.item_id, 1 AS sore FROM item_author t1 JOIN author t2 ON t1.author_id = t2.author_id
            WHERE UPPER(t2.author_name) LIKE UPPER('%a%') OR UPPER(t2.author_name) LIKE UPPER('%鬼%'))
        GROUP BY item_id) t0
        JOIN item t1 ON t0.item_id = t1.item_id
        LEFT JOIN item_tag t2 ON t1.item_id = t2.item_id
        LEFT JOIN tag t3 ON t2.tag_id = t3.tag_id
        LEFT JOIN (SELECT t1.item_id,GROUP_CONCAT(t2.author_id) AS authorsID, GROUP_CONCAT(t2.author_name) AS authors
            FROM item_author t1 JOIN author t2 ON t1.author_id = t2.author_id GROUP BY t1.item_id) t4 ON t1.item_id = t4.item_id
    WHERE t4.authors IS NULL
    GROUP BY t1.item_id
    ORDER BY t0.sumSore DESC;`
    }

    async getAuthorList() {

    }

    filterSqlGetItems() {

    }
}

export function checkImageDir(lilbraryID: number) {
    mkdirsSync(path.resolve(config.userDataPath, `image/${lilbraryID}/authorProfile`))
    mkdirsSync(path.resolve(config.userDataPath, `image/${lilbraryID}/coverImage`))
}