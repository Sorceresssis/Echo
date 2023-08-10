declare type ConfigName = 'userDataPath' | 'locale'


/* Autocomplete */
declare type AcType = 'search' | 'record' | 'author' | 'tag' | 'series' | 'dirname'
declare type AcOption = {
    type: AcType,
    queryWord: string,
    ps: number
}

/* openDialog */
declare type OpenDialogType = 'dir' | 'file' | 'image' | 'video'

/* Attribute Query */
type AttributeSortField = 'date' | 'text'
type QueryAttributesOptions = {
    queryWork: string
    sortField: AttributeSortField
    asc: boolean
    pn: number
    ps: number
}







type AuthorForm = {
    id: number,
    name: string,
    avatar: string,
    intro: string,
}





declare type RecordForm = {
    id?: number,
    dirname: string,
    basename: string,
    hyperlink: string,
    title: string,
    coverImage: string,
    rate: number,
    authors: number[]
    tags: string[],
    series: string[],
    intro: string,
    info: string
}
type RecordFormOption = {
    type: boolean, // 添加还是修改
    isBatch: boolean, // 是否批量添加
    checkRecordExist: boolean // 添加时是否检查记录是否存在
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