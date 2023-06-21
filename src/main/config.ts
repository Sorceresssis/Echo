import { app } from "electron"
const path = require('path')
const fs = require('fs')

type lang = {
    label: string,
    locale: string
}
type conf = {
    userDataPath: string,
    lang: lang
}


const configPath: string = path.resolve(path.dirname(app.getPath('exe')), "config.json")
const defaultConfig: conf = {
    userDataPath: path.resolve(path.dirname(app.getPath('exe')), "userData"),
    lang: {
        label: '简体中文',
        locale: 'zhCN'
    }
}

export let config: conf;
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
export function setConfig(index: string, newValue: any) {
    let value = null
    switch (index) {
        case 'userDataPath':
            if (newValue) { config.userDataPath = newValue }
            value = config.userDataPath
            break
        case 'lang':
            if (newValue) { config.lang = newValue }
            value = config.lang
            break
        case '':
            value = null
            break
    }
    if (newValue) {
        _writeConfig(config)
    }
    return value
}

function _writeConfig(data: conf) {
    fs.writeFileSync(configPath, JSON.stringify(data), 'utf8', (err: any) => {
        console.log(err);
    })
}