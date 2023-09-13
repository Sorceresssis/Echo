import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from 'vue-router'


const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: () => import('../views/Welcome.vue'),
    },
    {
        path: '/library/:id',
        component: () => import('../views/library/Library.vue'),
        meta: {
            keepAlive: true
        },
        children: [
            {
                path: '',
                component: () => import('../views/library/dashboard/Dashboard.vue'),
            },
            {
                path: 'author',
                component: () => import('../views/library/author/Author.vue'),
            },
            {
                path: 'manage',
                component: () => import('../views/library/manage/Mange.vue'),
            },
        ]
    },
    {
        path: '/setting',
        component: () => import('../views/settings/Settings.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router