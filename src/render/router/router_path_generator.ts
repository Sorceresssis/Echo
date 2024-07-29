class RouterPathGenerator {
    public static welcome() {
        return '/'
    }

    public static libraryBashboard(libraryId: number | string) {
        return `/library/${libraryId}`
    }

    public static libraryManage(libraryId: number | string) {
        return `/library/${libraryId}/manage`
    }

    public static libraryEditAuthor(libraryId: number | string, authorId: number | string) {
        return `/library/${libraryId}/manage?author_id=${authorId}`
    }
    public static libraryEditRecord(libraryId: number | string, recordId: number | string) {
        return `/library/${libraryId}/manage?record_id=${recordId}`
    }

    public static libraryAuthor(libraryId: number | string, authorId: number | string) {
        return `/library/${libraryId}/author/${authorId}`
    }

    public static settings() {
        return '/settings'
    }
}


export default RouterPathGenerator