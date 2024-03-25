import { app } from 'electron'
import path from 'path'
import fs from 'fs'
import { isSameType } from '../util/common'

export interface Config {
    userDataPath: string,
    locale: string,
    searchEngine: string,
}

class AppConfig {
    private static readonly appDir: string = path.dirname(app.getPath('exe'))
    private static readonly configFilePath: string = path.join(AppConfig.appDir, 'config.json')
    private static readonly defaultConfig: Config = {
        userDataPath: path.join(this.appDir, 'userData'),
        locale: 'zhCN',
        searchEngine: 'google',
    }

    private config!: Config

    constructor() {
        try {
            const config = JSON.parse(fs.readFileSync(AppConfig.configFilePath, 'utf8'))

            if (config && isSameType(config, AppConfig.defaultConfig)) {
                this.config = config
            } else {
                throw new Error('Config file is invalid')
            }
        } catch {
            this.reset()
        }
    }

    public reset(): void {
        const stringifiedConfig = JSON.stringify(AppConfig.defaultConfig, null, 4)
        fs.writeFileSync(AppConfig.configFilePath, stringifiedConfig, 'utf8')
        this.config = JSON.parse(stringifiedConfig)
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

    // TODO Path Constructor 
    public getLibraryImagesDirPath(id: PrimaryKey): string {
        // [userDataPath]/1/images
        return path.join(this.get('userDataPath'), id.toString(), 'images')
    }
}

const appConfig = new AppConfig()

export default appConfig