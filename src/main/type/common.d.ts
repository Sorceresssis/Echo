type Config = {
    userDataPath: string,
    locale: string,
    searchEngine: string,
}

// 数据库主键类型
type PrimaryKey = number | bigint

namespace Dao {
    type Page<T> = {
        total: number;
        rows: T[];
    }
}

// autocomplete的类型
type AcType = 'search' | 'record' | 'author' | 'tag' | 'series' | 'dirname'

// openDialog的类型 
type OpenDialogType = 'dir' | 'file' | 'image' | 'video'

// record的属性排序字段
type AttributeSortField = 'date' | 'text'

type QueryRecordFilter = 'image' | 'fafa' | 'dirname'