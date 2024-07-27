declare namespace Entity {
    type PK = number

    type GroupDBInfo = {
        name: string
        value: string
    }

    type Group = {
        id: Entity.PK
        name: string
        prev_id: Entity.PK
        next_id: Entity.PK
        create_time: string
        update_time: string
    }

    type Library = {
        id: Entity.PK
        name: string
        prev_id: Entity.PK
        next_id: Entity.PK
        create_time: string
        update_time: string
        group_id: Entity.PK
    }

    type LibraryExtra = {
        id: Entity.PK
        use_auxiliary_st: 0 | 1
        auxiliary_st: string
        intro: string
    }












    type Record = {
        id: Entity.PK
        title: string
        rate: number
        hyperlink: string | null
        basename: string | null
        releaseDate: string | null
        infoStatus: string
        tagAuthorSum: string | null
        search_text: string
        dirnameId: Entity.PK
    }

    type RecordExtra = {
        id: Entity.PK
        plot: string
        reviews: string
        info: string

    }

    type LibraryDBInfo = GroupDBInfo





    type LibraryExtra = {
        id: Entity.PK
        auxiliarySt: string,
        useAuxiliarySt: 0 | 1,
        intro: string,
    }

    type Record = {
        id: Entity.PK
        title: string
        rate: number
        hyperlink: string | null
        basename: string | null
        releaseDate: string | null
        infoStatus: string
        tagAuthorSum: string | null
        search_text: string
        dirnameId: PK
    }

    type RecordExtra = {
        id: Entity.PK
        plot: string
        reviews: string
        info: string
    }

    type Author = {
        id: Entity.PK
        name: string
        intro: string
    }

    interface Role {
        id: number
        name: string
    }

    type Tag = {
        id: Entity.PK
        title: string
    }

    type Series = {
        id: Entity.PK
        name: string
    }

    type Dirname = {
        id: Entity.PK
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