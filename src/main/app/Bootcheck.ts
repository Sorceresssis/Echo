import path from 'path'
import config from './config'
import fm from '../util/FileManager'

const bootCheck = () => {
    // 检查数据库文件夹
    fm.mkdirsSync(path.resolve(config.getUserDataPath(), "database"))
    // 图片存放位置
    fm.mkdirsSync(path.resolve(config.getUserDataPath(), "images"))
}

export default bootCheck