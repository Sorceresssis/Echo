declare namespace DAO {


    interface AllQueryResult<T> {
        rows: T[]
        total: number
    }
    // 它代表创建（Create）、更新（Update）、读取（Read）和删除（Delete）操作。

    interface page {
        results: T[]
        has_more: boolean
        page: {
            pn: number,
            ps: number,
            total_count: number
            total_page: number
        }
    }




}
