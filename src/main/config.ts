import { app } from "electron"
const path = require('path');
const fs = require('fs')

const defaultConfig = {
    userDataPath: path.resolve(path.dirname(app.getPath('exe')), "userData"),
    photoPlayerPath: null,
    videoPlayerPath: null,
    lastOpenDatabase: null,
}
const configPath: string = path.resolve(path.dirname(app.getPath('exe')), "config.json")

export let config: any;

export function readConfig() {
    fs.readFile(configPath, 'utf8', (err: any, data: any) => {
        if (err?.code === "ENOENT") {
            _writeConfig(defaultConfig)
            config = defaultConfig
        }
        else {
            config = JSON.parse(data)
        }
    })
}

export function setConfig() {

}


export function writeConfig() {
    _writeConfig(config)
}

function _writeConfig(data: any) {
    fs.writeFile(configPath, JSON.stringify(data), 'utf8', (err: any) => {
        console.log(err);
    })
}