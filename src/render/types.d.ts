export interface item {
    id: number
    title: string
    isFav: number
    hyperlink: string | null
    flieName: string | null
    folder_id: number
    tags: string | null
    authorsID: string | null
    authors: string | null
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

declare type authorProfile = {
    id: number
    name: string
    intro: string
    itemCount: number
    itemIDs: string
}