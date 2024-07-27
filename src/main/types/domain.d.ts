namespace Domain {

    type RecordProfile = {
        id: number
        title: string
        cover: string | undefined
    }


    type RecordExtra = {
        id: number;
        plot: string
        reviews: string
        info: string
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