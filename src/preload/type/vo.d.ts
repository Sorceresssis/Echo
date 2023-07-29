declare type GroupProfile = {
    id: number,
    name: string,
}

declare type LibraryProfile = {
    id: number,
    name: string,
}

declare type Group = {
    id: number,
    name: string,
    librarys: LibraryProfile[]
}

declare type LibraryDetail = {
    id: number,
    name: string,
    intro: String,
    createTime: string,
}

/******************** record ********************/
declare type AcSuggestion = {
    type: string,
    id: number,
    value: string,
    image?: string
}

declare type AuthorProfile = {
    id: number,
    name: string
    avatar?: string,
}

declare type AuthorDetail = {
    id: number,
    name: string,
    avatar?: string,
    intro: string,
    createTime: string,
    modifiedTime: string,
}

declare type RecordProfile = {
    id: number,
    title: string,
    rate: number
    hyperlink: string,
    hasCoverImage: boolean,
    tags: string[],
    authors: AuthorProfile[],

}




declare type AuthorProfile = {
    id: number,
    name: string
}
