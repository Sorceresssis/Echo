import { app } from 'electron'
import path from 'path'
import fs from 'fs'

type AppValue = {
    appDir: string,
}

const readAppValue = function (): AppValue {
    const appValueFilePath = path.join(__dirname, 'app_value.json')
    try {
        let appValue = JSON.parse(fs.readFileSync(appValueFilePath, 'utf8'))
        if (!appValue) {
            throw new Error('appValue is null')
        }
        return appValue
    } catch {
        const appValue = {
            // 先把app安装位置保存下来, 然后需要时从文件读取，因为有些操作是在其他线程使用的，而electron模块只能在主进程使用。
            appDir: path.dirname(app.getPath('exe')),
        }
        fs.writeFileSync(appValueFilePath, JSON.stringify(appValue), 'utf8')
        return readAppValue()
    }
}

const appValue = readAppValue()

type Config = {
    userDataPath: string,
    locale: string,
}

class AppConfig {
    private static readonly CONFIG_FILE_PATH: string = path.join(appValue.appDir, 'config.json')
    private static readonly DEFAULT_CONFIG: Config = {
        userDataPath: path.join(appValue.appDir, 'userData'),
        locale: 'zhCN'
    }

    private config: Config

    constructor() {
        try {
            this.config = JSON.parse(fs.readFileSync(AppConfig.CONFIG_FILE_PATH, 'utf8'))
            if (!this.config) {
                throw new Error('config is null')
            }
        } catch {
            this.config = AppConfig.DEFAULT_CONFIG
            this.write()
        }
    }

    private write() {
        fs.writeFileSync(AppConfig.CONFIG_FILE_PATH, JSON.stringify(this.config), 'utf8')
    }

    public get(key: keyof Config): string {
        return this.config[key]
    }

    public set(key: keyof Config, value: string) {
        return this.config[key] = value
    }

    public getGroupDBFilePath() {
        return path.join(this.config.userDataPath, 'group.db')
    }

    public getLibraryDirPath(id: PrimaryKey,) {
        return path.join(this.config.userDataPath, id.toString())
    }

    public getLibraryDBFilePath(id: PrimaryKey) {
        // [userDataPath]/1/1.db
        return path.join(this.getLibraryDirPath(id), `${id}.db`)
    }

    public getLibraryImagesDirPath(id: PrimaryKey) {
        // [userDataPath]/1/images
        return path.join(this.getLibraryDirPath(id), 'images')
    }
}

const appConfig = new AppConfig()

export default appConfig