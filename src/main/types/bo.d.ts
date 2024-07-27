declare namespace BO {
    type PagedResult = {
        results: T[]
        total: number
    }

    type Group = Omit<Entity.Group, 'prev_id' | 'next_id'>

    type Library = Omit<Entity.Library, 'prev_id' | 'next_id' | 'group_id'>














}
