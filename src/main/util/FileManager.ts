const fs = require('fs')
const path = require('path')

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
