import { app } from "electron"
import path from 'path'
import fs from 'fs'

type Conf = {
    userDataPath: string,
    locale: string,
}

class Config {
    private static readonly CONFIG_FILE_PATH = path.resolve(path.dirname(app.getPath('exe')), "config.json")
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

    public set(name: ConfigKey, value: any): any {
        if (value) {
            this.c[name] = value
            this.write()
        }
        let newValue = this.c[name]
        return newValue
    }

    private write() {
        fs.writeFileSync(Config.CONFIG_FILE_PATH, JSON.stringify(this.c), 'utf8')
    }

    public getDBDir(): string {
        return path.resolve(this.c.userDataPath, 'db')
    }

    public getDBBackupDir(): string {
        return path.resolve(this.c.userDataPath, 'dbbackup')
    }

    public getImagesDir(): string {
        return path.resolve(this.c.userDataPath, 'images')
    }

    public getGroupDBFile(): string {
        return path.join(this.getDBDir(), 'group.db')
    }

    public getLibraryDBFile(id: PrimaryKey): string {
        return path.join(this.getDBDir(), `${id}.db`)
    }

    public getLibaryDBBackupDir(id: PrimaryKey): string {
        return path.resolve(this.getDBBackupDir(), id.toString())
    }

    public getLibraryImagesDir(id: PrimaryKey): string {
        return path.resolve(this.getImagesDir(), id.toString())
    }
}

const config = new Config()

export default config