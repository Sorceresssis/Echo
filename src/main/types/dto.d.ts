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

    type ResponseResult<T> = {
        code: number
        msg: string
        data?: T
    }
}