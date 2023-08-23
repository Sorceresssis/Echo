namespace DTO {
    /**
     * 分页数据
     */
    type Page<T> = {
        total: number,
        data: T[]
    }


    /**
     * autocomplete的选项,用于搜索
     */
    type AcOptions = {
        type: AcType,
        queryWord: string,
        ps: number
    }

    type QueryAttributesOptions = {
        queryWork: string
        sortField: AttributeSortField
        order: 'asc' | 'desc'
        asc: boolean
        pn: number
        ps: number
    }

    /**
     * 编辑作者的表单
     */
    type EditAuthorForm = {
        id: number,
        name: string,
        avatar: string,
        originAvatar: string,
        intro: string,
    }

    /**
     * 批量删除record的表单
     */
    type BatchDeleteForm = {
        dirnamePath: string
        tagTitle: string
        seriesName: string
        deleteAttribute: boolean
    }

    /**
     * 添加和编辑record的表单数据
     */
    type EditRecordForm = {
        id: number,
        dirname: string,
        basename: string,
        batchDir: string,
        title: string,
        hyperlink: string,
        cover: string,
        originCover: string,
        rate: number,
        addTags: string[],
        removeTags: number[],
        addAuthors: number[],
        removeAuthors: number[],
        addSeries: string[],
        removeSeries: number[],
        intro: string,
        info: string
    }

    /**
     * 添加和编辑record时的建议数据
     * @param batch 是否是批量添加
     * @param distinct 是否去重 
     */
    type EditRecordOptions = {
        batch: boolean,
        distinct: boolean,
    }

    type QueryRecord = {
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
}