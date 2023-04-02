import { config } from './config'
const fs = require('fs')
const path = require('path')



// 检查文件夹是否存在 ，否则sqlite报错
export function checkBootDir() {
    // 检查数据库文件夹
    mkdirsSync(path.resolve(config.userDataPath, "database"))
    // 图片存放位置
    mkdirsSync(path.resolve(config.userDataPath, "image"))
}


/**
 * 通过路径递归的创建多层文件夹
 * @param dirPath  路径
 */
export function mkdirsSync(dirPath: string) {
    if (fs.existsSync(dirPath)) {
        return
    } else {
        mkdirsSync(path.dirname(dirPath))
        fs.mkdirSync(dirPath)
    }
}

