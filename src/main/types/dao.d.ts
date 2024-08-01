declare namespace DAO {
    /**
     * type R 代表读取（Read），W 代表写入(Create / Update)
     */
    // ANCHOR DB group
    type Group_R = Omit<Entity.Group, 'prev_id' | 'next_id'>

    type Library_R = Omit<Entity.Library, 'prev_id' | 'next_id' | 'group_id'>

    type LibraryExtra_R = Entity.LibraryExtra

    type LibraryExtra_W = Entity.LibraryExtra


    // ANCHOR DB Library 
    // 在包裹一层Omit, 编辑器可以直接列出所有字段
    type Record_R = Omit<
        Omit<Entity.Record, 'dirname_id' | 'recycled' | 'info_status' | 'tag_author_sum'> & { dirname: string | null }, ''
    >

    type RecordExhibit_R = Omit<DAO.Record_R, 'search_text'>

    type RecordProfile_R = Pick<Entity.Record, 'id' | 'title' | 'translated_title'>

    type Record_W = Omit<Entity.Record,
        'recycled' | 'create_time' | 'update_time'
    >

    type RecordExtra_R = Entity.RecordExtra

    type RecordExtra_W = Entity.RecordExtra

    type Author_R = Entity.Author

    type AuthorProfile_R = Omit<Entity.Author, 'intro' | 'create_time' | 'update_time'>

    type Author_W = Omit<Entity.Author, 'create_time' | 'update_time'>





}
