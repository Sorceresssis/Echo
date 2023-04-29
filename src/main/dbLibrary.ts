import Sqlite from './Sqlite'
import { config } from './config'
import { mkdirsSync } from './checkDir'
import { StepInstance } from 'element-plus';
const path = require('path');
const fs = require('fs')


enum getItemsType { common = 0, noAuthor, byAuthor, ofFav }
enum queryType { noQuery = 0, commonQuery, advancedQuery }
// ALL 不包含Folder
enum getAttributeType { ITEM_TITLE = 0, AUTHOR_NAME, TAG_TITLE, FOLDER_PATH, ALL }

export class DBLibrary {
    dbLibrary: Sqlite

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
            CREATE TABLE item( id INTEGER PRIMARY KEY AUTOINCREMENT, title VARCHAR(255) NOT NULL, createTime DATETIME NOT NULL DEFAULT(DATETIME(CURRENT_TIMESTAMP, 'localtime')), hits INT DEFAULT 0, hasImage BOOLEAN DEFAULT 0, isFav BOOLEAN DEFAULT 0, hyperlink TEXT, folder_id INTEGER);
            CREATE TABLE item_detail( id INTEGER NOT NULL, flieName TEXT, intro TEXT, info TEXT );
            CREATE TABLE folder( id INTEGER PRIMARY KEY AUTOINCREMENT, path TEXT NOT NULL UNIQUE );
            CREATE TABLE tag( id INTEGER PRIMARY KEY AUTOINCREMENT, title VARCHAR(255) NOT NULL UNIQUE );
            CREATE TABLE item_tag( item_id INTEGER NOT NULL, tag_id INTEGER NOT NULL, UNIQUE(item_id, tag_id) );
            CREATE TABLE author( id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255) NOT NULL, intro TEXT );
            CREATE TABLE item_author( item_id INTEGER NOT NULL, author_id INTEGER NOT NULL, UNIQUE(item_id, author_id) );
            CREATE TABLE series( id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255) NOT NULL );
            CREATE TABLE item_series( item_id INTEGER NOT NULL, series_id INTEGER NOT NULL, UNIQUE(item_id, series_id) );
            CREATE INDEX item__hits_INDEX ON item(hits);
            CREATE INDEX item__hyperlink_INDEX ON item(hyperlink);
            CREATE INDEX item__hasImage_INDEX ON item(hasImage);
            CREATE INDEX item__folder_id_INDEX ON item(folder_id);
            CREATE INDEX item_detail__id_INDEX ON item_detail(id);
            CREATE INDEX item_author__item_id_INDEX ON item_author(item_id);
            CREATE INDEX item_author__author_id_INDEX ON item_author(author_id);
            CREATE INDEX item_tag__item_id_INDEX ON item_tag(item_id);
            CREATE INDEX item_tag__tag_id_INDEX ON item_tag(tag_id);
            CREATE INDEX item_series__item_id_INDEX ON item_series(item_id);
            CREATE INDEX item_series__series_id_INDEX ON item_series(series_id);
            CREATE VIEW allAuthorsOfItem_VIEW AS SELECT ia.item_id, GROUP_CONCAT( a.id) AS authorIDs, GROUP_CONCAT( a.name ) AS authorNames FROM item_author ia JOIN author a ON ia.author_id = a.id GROUP BY ia.item_id;
            CREATE VIEW itemList_VIEW AS SELECT i.*, aaoi_V.authorIDs, aaoi_V.authorNames, GROUP_CONCAT(DISTINCT t.title) AS tags FROM item i LEFT JOIN allAuthorsOfItem_VIEW aaoi_V ON i.id = aaoi_V.item_id LEFT JOIN item_tag it ON i.id = it.item_id LEFT JOIN tag t ON it.tag_id = t.id GROUP BY i.id;
            `)
    }

    async getAttribute(type: getAttributeType, queryWords: string, pageno: number, pagesize: number = 300) {
        let query: string = (queryWords as string).trim()
        if (type > 4 || type < 0 || query.length == 0) return []
        let words: string[] = query.split(/\s+/)

        const tableInfo = [{ type: 'item', field: 'title' }, { type: 'author', field: 'name' },
        { type: 'tag', field: 'title' }, { type: 'folder', field: 'path' }]
        let SQL: string[] = ['SELECT type, id, value FROM ('];

        if (type == getAttributeType.ALL) {
            for (let i = 0; i < 3; i++) {
                if (i != 0) SQL.push('UNION ALL ')
                SQL.push(`SELECT '${tableInfo[i].type}' AS type, id, ${tableInfo[i].field} AS value, (`)
                words.map((word, index) => {
                    if (index != 0) SQL.push('+')
                    SQL.push(`CASE WHEN UPPER(${tableInfo[i].field}) LIKE UPPER('%${word}%') THEN 1 ELSE 0 END`)
                })
                SQL.push(`) AS sore FROM ${tableInfo[i].type} WHERE sore > 0 `)
            }
        }
        else {
            SQL.push(`SELECT '${tableInfo[type].type}' AS type, id, ${tableInfo[type].field} AS value, (`)
            words.map((word, index) => {
                if (index != 0) SQL.push('+')
                SQL.push(`CASE WHEN UPPER(${tableInfo[type].field}) LIKE UPPER('%${word}%') THEN 1 ELSE 0 END`)
            })
            SQL.push(`) AS sore FROM ${tableInfo[type].type} WHERE sore > 0`)
        }
        SQL.push(`) ORDER BY sore DESC LIMIT ${pageno}, ${pagesize};`)
        return await this.dbLibrary.all(SQL.join(' '))
    }

    checkGetItemsOption(getItemsOption: getItemsOption): boolean {
        let isCorrect: boolean = true
        switch (getItemsOption.queryType) {
            case queryType.commonQuery:
                // 类型检查，字符串 && 字符串长度大于0不为''
                isCorrect = typeof getItemsOption.queryWords == 'string' && getItemsOption.queryWords.length > 0
                break
            case queryType.advancedQuery:
                // 类型检查，数组 && 数组长度为3 && 数组的三个字符串保证有一个长度大于0不为''
                isCorrect = getItemsOption.queryWords instanceof Array
                    && getItemsOption.queryWords.length == 3
                    && (getItemsOption.queryWords[0].length > 0 || getItemsOption.queryWords[1].length > 0 || getItemsOption.queryWords[2].length > 0)
                break
        }
        return isCorrect
    }

    async getItems(getItemsOption: getItemsOption): Promise<itemProfile[]> {
        if (!this.checkGetItemsOption(getItemsOption)) return []
        let SQL: string[] = []
        SQL.push(this._mainSQL_getItems(getItemsOption))
        SQL.push(this._filterSQL_getItems(getItemsType.common, getItemsOption.filterOption))
        SQL.push(this._orderSQL_getItems(getItemsOption.queryType != queryType.noQuery, getItemsOption.orderBy, getItemsOption.isAscending))
        SQL.push(`LIMIT ${getItemsOption.pageno}, 300;`)
        return await this.dbLibrary.all(SQL.join(' '))
    }

    async getItemsByAuthor(getItemsOption: getItemsOption, authorID: number): Promise<itemProfile[]> {
        if (!this.checkGetItemsOption(getItemsOption)) return []
        let SQL: string[] = []
        SQL.push(this._mainSQL_getItems(getItemsOption))
        // authorID 为0时，获取没有作者的item
        if (authorID === 0) {
            SQL.push('WHERE il_V.authorIDs IS NULL')
            SQL.push(this._filterSQL_getItems(getItemsType.noAuthor, getItemsOption.filterOption))
        } else {
            SQL.push(`JOIN (SELECT item_id FROM item_author WHERE author_id = ${authorID}) filterByAuthor ON il_V.id = filterByAuthor.item_id`)
            SQL.push(this._filterSQL_getItems(getItemsType.byAuthor, getItemsOption.filterOption))
        }
        SQL.push(this._orderSQL_getItems(getItemsOption.queryType != queryType.noQuery, getItemsOption.orderBy, getItemsOption.isAscending))
        SQL.push(`LIMIT ${getItemsOption.pageno}, 300;`)
        return await this.dbLibrary.all(SQL.join(' '))
    }

    async getItemsOfFav(getItemsOption: getItemsOption): Promise<itemProfile[]> {
        if (!this.checkGetItemsOption(getItemsOption)) return []
        let SQL: string[] = []
        SQL.push(this._mainSQL_getItems(getItemsOption))
        SQL.push('WHERE il_V.isFav = 1')
        SQL.push(this._filterSQL_getItems(getItemsType.ofFav, getItemsOption.filterOption))
        SQL.push(this._orderSQL_getItems(getItemsOption.queryType != queryType.noQuery, getItemsOption.orderBy, getItemsOption.isAscending))
        SQL.push(`LIMIT ${getItemsOption.pageno}, 300;`)
        return await this.dbLibrary.all(SQL.join(' '))
    }

    _mainSQL_getItems(getItemsOption: getItemsOption) {
        let SQL: string[] = ['SELECT il_V.* FROM']
        if (getItemsOption.queryType === queryType.noQuery) {
            SQL.push('itemList_VIEW il_V')
        } else {
            SQL.push(this._subquerySQL_Matched(getItemsOption.queryType, getItemsOption.queryWords as string | [string, string, string]))
            SQL.push('JOIN itemList_VIEW il_V ON matched.item_id = il_V.id')
        }
        return SQL.join(' ')
    }

    /**
     * @description 生成查询条件的SQL语句
     * @param type 1为普通查询，2为高级查询
     * @param queryWords 
     * @returns 
     */
    _subquerySQL_Matched(type: queryType, queryWords: string | [string, string, string]) {
        if (type === queryType.noQuery) return ''
        let matchedFiled = ['title', 't.title', 'a.name']
        let table = ['SELECT id AS item_id, 1 AS sore FROM item WHERE',
            'SELECT it.item_id, 0.5 AS sore FROM item_tag it JOIN tag t ON it.tag_id = t.id WHERE',
            'SELECT ia.item_id, 0.5 AS sore FROM item_author ia JOIN author a ON ia.author_id = a.id WHERE']
        let SQL: string[] = ['(SELECT item_id, SUM(sore) AS sumSore FROM (']

        let query: string
        let words: string[]
        if (type === queryType.commonQuery) {
            query = (queryWords as string).trim()
            words = query.split(/\s+/)
            matchedFiled.map((filde, index) => {
                if (index != 0) SQL.push('UNION ALL')
                SQL.push(table[index])
                SQL.push(words.map(word => `UPPER(${filde}) LIKE UPPER('%${word}%')`).join(' OR '))
            })
        } else if (type === queryType.advancedQuery) {
            let hasQuery: Boolean = false
            matchedFiled.map((filde, index) => {
                query = queryWords[index].trim()
                if (query != '') {
                    if (hasQuery) SQL.push('UNION ALL')
                    SQL.push(table[index])
                    hasQuery = true
                    words = query.split(/\s+/)
                    SQL.push(words.map(word => `UPPER(${filde}) LIKE UPPER('%${word}%')`).join(' OR '))
                }
            })
        }
        SQL.push(') GROUP BY item_id) matched')
        return SQL.join(' ')
    }
    /**
     * 得到用户筛选的SQL
     * WHERE il_V.folder_id IS NOT NULL AND il_V.hyperlink IS NOT NULL AND il_V.hasImage = 1
     * @param filterOption true为筛选false为不筛选
     * @returns filter SQL
     */
    _filterSQL_getItems(type: getItemsType, filterOption: [boolean, boolean, boolean]) {
        let connect = ['WHERE ', 'AND ', 'WHERE ', 'AND ']
        let filter: string[] = ['il_V.hyperlink IS NOT NULL', 'il_V.folder_id IS NOT NULL', 'il_V.hasImage = 1']
        let SQL: string[] = []
        for (let i = 0; i < filter.length; i++) {
            if (filterOption[i]) {
                SQL.push(filter[i])
            }
        }
        // 当不筛选任何条件时，不需要WHERE 或者 AND
        return SQL.length > 0 ? connect[type] + SQL.join(' AND ') : ''
    }

    /**
     * 有搜索词根据匹配程度排序，再根据用户指定的字段排序，没有搜索词就直接根据用户指定字段排序
     * ORDER BY matched.sumSore DESC, il_V.id DESC, il_V.hits DESC, il_V.title DESC
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