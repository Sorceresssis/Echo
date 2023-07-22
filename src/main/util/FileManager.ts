import fs from 'fs'
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

class FileManager {
    /**
     * 通过路径递归的创建多层文件夹
     * @param Path 路径
     */
    mkdirsSync(Path: string) {
        if (fs.existsSync(Path)) {
            return
        } else {
            mkdirsSync(path.dirname(Path))
            fs.mkdirSync(Path)
        }
    }
}

const fm = new FileManager()

export default fm