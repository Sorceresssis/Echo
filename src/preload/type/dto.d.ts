declare type ConfigName = 'userDataPath' | 'locale'

declare type AcType = 'search' | 'record' | 'author' | 'tag' | 'series' | 'dirname'

declare type AcOption = {
    type: AcType,
    queryWord: string,
    ps: number
}

declare type OpenDialogType = 'dir' | 'file' | 'image' | 'video'


type AuthorForm = {
    id: number,
    name: string,
    avatar?: string,
    intro: string,
}

declare type Filter = 'image' | 'fafa' | 'dirname'
declare type QueryRecord = {
    libraryId: number,
    authorId: number,
    filters: Filter[]
    order: {
        field: string,
        asc: boolean
    },
    kw: string, // keyword
    pn: number, // pageNo 
    ps: number, // pageSize 
}