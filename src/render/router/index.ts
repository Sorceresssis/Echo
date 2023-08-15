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
                path: '',
                component: () => import('../views/library/dashboard/Dashboard.vue'),
                children: [
                    {
                        path: '',
                        component: () => import('../views/library/dashboard/Records.vue')
                    }
                ]
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
    history: createWebHistory(),
    routes
})

export default router