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