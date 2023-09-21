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
        cover: string | null
        hyperlink: string | null
        basename: string | null
        infoStatus: string
        tagAuthorSum: string | null
        dirnameId: PrimaryKey
    }

    type Author = {
        id: PrimaryKey
        name: string
        avatar: string | null
        intro: string
    }

    type RecordExtra = {
        id: PrimaryKey
        intro: string
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
}