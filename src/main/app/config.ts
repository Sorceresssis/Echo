import { app } from 'electron'
import path from 'path'
import fs from 'fs'
import fm from '../util/FileManager'

export type Config = {
    userDataPath: string,
    locale: string,
    searchEngine: string,
}

class AppConfig {
    private static readonly APP_DIR: string = path.dirname(app.getPath('exe'))
    private static readonly CONFIG_FILE_PATH: string = path.join(AppConfig.APP_DIR, 'config.json')
    private static readonly DEFAULT_CONFIG: Config = {
        userDataPath: path.join(AppConfig.APP_DIR, 'userData'),
        locale: 'zhCN',
        searchEngine: 'google',
    }

    private config!: Config

    constructor() {
        try {
            this.config = JSON.parse(fs.readFileSync(AppConfig.CONFIG_FILE_PATH, 'utf8'))
            if (!this.config) {
                throw new Error('config is null')
            }
        } catch {
            this.reset()
        }
    }

    public get(key: keyof Config): string {
        if (!this.config[key]) {
            this.reset()
        }
        return this.config[key]
    }

    public all(): Config {
        return this.config
    }

    public set(key: keyof Config, value: string): void {
        this.config[key] = value
        fs.writeFileSync(AppConfig.CONFIG_FILE_PATH, JSON.stringify(this.config), 'utf8')
    }

    public reset(): void {
        const stringifiedConfig = JSON.stringify(AppConfig.DEFAULT_CONFIG)
        fs.writeFileSync(AppConfig.CONFIG_FILE_PATH, stringifiedConfig, 'utf8')
        this.config = JSON.parse(stringifiedConfig)
    }

    public getGroupDBFilePath(): string {
        return path.join(this.get('userDataPath'), 'group.db')
    }

    public getLibraryDirPath(id: PrimaryKey): string {
        return path.join(this.get('userDataPath'), id.toString())
    }

    public getLibraryDBFilePath(id: PrimaryKey): string {
        // [userDataPath]/1/1.db
        return path.join(this.getLibraryDirPath(id), 'library.db')
    }

    public getLibraryImagesDirPath(id: PrimaryKey): string {
        // [userDataPath]/1/images
        return path.join(this.getLibraryDirPath(id), 'images')
    }
}

const appConfig = new AppConfig()

export default appConfig