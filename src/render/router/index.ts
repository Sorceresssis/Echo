import { createRouter, createWebHashHistory, RouteRecord, RouteRecordRaw } from 'vue-router'


const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        component: () => import('../components/MainContainer.vue'),
    },
    {
        path: "/setting",
        component: () => import('../components/Settings.vue')
    },
    {
        path: "/author",
        component: () => import('../components/Author.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router