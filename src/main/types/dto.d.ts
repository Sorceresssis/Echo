declare namespace DTO {
    type PagedResult<T> = {
        results: T[]
        page: {
            pn: number
            ps: number
            total_count: number
            total_page: number
        }
    }

    /**
     * 批量删除record的表单
     */
    type DeleteRecordByAttributeForm = {
        dirnamePath: string
        tagTitle: string
        seriesName: string
    }
}