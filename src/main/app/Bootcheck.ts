import path from 'path'
import config from './config'
import fm from '../util/FileManager'

const bootCheck = () => {
    // 目录检查
    fm.mkdirsSync(config.getDBDir())
    fm.mkdirsSync(config.getDBBackupDir())
    fm.mkdirsSync(config.getImagesDir())
}

export default bootCheck