declare namespace DAO {
    interface AllQueryResult<T> {
        total: number
        rows: T[]
    }
}
