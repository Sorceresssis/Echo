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

declare type ACSuggestion = {
    type: ConcatArray,
    id: number,
    label: string,
}



declare type LibraryDetail = {
    id: number,
    name: string,
    intro: String,
    createTime: string,
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
