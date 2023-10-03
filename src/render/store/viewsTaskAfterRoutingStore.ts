import { defineStore } from 'pinia'
import StoreId from './storeId'

type ViewTask = 'none' | 'refresh' | 'init'
type ViewsTaskAfterRoutingState = {
    bashboard: ViewTask,
    bashboardRecords: ViewTask,
    bashboardAuthors: ViewTask,
    bashboardRecycled: ViewTask,
    bashboardTags: ViewTask,
    bashboardDirnames: ViewTask,
    authorRecords: ViewTask,
}

const useViewsTaskAfterRoutingStore = defineStore(StoreId.VIEWS_TASK_AFTER_ROUTING, {
    state: (): ViewsTaskAfterRoutingState => {
        return {
            bashboard: 'none',
            bashboardRecords: 'none',
            bashboardAuthors: 'none',
            bashboardRecycled: 'none',
            bashboardTags: 'none',
            bashboardDirnames: 'none',
            authorRecords: 'none',
        }
    },
    actions: {
        setAllViews(task: ViewTask) {
            this.setBashboard(task)
            this.setBashboardRecords(task)
            this.setBashboardAuthors(task)
            this.setBashboardRecycled(task)
            this.setBashboardTags(task)
            this.setBashboardDirnames(task)
            this.setAuthorRecords(task)
        },
        setBashboard(task: ViewTask) {
            this.bashboard = task
        },
        setBashboardRecords(task: ViewTask) {
            this.bashboardRecords = task
        },
        setBashboardAuthors(task: ViewTask) {
            this.bashboardAuthors = task
        },
        setBashboardRecycled(task: ViewTask) {
            this.bashboardRecycled = task
        },
        setBashboardTags(task: ViewTask) {
            this.bashboardTags = task
        },
        setBashboardDirnames(task: ViewTask) {
            this.bashboardDirnames = task
        },
        setAuthorRecords(task: ViewTask) {
            this.authorRecords = task
        },
    }
})


export default useViewsTaskAfterRoutingStore