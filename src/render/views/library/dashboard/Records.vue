<template>
    <div class="flex-col">
        <div v-if="isBatchOperation"
             class="dashboard__header divider">
            <div class="left-menu">
                <span class="batch-processing-btn"
                      @click="isBatchOperation = false">返回</span>
            </div>
            <div class="right-menu">
                <span class="batch-processing-btn menu-item">全选</span>
                <span class="batch-processing-btn menu-item">删除</span>
            </div>
        </div>
        <div v-else
             class="dashboard__header">
            <div class="left-menu">
                <div class="batch-processing-btn"
                     @click="isBatchOperation = true">批量操作</div>
            </div>
            <div class="right-menu">
                <echo-autocomplete class="menu-item search"
                                   v-model="s"
                                   :placeholder="'搜索'" />
                <dash-drop-menu v-for="menu in dropdownMenus"
                                :menu="menu"
                                class="menu-item" />
            </div>
        </div>
        <scrollbar v-loading="loading"
                   ref="scrollbarRef"
                   class="dashboard__content scrollbar-y-w8">
            <empty v-if="recordRecmds.length == 0" />
            <div v-else
                 class="record-recommendations adaptive-grid"
                 :class="[`${recordsDashStore.view}-grid`]">
                <record-card v-for="recmd in recordRecmds"
                             :key="recmd.id"
                             :recmd="recmd">
                </record-card>
            </div>
        </scrollbar>
        <el-pagination v-model:current-page="currentPage"
                       class="dashboard__footer"
                       background
                       small
                       :page-size="pageSize"
                       layout="prev, pager, next, jumper, total"
                       :total="total" />
    </div>
</template>

<script setup lang='ts'>
import { onMounted, reactive, ref, onActivated } from 'vue'
import { useRoute } from 'vue-router'
import { $t } from '@/locales/index'
import useRecordsDashStore from '@/store/recordsDashStore'
import Empty from '@/components/Empty.vue'
import EchoAutocomplete from '@/components/EchoAutocomplete.vue'
import DashDropMenu from '@/components/DashDropMenu.vue'
import Scrollbar from '@/components/Scrollbar.vue'
import RecordCard from '@/components/RecordCard.vue'

// records type common, author, reycycled

const enum FilterKey {
    cover = 0,
    hyperlink,
    basename,
}
const route = useRoute()

const pageSize = 20
const recordsDashStore = useRecordsDashStore()

const dropdownMenus: DashDropMenu[] = [
    {
        HTMLElementTitle: $t('mainContainer.filter'),
        title: '&#xe7e6;',
        items: [
            {
                title: '有封面',
                divided: false,
                click: () => recordsDashStore.handleFilter(FilterKey.cover),
                dot: () => recordsDashStore.filter[FilterKey.cover]
            },
            {
                title: '有链接',
                divided: false,
                click: () => recordsDashStore.handleFilter(FilterKey.hyperlink),
                dot: () => recordsDashStore.filter[FilterKey.hyperlink]
            },
            {
                title: '有文件',
                divided: false,
                click: () => recordsDashStore.handleFilter(FilterKey.basename),
                dot: () => recordsDashStore.filter[FilterKey.basename]
            },
        ]
    },
    {
        HTMLElementTitle: $t('mainContainer.sort'),
        title: '&#xe81f;',
        items: [
            {
                title: $t('mainContainer.time'),
                divided: false,
                click: () => recordsDashStore.handleSortField('date'),
                dot: () => recordsDashStore.sortField === 'date'
            },
            {
                title: '名称',
                divided: false,
                click: () => recordsDashStore.handleSortField('title'),
                dot: () => recordsDashStore.sortField === 'title'
            },
            {
                title: '评分',
                divided: false,
                click: () => recordsDashStore.handleSortField('rate'),
                dot: () => recordsDashStore.sortField === 'rate'
            },
            {
                title: $t('mainContainer.ascending'),
                divided: true,
                click: () => recordsDashStore.handleAsc(true),
                dot: () => recordsDashStore.asc
            },
            {
                title: $t('mainContainer.descending'),
                divided: false,
                click: () => recordsDashStore.handleAsc(false),
                dot: () => !recordsDashStore.asc
            },
        ]
    },
    {
        HTMLElementTitle: '视图',
        title: '&#xe6c7;',
        items: [
            {
                title: '紧凑',
                divided: false,
                click: () => recordsDashStore.handleView('compact'),
                dot: () => recordsDashStore.view === 'compact'
            },
            {
                title: $t('mainContainer.thumbnail'),
                divided: false,
                click: () => recordsDashStore.handleView('thumbnail'),
                dot: () => recordsDashStore.view === 'thumbnail'
            },
            {
                title: $t('mainContainer.extended'),
                divided: false,
                click: () => recordsDashStore.handleView('extended'),
                dot: () => recordsDashStore.view === 'extended'
            },
        ]
    }
]
const loading = ref<boolean>(false)
const scrollbarRef = ref()
// sort attribute order
// 开启批量操作
const isBatchOperation = ref(false)
const s = ref<string>('')
const total = ref(200)

const currentPage = ref(5)
const recordRecmds = ref<VO.RecordRecommendation[]>([])



const isVisibleCtmItem = ref(false)
const contextMenuOptions = {
    zIndex: 3,
    minWidth: 300,
    x: 500,
    y: 200
}
const openCtm = (e: MouseEvent) => {
    contextMenuOptions.x = e.x
    contextMenuOptions.y = e.y
    isVisibleCtmItem.value = true
}

onActivated(() => {
    // queryData
})

// 复制信息 复制标题，全部信息，编辑， 删除
onMounted(() => {
    recordRecmds.value = [
        {
            id: 1,
            title: '键的设计哦加哦就i哦啊街道； 哦i就哦集散地哦叫解耦i就i欧几哦急哦解耦i收到',
            rate: 5,
            cover: 'C:\\Users\\RachelGardner\\OneDrive\\图片\\ACG\\illust_100114922_20221025_211912.jpg',
            hyperlink: 'baidu.com',
            resourcePath: 'F:\\Project\\sdfs',
            authors: [
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                }
            ],
            tags: [
                {
                    id: 1,
                    title: 'ffff'
                },
                {
                    id: 1,
                    title: '标签4'
                }
            ],
        },
        {
            id: 1,
            title: '键的设计哦加哦就i哦啊街道； 哦i就哦集散地哦叫解耦i就i欧几哦急哦解耦i收到',
            rate: 5,
            cover: 'F:\\Desktop\\images\\2.jpg',
            hyperlink: '',
            resourcePath: 'F:\\Project\\Github\\echoDB',
            authors: [
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                }
            ],
            tags: [
                {
                    id: 1,
                    title: 'ffff'
                },
                {
                    id: 1,
                    title: '标签4'
                }
            ],
        },
        {
            id: 1,
            title: '键的设计哦加哦就i哦啊街道； 哦i就哦集散地哦叫解耦i就i欧几哦急哦解耦i收到',
            rate: 5,
            cover: 'F:\\Desktop\\images\\4.jpg',
            hyperlink: '',
            resourcePath: 'F:\\Project\\Github\\echoDB',
            authors: [
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                }
            ],
            tags: [
                {
                    id: 1,
                    title: 'ffff'
                },
                {
                    id: 1,
                    title: '标签4'
                }
            ],
        },
        {
            id: 1,
            title: '键的设计哦加哦就i哦啊街道； 哦i就哦集散地哦叫解耦i就i欧几哦急哦解耦i收到',
            rate: 5,
            cover: 'C:\\Users\\RachelGardner\\OneDrive\\图片\\ACG\\illust_100114922_20221025_211912.jpg',
            hyperlink: '',
            resourcePath: 'F:\\Project\\Github\\echoDB',
            authors: [
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                }
            ],
            tags: [
                {
                    id: 1,
                    title: 'ffff'
                },
                {
                    id: 1,
                    title: '标签4'
                }
            ],
        },
        {
            id: 1,
            title: '键的设计哦加哦就i哦啊街道； 哦i就哦集散地哦叫解耦i就i欧几哦急哦解耦i收到',
            rate: 5,
            cover: 'C:\\Users\\RachelGardner\\OneDrive\\图片\\ACG\\illust_100114922_20221025_211912.jpg',
            hyperlink: '',
            resourcePath: 'F:\\Project\\Github\\echoDB',
            authors: [
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                }
            ],
            tags: [
                {
                    id: 1,
                    title: 'ffff'
                },
                {
                    id: 1,
                    title: '标签4'
                }
            ],
        },
        {
            id: 1,
            title: '键的设计哦加哦就i哦啊街道； 哦i就哦集散地哦叫解耦i就i欧几哦急哦解耦i收到',
            rate: 5,
            cover: 'C:\\Users\\RachelGardner\\OneDrive\\图片\\ACG\\illust_100114922_20221025_211912.jpg',
            hyperlink: '',
            resourcePath: 'F:\\Project\\Github\\echoDB',
            authors: [
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                }
            ],
            tags: [
                {
                    id: 1,
                    title: 'ffff'
                },
                {
                    id: 1,
                    title: '标签4'
                }
            ],
        },
        {
            id: 1,
            title: '键的设计哦加哦就i哦啊街道； 哦i就哦集散地哦叫解耦i就i欧几哦急哦解耦i收到',
            rate: 5,
            cover: 'C:\\Users\\RachelGardner\\OneDrive\\图片\\ACG\\illust_100114922_20221025_211912.jpg',
            hyperlink: '',
            resourcePath: 'F:\\Project\\Github\\echoDB',
            authors: [
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                }
            ],
            tags: [
                {
                    id: 1,
                    title: 'ffff'
                },
                {
                    id: 1,
                    title: '标签4'
                }
            ],
        },
        {
            id: 1,
            title: '键的设计哦加哦就i哦啊街道； 哦i就哦集散地哦叫解耦i就i欧几哦急哦解耦i收到',
            rate: 5,
            cover: 'C:\\Users\\RachelGardner\\OneDrive\\图片\\ACG\\illust_100114922_20221025_211912.jpg',
            hyperlink: '',
            resourcePath: 'F:\\Project\\Github\\echoDB',
            authors: [
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                }
            ],
            tags: [
                {
                    id: 1,
                    title: 'ffff'
                },
                {
                    id: 1,
                    title: '标签4'
                }
            ],
        },
        {
            id: 1,
            title: '键的设计哦加哦就i哦啊街道； 哦i就哦集散地哦叫解耦i就i欧几哦急哦解耦i收到',
            rate: 5,
            cover: 'C:\\Users\\RachelGardner\\OneDrive\\图片\\ACG\\illust_100114922_20221025_211912.jpg',
            hyperlink: '',
            resourcePath: 'F:\\Project\\Github\\echoDB',
            authors: [
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                }
            ],
            tags: [
                {
                    id: 1,
                    title: 'ffff'
                },
                {
                    id: 1,
                    title: '标签4'
                }
            ],
        },
        {
            id: 1,
            title: '键的设计哦加哦就i哦啊街道； 哦i就哦集散地哦叫解耦i就i欧几哦急哦解耦i收到',
            rate: 5,
            cover: 'C:\\Users\\RachelGardner\\OneDrive\\图片\\ACG\\illust_100114922_20221025_211912.jpg',
            hyperlink: '',
            resourcePath: 'F:\\Project\\Github\\echoDB',
            authors: [
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                }
            ],
            tags: [
                {
                    id: 1,
                    title: 'ffff'
                },
                {
                    id: 1,
                    title: '标签4'
                }
            ],
        },
        {
            id: 1,
            title: '键的设计哦加哦就i哦啊街道； 哦i就哦集散地哦叫解耦i就i欧几哦急哦解耦i收到',
            rate: 5,
            cover: 'C:\\Users\\RachelGardner\\OneDrive\\图片\\ACG\\illust_100114922_20221025_211912.jpg',
            hyperlink: '',
            resourcePath: 'F:\\Project\\Github\\echoDB',
            authors: [
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                }
            ],
            tags: [
                {
                    id: 1,
                    title: 'ffff'
                },
                {
                    id: 1,
                    title: '标签4'
                }
            ],
        },
        {
            id: 1,
            title: '键的设计哦加哦就i哦啊街道； 哦i就哦集散地哦叫解耦i就i欧几哦急哦解耦i收到',
            rate: 5,
            cover: 'C:\\Users\\RachelGardner\\OneDrive\\图片\\ACG\\illust_100114922_20221025_211912.jpg',
            hyperlink: '',
            resourcePath: 'F:\\Project\\Github\\echoDB',
            authors: [
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                }
            ],
            tags: [
                {
                    id: 1,
                    title: 'ffff'
                },
                {
                    id: 1,
                    title: '标签4'
                }
            ],
        },
        {
            id: 1,
            title: '键的设计哦加哦就i哦啊街道； 哦i就哦集散地哦叫解耦i就i欧几哦急哦解耦i收到',
            rate: 5,
            cover: 'C:\\Users\\RachelGardner\\OneDrive\\图片\\ACG\\illust_100114922_20221025_211912.jpg',
            hyperlink: '',
            resourcePath: 'F:\\Project\\Github\\echoDB',
            authors: [
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                }
            ],
            tags: [
                {
                    id: 1,
                    title: 'ffff'
                },
                {
                    id: 1,
                    title: '标签4'
                }
            ],
        },
        {
            id: 1,
            title: '键的设计哦加哦就i哦啊街道； 哦i就哦集散地哦叫解耦i就i欧几哦急哦解耦i收到',
            rate: 5,
            cover: 'C:\\Users\\RachelGardner\\OneDrive\\图片\\ACG\\illust_100114922_20221025_211912.jpg',
            hyperlink: '',
            resourcePath: 'F:\\Project\\Github\\echoDB',
            authors: [
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                }
            ],
            tags: [
                {
                    id: 1,
                    title: 'ffff'
                },
                {
                    id: 1,
                    title: '标签4'
                }
            ],
        },
        {
            id: 1,
            title: '键的设计哦加哦就i哦啊街道； 哦i就哦集散地哦叫解耦i就i欧几哦急哦解耦i收到',
            rate: 5,
            cover: 'C:\\Users\\RachelGardner\\OneDrive\\图片\\ACG\\illust_100114922_20221025_211912.jpg',
            hyperlink: '',
            resourcePath: 'F:\\Project\\Github\\echoDB',
            authors: [
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                }
            ],
            tags: [
                {
                    id: 1,
                    title: 'ffff'
                },
                {
                    id: 1,
                    title: '标签4'
                }
            ],
        },
        {
            id: 1,
            title: '键的设计哦加哦就i哦啊街道； 哦i就哦集散地哦叫解耦i就i欧几哦急哦解耦i收到',
            rate: 5,
            cover: 'C:\\Users\\RachelGardner\\OneDrive\\图片\\ACG\\illust_100114922_20221025_211912.jpg',
            hyperlink: '',
            resourcePath: 'F:\\Project\\Github\\echoDB',
            authors: [
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                }
            ],
            tags: [
                {
                    id: 1,
                    title: 'ffff'
                },
                {
                    id: 1,
                    title: '标签4'
                }
            ],
        },
        {
            id: 1,
            title: '键的设计哦加哦就i哦啊街道； 哦i就哦集散地哦叫解耦i就i欧几哦急哦解耦i收到',
            rate: 5,
            cover: 'C:\\Users\\RachelGardner\\OneDrive\\图片\\ACG\\illust_100114922_20221025_211912.jpg',
            hyperlink: '',
            resourcePath: 'F:\\Project\\Github\\echoDB',
            authors: [
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                }
            ],
            tags: [
                {
                    id: 1,
                    title: 'ffff'
                },
                {
                    id: 1,
                    title: '标签4'
                }
            ],
        },
        {
            id: 1,
            title: '键的设计哦加哦就i哦啊街道； 哦i就哦集散地哦叫解耦i就i欧几哦急哦解耦i收到',
            rate: 5,
            cover: 'C:\\Users\\RachelGardner\\OneDrive\\图片\\ACG\\illust_100114922_20221025_211912.jpg',
            hyperlink: '',
            resourcePath: 'F:\\Project\\Github\\echoDB',
            authors: [
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 1,
                    name: '标签2',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                },
                {
                    id: 2,
                    name: '小丑',
                    avatar: 'F:\\Desktop\\images\\息屏.png'
                }
            ],
            tags: [
                {
                    id: 1,
                    title: 'ffff'
                },
                {
                    id: 1,
                    title: '标签4'
                }
            ],
        },
    ]
})

</script>

<style scoped>
.batch-processing-btn {
    cursor: pointer;
}

.batch-processing-btn:hover {
    color: var(--echo-theme-color);
}
</style>