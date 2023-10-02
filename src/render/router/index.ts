import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from 'vue-router'


const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: () => import('../views/Welcome.vue'),
    },
    {
        path: '/library/:libraryId',
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
                path: 'author/:authorId',
                component: () => import('../views/library/author/Author.vue'),
            },
            {
                path: 'manage',
                component: () => import('../views/library/manage/Mange.vue'),
            },
        ]
    },
    {
        path: '/settings',
        component: () => import('../views/settings/Settings.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router