const ECHO_METADATA_SCHEMA = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
        "title": {
            "type": "string",
            "description": "标题",
            "minLength": 0,
            "maxLength": 255
        },
        "translated_title": {
            "type": "string",
            "description": "翻译标题",
            "minLength": 0,
            "maxLength": 255
        },
        "plot": {
            "type": "string",
            "description": "情节"
        },
        "release_date": {
            "type": "string",
            "pattern": "^(\\d{4}-\\d{2}-\\d{2}|)$",
            "description": "YYYY-MM-DD格式的日期或空字符串"
        },
        "authors": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "description": "作者名",
                        "minLength": 0,
                        "maxLength": 255
                    },
                    "role": {
                        "type": "array",
                        "items": {
                            "type": "string",
                            "description": "在作品中担任的任务",
                            "minLength": 0,
                            "maxLength": 50
                        },
                    }
                },
                "required": ["name", "role"]
            }
        },
        "series": {
            "type": "array",
            "items": {
                "type": "string",
                "description": "系列",
                "minLength": 0,
                "maxLength": 255
            }
        },
        "rate": {
            "type": "integer",
            "minimum": 0,
            "maximum": 5,
            "description": "评分，0到5之间"
        },
        "reviews": {
            "type": "string",
            "description": "个人点评"
        },
        "info": {
            "type": "string",
            "description": "额外信息"
        },
        "hyperlink": {
            "type": "string",
            "description": "超链接",
            "minLength": 0,
            "maxLength": 2048
        },
        "search_text": {
            "type": "string",
            "description": "暴露给搜索的文本"
        },
        "tags": {
            "type": "array",
            "items": {
                "type": "string",
                "description": "标签",
                "minLength": 0,
                "maxLength": 255
            }
        },
        "references": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "description": "参考来源名称"
                    },
                    "id": {
                        "type": "string",
                        "description": "参考来源ID"
                    }
                },
                "required": ["name", "id"]
            }
        }
    },
    "required": [
        "title",
        "translated_title",
        "plot",
        "release_date",
        "authors",
        "series",
        "rate",
        "reviews",
        "info",
        "hyperlink",
        "search_text",
        "tags"
    ]
}

export default ECHO_METADATA_SCHEMA
