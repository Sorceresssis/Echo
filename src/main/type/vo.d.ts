declare type Group = {
    id: number,
    name: string,
    librarys: Library[]
}

// library简介
declare type Library = {
    id: number,
    name: string,
}



declare type AuthorProfile = {
    id: number,
    name: string
}

declare type RecordProfile = {
    id: number,
    title: string,
    rate: number
    tags: string[],
    hyperlink: string,
    authors: AuthorProfile[],

}




