export default {
    welcome: () => '/',

    libraryBashboard: (libraryId: number | string) => `/library/${libraryId}`,
    libraryManage: (libraryId: number | string) => `/library/${libraryId}/manage`,
    libraryEditAuthor: (libraryId: number | string, authorId: number | string) => `/library/${libraryId}/manage?author_id=${authorId}`,
    libraryEditRecord: (libraryId: number | string, recordId: number | string) => `/library/${libraryId}/manage?record_id=${recordId}`,

    libraryAuthor: (libraryId: number | string, authorId: number | string) => `/library/${libraryId}/author/${authorId}`,

    settings: () => '/settings'
}  