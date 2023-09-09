import fm from '../util/FileManager'
import appConfig from './config'

const bootCheck = () => {
    fm.mkdirsSync(appConfig.get('userDataPath'))
}

export default bootCheck