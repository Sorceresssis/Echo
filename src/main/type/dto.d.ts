type Filter = 'image' | 'fafa' | 'dirname'


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

let queryRecord: QueryRecord;
queryRecord.filters