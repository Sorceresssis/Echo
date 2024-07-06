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
}


export default InitialValue;