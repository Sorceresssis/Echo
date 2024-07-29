
type Config = {
    dataPath: string,
    locale: string,
    searchEngine: string,
}

// autocomplete的类型
type AcType = 'search' | 'record' | 'author' | 'tag' | 'series' | 'dirname'

// openDialog的类型 
type OpenDialogType = 'dir' | 'file' | 'image' | 'video'

// record的属性排序字段
type AttributeSortField = 'date' | 'text'

type QueryRecordFilter = 'image' | 'fafa' | 'dirname'

type DirContentItem = {
    name: string,
    type: 'folder' | 'file',
}