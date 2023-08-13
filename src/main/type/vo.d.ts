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

type Page = {
    total: number,
    data: any[]
}

type TextAttribute = {
    id: number,
    value: string,
    count: number,
}

type AuthorDetail = {
    id: number,
    name: string,
    avatar: string | null,
    intro: string,
    createTime: string,
    modifiedTime: string,
}

type AuthorRecmd = {
    id: number,
    name: string,
    avatar: string | null,
    intro: string,
    createTime: string,
    modifiedTime: string,
    count: number,
    // masterpiece
    Mstrpcs: [
    ]
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

