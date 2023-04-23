import Sqlite from './Sqlite'
import { config } from './config'
import { mkdirsSync } from './checkDir'
import { log } from 'console';
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
    createTime?: string
    hasImage?: number
    hyperlink: string
    authorIDs: string
    authorNames: string
    tags: string
    folder_id: number
}

type filter = [
    boolean,
    boolean,
    boolean
]

export class DBLibrary {
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

    async getItems(getItemsOption: any): Promise<item[]> {
        // getItemsType: number,
        //TODO 文件存在但是读取错误，删除文件，重新创建
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



    _subquerySQL_Matched(matchedType: number, queryList: string[] | string[][]) {
        let SQL: string[] = []
        if (matchedType === 1) {

        } else {

        }
        `(SELECT item_id, SUM(sore) AS sumSore
        FROM
            (SELECT id AS item_id, 1 AS sore FROM item
            WHERE UPPER(title) LIKE UPPER('%a%') OR UPPER(title) LIKE UPPER('%b%') UNION ALL
            SELECT it.item_id, 0.5 AS sore FROM item_tag it JOIN tag t ON it.tag_id = t.id
            WHERE UPPER(t.title) LIKE UPPER('%a%') OR UPPER(t.title) LIKE UPPER('%b%') UNION ALL
            SELECT ia.item_id, 0.5 AS sore FROM item_author ia JOIN author a ON ia.author_id = a.id
            WHERE UPPER(a.name) LIKE UPPER('%a%') OR UPPER(a.name) LIKE UPPER('%b%'))
        GROUP BY item_id) matched`

        return ''
    }
    /**
     * 得到用户筛选的SQL
     * @param filterOption true为筛选false为不筛选
     * @returns filter SQL
     */
    _filterSQL_getItems(filterOption: boolean[]) {
        let filter: string[] = ['il_V.hyperlink IS NOT NULL', 'il_V.folder_id IS NOT NULL', 'il_V.hasImage = 1']
        let SQL: string[] = []
        for (let i = 0; i < filter.length; i++) {
            if (filterOption[i]) {
                SQL.push(filter[i])
            }
        }
        return SQL.join(' AND ')
    }

    /**
     * 有搜索词根据匹配程度排序，再根据用户指定的字段排序，没有搜索词就直接根据用户指定字段排序
     * @param hasQueryWord 是否有搜索词
     * @param field 优先排序字段 time:0 hit:2 title:1
     * @param isAscending 升降序
     * @returns OrderBY SQL
     */
    _orderSQL_getItems(hasQueryWord: boolean, field: number, isAscending: boolean) {
        let defaultOrderField: string[][] = [['il_V.id', ''], ['il_V.hits', ' DESC'], ['il_V.title', '']]
        let SQL: string[] = []
        if (hasQueryWord) { SQL.push('matched.sumSore DESC') }
        SQL.push(defaultOrderField[field][0] + (isAscending ? '' : ' DESC'))
        for (let i = 0; i < defaultOrderField.length; i++) {
            console.log('ORDER BY ' + SQL.join(', '));
            if (i != field) {
                SQL.push(defaultOrderField[i][0] + defaultOrderField[i][1])
            }
        }
        return 'ORDER BY ' + SQL.join(', ')
    }
}

export function checkImageDir(lilbraryID: number) {
    mkdirsSync(path.resolve(config.userDataPath, `image/${lilbraryID}/authorProfile`))
    mkdirsSync(path.resolve(config.userDataPath, `image/${lilbraryID}/coverImage`))
}