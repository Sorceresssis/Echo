import { app } from "electron"
const path = require('path');
const fs = require('fs')

const configPath: string = path.resolve(path.dirname(app.getPath('exe')), "config.json")
const defaultConfig = {
    userDataPath: path.resolve(path.dirname(app.getPath('exe')), "userData"),
    locale: 'zh-CN',
    photoPlayerPath: null,
    videoPlayerPath: null
}

export let config: any;
export function readConfig() {
    try {
        let data = fs.readFileSync(configPath, 'utf8')
        config = JSON.parse(data)
        // 文件存在但是读取错误，重新写入
        if (config == null) {
            _writeConfig(defaultConfig)
            config = defaultConfig
        }
    }
    // 文件不存在，建文件写入数据 
    catch (err: any) {
        if (err.code === "ENOENT") {
            _writeConfig(defaultConfig)
            config = defaultConfig
        }
    }
}
export function setConfig(item: string, value: string) {
    switch (item) {
        case 'fd':
            break
        case '':
            break
    }
    // 保存更改
    _writeConfig(config)
}

function _writeConfig(data: any) {
    fs.writeFileSync(configPath, JSON.stringify(data), 'utf8', (err: any) => {
        console.log(err);
    })
}