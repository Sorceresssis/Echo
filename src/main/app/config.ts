import { app } from 'electron'
import path from 'path'
import fs from 'fs'
import { isSameType } from '../util/common'

class AppConfig {
    private static readonly userDataPath: string = path.join(app.getPath('userData'))
    private static readonly configFilePath: string = path.join(AppConfig.userDataPath, 'config.json')
    private static readonly defaultConfig: Config = {
        dataPath: path.join(AppConfig.userDataPath, 'data'),
        locale: 'zhCN',
        searchEngine: 'google',
    }

    private config!: Config

    constructor() {
        try {
            // 检查加载的是正确的Config文件
            const config = JSON.parse(fs.readFileSync(AppConfig.configFilePath, 'utf8'))

            if (config && isSameType(config, AppConfig.defaultConfig)) {
                this.config = config
            } else {
                throw new Error('Config file is invalid')
            }

            // 检查Config中值是否可以使用。
            this.__checkConfig_value()
        } catch {
            this.reset()
        }
    }

    public reset(key?: keyof Config): void {
        if (key) {
            this.config[key] = AppConfig.defaultConfig[key]
        } else {
            const stringifiedConfig = JSON.stringify(AppConfig.defaultConfig, null, 4)
            fs.writeFileSync(AppConfig.configFilePath, stringifiedConfig, 'utf8')
            this.config = JSON.parse(stringifiedConfig)
        }
    }

    public get(key: keyof Config): string {
        return this.config[key]
    }

    public set(key: keyof Config, value: string): void {
        this.config[key] = value
        fs.writeFileSync(AppConfig.configFilePath, JSON.stringify(this.config, null, 4), 'utf8')
    }

    public all(): Config {
        return this.config
    }

    private __checkConfig_value() {
        const path = this.get('dataPath')
        if (!fs.existsSync(path)) {
            this.set('dataPath', AppConfig.defaultConfig.dataPath)
            fs.mkdirSync(AppConfig.defaultConfig.dataPath, { recursive: true })
        }
    }
}

const appConfig = new AppConfig()

export default appConfig