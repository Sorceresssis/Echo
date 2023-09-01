import { createRouter, createWebHistory, createWebHashHistory, RouteRecordRaw } from 'vue-router'


const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: () => import('@/record/views/Display.vue'),
    },
    {
        path: '/manage',
        component: () => import('@/views/library/manage/Mange.vue'),
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router