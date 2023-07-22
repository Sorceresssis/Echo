import { app } from "electron"
import path from 'path'
import fs from 'fs'

type Conf = {
    userDataPath: string,
    locale: string,
}

class Config {
    private static readonly CONFIG_FILE_PATH: string = path.resolve(path.dirname(app.getPath('exe')), "config.json")
    private static readonly DEFAULT_CONFIG: Conf = {
        userDataPath: path.resolve(path.dirname(app.getPath('exe')), "userData"),
        locale: 'zhCN',
    }
    private c: Conf

    constructor() {
        try {
            this.c = JSON.parse(fs.readFileSync(Config.CONFIG_FILE_PATH, 'utf8')) as Conf
            // 防止文件存在但是文件内容错误或读取错误
            if (!this.c) {
                this.c = Config.DEFAULT_CONFIG
                this.write()
            }
        } catch (err: any) {
            // 文件不存在或损坏，建文件写入数据
            this.c = Config.DEFAULT_CONFIG
            this.write()
        }
    }

    public set(label: ConfigLabel, value: any): any {
        let newValue = null
        switch (label) {
            case 'userDataPath':
                if (value) this.c.userDataPath = value
                newValue = this.c.userDataPath
                break
            case 'locale':
                if (value) this.c.locale = value
                newValue = this.c.locale
                break
            default:
                return newValue
        }
        if (value) { this.write() }
        return newValue
    }

    private write() {
        fs.writeFileSync(Config.CONFIG_FILE_PATH, JSON.stringify(this.c), 'utf8')
    }

    public getUserDataPath(): string {
        return this.c.userDataPath
    }

    public getGroupDBPath(): string {
        return path.resolve(this.c.userDataPath, 'database/group.db')
    }

    public getLibraryDBPath(libraryId: number): string {
        return path.resolve(this.c.userDataPath, `database/${libraryId}.db`)
    }
}

const config = new Config()

export default config