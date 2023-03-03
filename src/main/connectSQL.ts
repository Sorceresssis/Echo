import { config } from './config'
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs')
const path = require('path')


const createDatabaseInfoSQL: string = ""
const createDatabaseSQL: string = ""

let databasePath = path.resolve(config.userDataPath, "database")


export function getAllDatabase() {
    fs.access(databasePath, (err: any) => {
        if (err?.code === "ENOENT") {
            // 建库
        }
        else {
            // 读取库
        }
    })
    const db = new sqlite3.Database('');
}

function createDatabase() {

}



// config.userDataPath

// database

// 封面图片储存位置coverImage