import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'


const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: () => import('../components/MainContainer.vue'),
    },
    {
        path: '/library/:id',
        component: () => import('../components/MainContainer.vue'),
        children: [
            {
                path: 'author',
                component: () => import('../components/Author.vue')
            }
        ]
    },
    {
        path: '/setting',
        component: () => import('../components/Settings.vue')
    },
    {
        path: '/author',
        component: () => import('../components/Author.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router