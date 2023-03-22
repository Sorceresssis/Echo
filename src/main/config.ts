import { app } from "electron"
const path = require('path');
const fs = require('fs')

const configPath: string = path.resolve(path.dirname(app.getPath('exe')), "config.json")
const defaultConfig = {
    userDataPath: path.resolve(path.dirname(app.getPath('exe')), "userData"),
    photoPlayerPath: null,
    videoPlayerPath: null,
    lastOpenDatabase: null,
}


export let config: any;
export function readConfig() {
    try {
        let data = fs.readFileSync(configPath, 'utf8')
        config = JSON.parse(data)
    }
    catch (err: any) {
        if (err.code === "ENOENT") {
            _writeConfig(defaultConfig)
            config = defaultConfig
        }
    }
}
export function setConfig(item: string, value: string) {

}
export function writeConfig() {
    _writeConfig(config)
}



function _writeConfig(data: any) {
    fs.writeFile(configPath, JSON.stringify(data), 'utf8', (err: any) => {
        console.log(err);
    })
}