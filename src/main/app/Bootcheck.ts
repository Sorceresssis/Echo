import fs from 'fs'
import appConfig from './config'

const bootCheck = () => {
    fs.mkdirSync(appConfig.get('userDataPath'), { recursive: true })
}

export default bootCheck