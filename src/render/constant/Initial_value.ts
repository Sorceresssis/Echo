class InitialValue {
    private static deepCopy(obj: any) {
        return JSON.parse(JSON.stringify(obj));
    }


    public static getLibraryDetail(): VO.LibraryDetail {
        const defaultValue: VO.LibraryDetail = {
            id: 0,
            name: '',
            auxiliary_st: '',
            use_auxiliary_st: 0,
            intro: '',
            create_time: '',
            update_time: '',
        }

        return InitialValue.deepCopy(defaultValue)
    }

    public static getRecordDetail(): VO.RecordDetail {
        const defaultValue: VO.RecordDetail = {
            id: 0,
            title: '',
            translated_title: '',
            rate: 0,
            hyperlink: null,
            release_date: null,
            cover: undefined,
            sample_images: [],
            dirname: null,
            basename: null,
            source_fullpath: undefined,
            authors: [],
            tags: [],
            series: [],
            search_text: '',
            plot: '',
            reviews: '',
            info: '',
            create_time: '',
            update_time: '',
        }

        return InitialValue.deepCopy(defaultValue)
    }

    public static getAuthorDetail(): VO.AuthorDetail {
        const defaultValue: VO.AuthorDetail = {
            id: 0,
            name: '',
            avatar: '',
            intro: '',
            sample_images: [],
            create_time: '',
            update_time: '',
            record_count: 0,
        }

        return InitialValue.deepCopy(defaultValue)
    }
}


export default InitialValue;