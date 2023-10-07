import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'


const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: () => import('@/record/views/display/Display.vue'),
    },
    {
        path: '/manage',
        component: () => import('@/record/views/Mange.vue'),
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router