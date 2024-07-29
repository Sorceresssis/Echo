// 展示层对象
namespace VO {
    interface recordCount {
        record_count: number
    }

    // ANCHOR DB Group
    type Group = Omit<DAO.Group_R & {
        librarys: VO.Library[]
    }, ''>

    type Library = Omit<DAO.Library_R & {
        dataPath: string
    }, ''>

    type LibraryDetail = Omit<DAO.Library_R & DAO.LibraryExtra_R, ''>

    // ANCHOR DB Library
    type Role = Entity.Role

    type RecordAuthorRelation = {
        id: number,
        name: string
        avatar?: string
        role: VO.Role[]
    }

    type RecordAuthorProfile = {
        id: number,
        name: string,
        avatar: string | undefined,
        role: string | null,
    }

    type AuthorDetail = {
        id: number
        name: string
        avatar: string | undefined
        sampleImages: string[],
        intro: string
        createTime: string,
        modifiedTime: string,
        recordCount: number,
    }

    /**
     * 作者的推荐信息，用于首页展示,多出了作品列表和作品数量
     */
    type AuthorRecommendation = {
        id: number,
        name: string,
        avatar?: string,
        worksCount: number,
        intro: string,
        masterpieces: {
            id: number,
            cover?: string,
            title: string,
        }[]
    }


    type Tag = Entity.Tag

    type TagDetail = Omit<VO.Tag & recordCount, ''>

    type Dirname = Entity.Dirname

    type DirnameDetail = Omit<VO.Dirname & recordCount, ''>

    type Series = Entity.Series

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
    type AcSuggestion = {
        type: 'record' | 'author' | 'tag' | 'series' | 'dirname'
        id: number
        value: string
        image?: string
    }
}