const APP_CONFIG_SCHEMA = {
    "type": "object",
    "properties": {
        "dataPath": {
            "type": "string",
            "description": "数据路径"
        },
        "locale": {
            "type": "string",
            "description": "本地化语言"
        },
        "searchEngine": {
            "type": "string",
            "description": "搜索引擎"
        }
    },
    "required": ["dataPath", "locale", "searchEngine"]
}


export default APP_CONFIG_SCHEMA