declare class group {
    id: number
    name: string
    isOpen: number
    librarys: library[]
    constructor(id: number, name: string, isOpen: number, databases: database[]) {
        this.id = id
        this.name = name
        this.isOpen = isOpen
        this.databases = databases
    }
}
declare class library {
    id: number
    name: string
    constructor(id: number, name: string) {
        this.id = id
        this.name = name
    }
}

declare type getItemsOption = {
    // queryType: noQuery, commonQuery, advancedQuery
    queryType: number,
    queryWords: string | [string, string, string],
    // filterOptionIndex: [noHyperlink, noFile, noImage]
    filterOption: [boolean, boolean, boolean],
    // orderField: time, hits, title
    orderBy: number,
    isAscending: boolean,
    pageno: number
}

declare interface itemProfile {
    id: number
    title: string
    createTime: string
    hits: number
    hasImage: number
    isFav: number
    hyperlink: string
    folder_id: number
    authorIDs: string
    authorNames: string
    tags: string
}

declare interface itemInfo {
    id: number
    title: string
    createTime: string
    hits: number
    hasImage: number
    isFav: number
    hyperlink: string
    folder_id: number
    authorIDs: string
    authorNames: string
    tags: string
}