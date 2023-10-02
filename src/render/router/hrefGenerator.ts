export default {
    welcome: () => '/',
    libraryBashboard: (libraryId: number | string) => `/library/${libraryId}`,
    libraryManage: (libraryId: number | string, query: string) => `/library/${libraryId}/manage?${query}`,
    libraryAuthor: (libraryId: number | string, authorId: number | string) => `/library/${libraryId}/author/${authorId}`,
    settings: () => '/settings'
}  