// 展示层对象
namespace VO {
    interface RecordCount {
        record_count: number
    }

    // ANCHOR DB Group
    type Group = Omit<DAO.Group_R & { librarys: VO.Library[] }, ''>

    type Library = Omit<DAO.Library_R & { dataPath: string }, ''>

    type LibraryDetail = Omit<DAO.Library_R & DAO.LibraryExtra_R, ''>

    // ANCHOR DB Library
    type Role = Entity.Role

    type AuthorProfile = Omit<DAO.AuthorProfile_R & { avatar?: string }, ''>

    type AuthorDetail = Omit<DAO.Author_R & VO.RecordCount & {
        avatar?: string
        sample_images: string[],
    }, ''>

    /**
     * 作者的推荐信息，用于首页展示,多出了作品列表和作品数量
     */
    type AuthorRecommendation = Omit<DAO.Author_R & VO.RecordCount & {
        avatar?: string,
        masterpieces: RecordProfile[]
    }, ''>

    type Tag = Entity.Tag

    type TagDetail = Omit<VO.Tag & RecordCount, ''>

    type Dirname = Entity.Dirname

    type DirnameDetail = Omit<VO.Dirname & RecordCount, ''>

    type Series = Entity.Series

    type RecordProfile = Omit<DAO.RecordProfile_R & { cover?: string, }, ''>

    type RecordAuthorRelation = {
        id: number,
        name: string
        avatar?: string
        role: VO.Role[]
    }

    type RecordDetail = Omit<DAO.Record_R & DAO.RecordExtra_R & {
        source_fullpath?: string
        cover?: string
        sample_images: string[]
        authors: VO.RecordAuthorRelation[]
        tags: VO.Tag[]
        series: VO.Series[]
    }, ''>

    type RecordRecommendation = Omit<DAO.RecordExhibit_R & {
        source_fullpath?: string
        cover?: string
        authors: VO.RecordAuthorRelation[]
        tags: VO.Tag[]
    }, ''>


    /**
     * 自动补齐的返回值
     */
    type AutoCompleteSuggestion = {
        type: 'record' | 'author' | 'tag' | 'series' | 'dirname'
        id: number
        value: string
        image?: string
    }
}