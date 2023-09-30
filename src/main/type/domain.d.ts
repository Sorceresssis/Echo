namespace Domain {
    type GroupProfile = {
        id: number;
        name: string;
    }

    type LibraryProfile = {
        id: number,
        name: string
    }

    type Library = {
        id: number;
        name: string;
        createTime?: string | undefined;
        modifiedTime?: string | undefined;
    }

    type LibraryExtra = {
        id: number;
        auxiliarySt: string;
        useAuxiliarySt: 0 | 1;
        intro: string;
    }

    type RecordProfile = {
        id: number;
        title: string;
        cover: string | null;
    }

    type Record = {
        id: number;
        title: string;
        rate: number;
        cover: string | null;
        hyperlink: string | null;
        dirname: string | null;
        basename: string | null;
        createTime?: string | undefined;
        modifiedTime?: string | undefined;
    }

    type RecordExtra = {
        id: number;
        intro: string;
        info: string;
    }










    type Author = {
        id: number;
        name: string;
        avatar: string | null;
        intro: string;
        createTime?: string;
        modifiedTime?: string;
    }

    type AuthorProfile = {
        id: number,
        name: string,
        avatar: string | null,
    }

    type Tag = {
        id: number,
        title: string,
    }

    type Series = {
        id: number;
        name: string;
    }

    type Dirname = {
        id: number;
        path: string;
    }
} 