namespace VO {
    type GroupProfile = {
        id: number,
        name: string,
    }

    type LibraryProfile = {
        id: number,
        name: string,
        dataPath: string,
    }

    type Group = {
        id: number,
        name: string,
        librarys: LibraryProfile[]
    }

    type LibraryDetail = {
        id: number,
        name: string,
        auxiliarySt: string,
        useAuxiliarySt: boolean,
        intro: string,
        createTime: string,
        modifiedTime: string,
    }

    type Record = {
        id: number,
        title: string,
        rate: number,
        cover: string,
        hyperlink: string,
        resourcePath: string,
        createTime?: string,
        modifiedTime?: string,
    }

    /**
     * 记录的详细信息，用于编辑和记录详情页展示
     */
    type RecordDetail = {
        id: number
        title: string
        rate: number,
        cover: string | null,
        hyperlink: string | null,
        resourcePath: string | null,
        authors: VO.AuthorProfile[]
        tags: VO.Tag[]
        series: VO.Series[]
        intro: string
        info: string
        createTime: string,
        modifiedTime: string,
    }

    type RecordRecommendation = {
        id: number
        title: string
        rate: number,
        cover: string | null,
        hyperlink: string | null,
        resourcePath: string | null,
        authors: VO.AuthorProfile[]
        tags: VO.Tag[]
        createTime?: string,
        modifiedTime?: string,
    }

    /**
     * 作者的简单信息，用于列表展示
     */
    type AuthorProfile = {
        id: number,
        name: string,
        avatar: string | null,
    }

    type Author = {
        id: number
        name: string
        avatar: string | null
        intro: string
        createTime?: string,
        modifiedTime?: string,
    }

    type AuthorDetail = {
        id: number
        name: string
        avatar: string | null
        intro: string
        createTime: string,
        modifiedTime: string,
        recordCount: number,
    }

    /**
     * 作者的推荐信息，用于首页展示,多出了作品列表和作品数量
     */
    type AuthorRecommendation = {
        id: number,
        name: string,
        avatar: string | null,
        worksCount: number,
        intro: string,
        masterpieces: {
            id: number,
            cover: string | null,
            title: string,
        }[]
    }

    type Tag = {
        id: number,
        title: string,
    }

    type TagDetail = {
        id: number,
        title: string,
        recordCount: number,
    }

    type Dirname = {
        id: number,
        path: string
    }

    type DirnameDetail = {
        id: number,
        path: string,
        recordCount: number,
    }

    type Series = {
        id: number,
        name: string
    }

    type RecordExtra = {
        id: number,
        intro: string,
        info: string,
    }

    /**
     * 自动补齐的返回值
     */
    type AcSuggestion = {
        type: string,
        id: number,
        value: string,
        image: string | null
    }
}