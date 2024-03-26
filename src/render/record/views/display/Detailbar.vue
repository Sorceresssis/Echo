<template>
    <div class="record-detail-sidebar">
        <scrollbar class="record-info scrollbar-y-w4"
            :show-back-top="false">
            <div class="record-info__warp">
                <div v-if="slickCarouselImages.length"
                    class="meta">
                    <image-slider :images="slickCarouselImages" />
                </div>
                <h1 class="title">{{ record.title }}</h1>
                <div class="meta">
                    <div class="inline-list-title">{{ $t('layout.rate') }}</div>
                    <div class="meta-content">
                        <el-rate v-model="record.rate"
                            size="small"
                            disabled />
                    </div>
                </div>
                <div v-if="record.authors.length"
                    class="meta">
                    <div class="inline-list-title"> {{ $t('layout.authors') }} </div>
                    <ul class="meta-content">
                        <li v-for="author in record.authors"
                            :key="author.id"
                            class="author">
                            <local-image :src="author.avatar"
                                class="avatar-icon" />
                            <span class="author_name"> {{ author.name }} </span>
                            <span v-if="author.role">({{ author.role }})</span>
                        </li>
                    </ul>
                </div>
                <div v-if="record.tags.length"
                    class="meta">
                    <div class="inline-list-title"> {{ $t('layout.tags') }} </div>
                    <div class="meta-content">
                        <span v-for="tag in record.tags"
                            :key="tag.id"
                            class="tag">{{ tag.title }}</span>
                    </div>
                </div>
                <div v-if="record.intro.length"
                    class="meta">
                    <div class="inline-list-title"> {{ $t('layout.intro') }} </div>
                    <div class="meta-content"> {{ record.intro }} </div>
                </div>
                <div v-if="record.info.length"
                    class="meta">
                    <div class="inline-list-title"> {{ $t('layout.info') }} </div>
                    <div class="meta-content"> {{ record.info }} </div>
                </div>
                <div class="meta">
                    <div class="inline-list-title">ID</div>
                    <div class="meta-comtent">{{ record.id }}</div>
                </div>
                <div class="meta">
                    <div class="inline-list-title"> {{ $t('layout.createdTime') }} </div>
                    <div class="meta-comtent"> {{ record.createTime }} </div>
                </div>
                <div class="meta">
                    <div class="inline-list-title"> {{ $t('layout.lastModifiedTime') }} </div>
                    <div class="meta-comtent"> {{ record.modifiedTime }} </div>
                </div>
                <div v-if="slickCarouselImages.length"
                    class="meta">
                    <button2 @click="openInExplorer(slickCarouselImages[0])">
                        {{ $t('layout.showImagesInExplorer') }}
                    </button2>
                </div>
            </div>
        </scrollbar>
        <div class="divider" />
        <scrollbar class="series-list scrollbar-y-w4"
            :show-back-top="false">
            <empty v-if="record.series.length === 0"
                :title="$t('layout.noSeries')" />
            <ul v-else
                class="adaptive-grid">
                <li v-for="series in record.series"
                    :key="series.id"
                    class="dashboard-text-card"
                    @click="openSeries(series.id)">
                    <div class="content">
                        <span :title="series.name"
                            class="textover--ellopsis">{{ series.name }}</span>
                    </div>
                    <div class="operate">
                        <span class="iconfont"
                            :title="$t('layout.copyToClipboard')"
                            @click.stop="writeClibboard(series.name)">&#xe85c;</span>
                        <span class="iconfont"
                            :title="$t('layout.edit')"
                            @click.stop="editSeries(series.id, series.name)">&#xe722;</span>
                        <span class="iconfont"
                            :title="$t('layout.delete')"
                            @click.stop="deleteSeries(series.id)">&#xe636;</span>
                    </div>
                </li>
            </ul>
            <el-drawer v-model="drawerVisible"
                direction="btt"
                size="80%"
                class="series-content-drawer">
                <template #header="{ close, titleId, titleClass }">
                    <h4 :id="titleId"
                        :class="titleClass"
                        :title="record.series.find(s => s.id === activeSeriesId)?.name">
                        {{ record.series.find(s => s.id === activeSeriesId)?.name }} </h4>
                </template>
                <records type="series"
                    @remove-record-from-series="handleRemoveRecordFromSeries" />
            </el-drawer>
        </scrollbar>
    </div>
</template>

<script setup
    lang='ts'>
    import { ref, Ref, readonly, inject, watch, onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    import { $t } from '@/locale';
    import { writeClibboard, openInExplorer } from '@/util/systemUtil'
    import MessageBox from '@/util/MessageBox'
    import LocalImage from '@/components/LocalImage.vue'
    import ImageSlider from '@/components/ImageSlider.vue'
    import Scrollbar from '@/components/Scrollbar.vue'
    import Empty from '@/components/Empty.vue'
    import Records from '@/views/library/dashboard/Records.vue'
    import Button2 from '@/components/Button2.vue'

    const router = useRouter()

    const drawerVisible = ref(false)

    const activeLibrary = readonly(inject<Ref<number>>('activeLibrary')!)
    const record = inject<VO.RecordDetail>('record')!
    const activeSeriesId = ref<number>(0)
    const slickCarouselImages = ref<string[]>([])
    const genSlickCarouselImages = function () {
        slickCarouselImages.value = record.cover ? [record.cover, ...record.sampleImages] : record.sampleImages
    }
    watch(record, genSlickCarouselImages)

    const deleteSeries = (id: number) => {
        MessageBox.deleteConfirm().then(async () => {
            window.electronAPI.deleteSeries(activeLibrary.value, id).then(result => {
                if (result.code) {
                    record.series = record.series.filter(s => s.id !== id)
                }
            })
        })
    }

    const editSeries = (id: number, oldValue: string) => {
        MessageBox.editPrompt(
            (value: string) => {
                const reg = /\S/
                if (!reg.test(value)) return $t('tips.inputValueNotEmpty')
                const maxLen = 255
                if (value.length > maxLen) return $t('tips.lengthLimitExceeded', { count: maxLen })
                return true
            }, oldValue
        ).then(({ value }) => {
            MessageBox.editConfirm().then(async () => {
                const trimValue = value.trim()
                if (trimValue === '' || trimValue === oldValue) return

                window.electronAPI.editSeries(activeLibrary.value, id, trimValue).then(result => {
                    if (result.code) {
                        record.series = record.series.map(s => {
                            if (s.id === id) {
                                s.name = trimValue
                            }
                            return s
                        })
                    }
                })
            })
        })
    }

    const openSeries = (id: number) => {
        router.push(`/?seriesId=${id}`)
        activeSeriesId.value = id
        drawerVisible.value = true
    }

    const handleRemoveRecordFromSeries = (recordId: number, seriesId: number) => {
        if (recordId === record.id) {
            record.series = record.series.filter(s => s.id !== seriesId)
        }
    }

    onMounted(genSlickCarouselImages)

</script>

<style scoped>
    .record-detail-sidebar {
        --record-detail-sidebar-width: 500px;
        width: var(--record-detail-sidebar-width);
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-left: 10px;
        box-sizing: border-box;
    }

    .divider {
        margin-top: 5px;
        margin-bottom: 5px;
    }

    .record-info {
        --record-info-line-height: 24px;
        flex: 1;
        display: flex;
        flex-direction: column;
        padding-right: 6px;
        user-select: text;
    }

    .record-info__warp {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 10px;
        box-sizing: border-box;
    }

    .record-info .title {
        line-height: 26px;
        font-size: 16px;
        font-weight: 700;
    }

    .record-info .meta {
        display: flex;
        line-height: var(--record-info-line-height);
        font-size: 13px;
    }

    .record-info .meta-content {
        display: flex;
        flex-wrap: wrap;
        white-space: pre-line;
    }

    .record-info .author {
        margin-right: 14px;
    }

    .record-info .author .avatar-icon {
        height: var(--record-info-line-height);
        width: var(--record-info-line-height);
    }

    .record-info .author .author_name {
        margin-left: 4px;
        color: var(--echo-emphasis-color);
    }

    .record-info .tag {
        margin-right: 10px;
        color: var(--echo-emphasis-color);
    }

    .record-info .tag::before {
        content: '\e701';
        font-family: "iconfont" !important;
        color: #000
    }

    .series-list {
        height: 100px;
        display: flex;
        flex-direction: column;
        padding: 5px 6px 5px 0;
    }

    .series-list .adaptive-grid {
        row-gap: 8px;
        column-gap: 8px;
        grid-template-columns: repeat(auto-fill, calc(var(--record-detail-sidebar-width) - 50px));
    }
</style>