// 请求参数
declare namespace RP {
    type LibraryExtraFormData = DAO.LibraryExtra_W

    type EditSampleImage = {
        type: 'add' | 'move',
        idx: number, // 从1开始
        path: string
    }

    /**
     * 编辑作者的表单
     */
    type EditAuthorFormData = {
        id: number,
        name: string,
        newAvatar: string | undefined,
        intro: string,
        editSampleImages: RP.EditSampleImage[],
        removeSampleImages: string[]
    }

    type RecordAuthorRelation = {
        id: Entity.Pk,
        roles: Entity.Pk[],
    }

    /**
     * 添加和编辑record的表单数据
     */
    type EditRecordFormData = {
        id: number,
        title: string
        translated_title: string
        rate: number
        hyperlink: string
        releaseDate: string
        dirname: string
        basename: string
        searchText: string
        addTags: string[]
        removeTags: number[]
        addAuthors: RP.RecordAuthorRelation[]
        editAuthorsRole: RP.RecordAuthorRelation[]
        removeAuthors: number[]
        addSeries: string[]
        removeSeries: number[]
        plot: string
        reviews: string
        info: string
        cover: string | undefined
        originCover: string | undefined
        editSampleImages: RP.EditSampleImage[]
        removeSampleImages: string[]
    }

    type QueryRecordRecommendationsOptions = {
        type: 'common' | 'recycled' | 'author' | 'series'
        authorId?: number,
        seriesId?: number,
        filters: [boolean, boolean, boolean],
        keyword: string,
        sortField: 'time' | 'title' | 'rate' | 'release_date',
        order: 'ASC' | 'DESC',
        pn: number,
        ps: number,
    }

    type QueryAuthorRecommendationsOptions = {
        keyword: string
        sortField: 'time' | 'name'
        order: 'ASC' | 'DESC'
        roleFilterMode: "None" | "DEFAULT" | "ROLE_ID"
        role: number
        pn: number
        ps: number
    }

    type QueryTagDetailsOptions = {
        keyword: string,
        sortField: 'time' | 'title'
        order: 'ASC' | 'DESC'
        pn: number,
        ps: number,
    }

    type QueryDirnameDetailsOptions = {
        keyword: string,
        sortField: 'time' | 'path'
        order: 'ASC' | 'DESC'
        pn: number,
        ps: number,
    }

    /**
     * autocomplete的选项,用于搜索
     */
    type AutoCompleteOptions = {
        type: AcType,
        queryWord: string,
        ps: number
    }

    type RecordBatchProcessingType = 'recycle' | 'recover' | 'delete_recycled' | 'delete_recycled_all'

    /**
     * type  0: 单个 1: 批量
     *  operate 0: 添加 1: 跟新 2: 添加和更新
     */
    type AddRecordFromMetadataParam = {
        type: number        // 0: 单个 1: 批量
        operate: 0 | 1 | 2
        dir: string
    }

    /**
     * 批量删除record的表单
     */
    type DeleteRecordByAttributeFormData = {
        dirnamePath: string
        tagTitle: string
        seriesName: string
    }
}