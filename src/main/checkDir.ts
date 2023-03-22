import { config } from './config'
const fs = require('fs')
const path = require('path')

// 检查文件夹是否存在 ，否则sqlite报错
export function checkDir() {
    // 检查数据库文件夹
    mkdirsSync(path.resolve(config.userDataPath, "database"))
    // 检查封面图片
    mkdirsSync(path.resolve(config.userDataPath, "coverImage"))
}


/**
 * 通过路径递归的创建多层文件夹
 * @param dirPath  路径
 */
function mkdirsSync(dirPath: string) {
    if (fs.existsSync(dirPath)) {
        return
    } else {
        mkdirsSync(path.dirname(dirPath))
        fs.mkdirSync(dirPath)
    }
}

