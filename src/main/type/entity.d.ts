namespace Entity {
    type LibraryExtra = {
        id: PrimaryKey
        auxiliarySt: string,
        useAuxiliarySt: 0 | 1,
        intro: string,
    }

    type Record = {
        id: PrimaryKey
        title: string
        rate: number
        hyperlink: string | null
        basename: string | null
        releaseDate: string | null
        infoStatus: string
        tagAuthorSum: string | null
        search_text: string
        dirnameId: PrimaryKey
    }

    type Author = {
        id: PrimaryKey
        name: string
        intro: string
    }

    type RecordExtra = {
        id: PrimaryKey
        plot: string
        reviews: string
        info: string
    }

    type Tag = {
        id: PrimaryKey
        title: string
    }

    type Series = {
        id: PrimaryKey
        name: string
    }

    type Dirname = {
        id: PrimaryKey
        path: string
    }

    interface EchoMetadataAuthor {
        name: string
        role: string // ='' 时 赋值 null
    }

    interface EchoMetadataReference {
        name: string
        id: string
    }
    interface EchoMetadata {
        title: string
        plot: string
        release_date: string // ='' 时 赋值 null
        authors: Entity.EchoMetadataAuthor[]
        series: string[]
        tags: string[]
        rate: number // 0 ~ 5
        reviews: string
        info: string
        hyperlink: string // ='' 时 赋值 null
        search_text: string
        references?: EchoMetadataReference[]
    }
}