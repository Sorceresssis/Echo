declare class Result {
    code: number
    msg: string
    data: any
    constructor(code: number, msg: string, data: any) {
        this.code = code
        this.msg = msg
        this.data = data
    }
}

declare interface IGroup {
    id: number,
    name: string,
    librarys: {
        id: number,
        name: string,
    }[]
}

// library简介
declare type Library = {
    id: number,
    name: string,
}

declare type LibraryDetail = {
    id: number,
    name: string,
    description: string,
    group: string,
    group_id: number,
    cover: string,
}