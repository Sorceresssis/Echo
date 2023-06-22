import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'


const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: () => import('../views/Welcome.vue'),
    },
    {
        path: '/library/:id',
        component: () => import('../views/library/Library.vue'),
        children: [
            {
                path: 'author',
                component: () => import('../views/library/Author.vue')
            },
            {
                path: 'add',
                component: () => import('../views/library/AddRecord.vue')
            }
        ]
    },
    {
        path: '/setting',
        component: () => import('../views/Settings/Settings.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router