import { defineStore } from 'pinia'
import StoreId from './storeId'

type AuthorsDashState = {
    sortField: DTO.QueryAuthorRecommendationsOptions['sortField']
    order: 'ASC' | 'DESC',
    roleFilterMode: DTO.QueryAuthorRecommendationsOptions['roleFilterMode']
    role: number
}


const useAuthorsDashStore = defineStore(StoreId.AUTHORS_DASH, {
    state: (): AuthorsDashState => {
        const defaultState: AuthorsDashState = {
            sortField: 'name',
            order: 'ASC',
            roleFilterMode: 'None',
            role: 0,
        }

        return defaultState
    },
    actions: {
        handleSortField(field: AuthorsDashState['sortField']) {
            this.sortField = field
        },
        handleOrder(order: 'ASC' | 'DESC') {
            this.order = order
        },
        setRole(mode: DTO.QueryAuthorRecommendationsOptions['roleFilterMode'], role?: number) {
            if (mode === 'None' || mode === 'DEFAULT') {
                this.roleFilterMode = mode
                this.role = 0
            } else if (role && role > 0) {
                this.roleFilterMode = mode
                this.role = role
            }
        }
    }
})

export default useAuthorsDashStore