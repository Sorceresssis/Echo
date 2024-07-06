class InitialValue {
    private static deepCopy(obj: any) {
        return JSON.parse(JSON.stringify(obj));
    }


    public static getLibraryDetail(): VO.LibraryDetail {
        const defaultValue: VO.LibraryDetail = {
            id: 0,
            name: '',
            auxiliarySt: '',
            useAuxiliarySt: false,
            intro: '',
            createTime: '',
            modifiedTime: '',
        }

        return InitialValue.deepCopy(defaultValue)
    }

    public static getRecordDetail(): VO.RecordDetail {
        const defaultValue: VO.RecordDetail = {
            id: 0,
            title: '',
            rate: 0,
            hyperlink: null,
            releaseDate: null,
            cover: undefined,
            sampleImages: [],
            dirname: null,
            basename: null,
            resourcePath: null,
            authors: [],
            tags: [],
            series: [],
            search_text: '',
            plot: '',
            reviews: '',
            info: '',
            createTime: '',
            modifiedTime: '',
        }

        return InitialValue.deepCopy(defaultValue)
    }
}


export default InitialValue;