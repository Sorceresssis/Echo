import { ref, reactive } from "vue"
import Message from "@/util/Message"

// 简单类型
type SimpleType = string | number | boolean | undefined | null | symbol

type ManageRecordForm = {
    id: number,
    dirname: string,
    basename: string,
    batchDir: string,
    title: string,
    hyperlink: string,
    cover: string,
    originCover: string,
    rate: number,
    addTags: string[],
    removeTags: number[],
    addAuthors: number[],
    removeAuthors: number[],
    addSeries: string[],
    removeSeries: number[],
    intro: string,
    info: string
}

const useManageRecordService = () => {
    /**
     * 添加属性, 注意：K,V 不能是复杂类型，如对象，数组等, 因为Set, Map都是===比较
     * display === origin + add - remove 等式左右完全相等，且add和remove不相交
     * @param origin 原本的数据容器
     * @param display 实时展示给用户的数据容器
     * @param remove 提供给后台的删除数据容器
     * @param add 提供给后台的添加数据容器
     * @param value 用户操作的数据
     * @returns 
     */
    const attributeAdder = <K extends SimpleType, V extends SimpleType>(
        origin: Map<V, K>, display: Array<V>, remove: Set<K>, add: Set<V>, value: V
    ): boolean => {
        if (-1 !== display.indexOf(value)) {
            return false
        }
        // 等式左边
        display.push(value)
        // 等式右边
        const k = origin.get(value)
        k ? remove.delete(k) : add.add(value)
        return true
    }

    /**
     *  删除属性 其他注释同attributeAdder
     */
    const attributeRemover = <K extends SimpleType, V extends SimpleType>(
        origin: Map<V, K>, display: Array<V>, remove: Set<K>, add: Set<V>, value: V
    ): boolean => {
        const idx = display.indexOf(value)
        if (-1 === idx) return false
        // 等式左边
        display.splice(idx, 1)
        // 等式右边: 两种平衡方式：1.移除(remove.add())
        const k = origin.get(value)
        k ? remove.add(k) : add.delete(value)
        return true
    }

    const originTags = new Map<string, number>()    // 保存{id: 1, name: 'tag1'}这样的对象
    const displayTags = reactive<Array<string>>([]) // 保存string类型的name
    const addTags = new Set<string>()               // 保存string类型的name
    const removeTags = new Set<number>()            // 保存int类型的id
    const tagAdder = (value: string) => {
        const tag = value.trim()       // 去除空格
        if (tag.length === 0) return   // 空字符串不处理
        if (!attributeAdder(originTags, displayTags, removeTags, addTags, tag)) {
            Message.error('标签已存在')
        }
    }
    const tagRemover = (value: string) => {
        attributeRemover(originTags, displayTags, removeTags, addTags, value)
    }

    const originSeries = new Map<string, number>()    // 保存{id: 1, name: 'tag1'}这样的对象
    const displaySeries = reactive<Array<string>>([]) // 保存string类型的name
    const addSeries = new Set<string>()               // 保存string类型的name
    const removeSeries = new Set<number>()            // 保存int类型的id
    const seriesAdder = (value: string) => {
        const series = value.trim()       // 去除空格
        if (series.length === 0) return   // 空字符串不处理 
        if (!attributeAdder(originSeries, displaySeries, removeSeries, addSeries, series)) {
            Message.error('已加入系列')
        }
    }
    const seriesRemover = (value: string) => {
        attributeRemover(originSeries, displaySeries, removeSeries, addSeries, value)
    }

    const originAuthors = new Map<number, number>()         // 保存{id: 1, name: 'tag1'}这样的对象
    const __displayAuthors = Array<number>()                // 保存int类型的id
    const displayAuthors = reactive<Array<{                 // 保存作者详细信息的
        id: number, name: string, avatar?: string,
    }>>([])
    const addAuthors = new Set<number>()                    // 保存int类型的id
    const removeAuthors = new Set<number>()                 // 保存int类型的id  
    const authorAdder = (obj: AcSuggestion) => {
        // 插入作者id
        attributeAdder(originAuthors, __displayAuthors, removeAuthors, addAuthors, obj.id) ?
            displayAuthors.push({
                id: obj.id,
                name: obj.value,
                avatar: obj.image
            })
            : Message.error('已加入作者')
    }
    const authorRemover = (id: number) => {
        if (attributeRemover(originAuthors, __displayAuthors, removeAuthors, addAuthors, id)) {
            // 删除作者详细信息
            displayAuthors.splice(displayAuthors.findIndex((v) => v.id === id), 1)
        }
    }

    const formData = reactive<ManageRecordForm>({
        id: 0,
        dirname: '',
        basename: '',
        batchDir: '',
        title: '',
        hyperlink: '',
        cover: '',
        originCover: '',
        rate: 0,
        addTags: [],
        removeTags: [],
        addAuthors: [],
        removeAuthors: [],
        addSeries: [],
        removeSeries: [],
        intro: '',
        info: ''
    })

    // ManageRecordOptions
    const options = reactive({
        batch: false,
        distinct: true,
    })

    const switchBatch = () => {
        options.batch = !options.batch
    }

    const selectRecordResource = async (type: 'dir' | 'file') => {
        const path = (await window.electronAPI.openDialog(type, false))[0]
        const idx = path.lastIndexOf(await window.systemAPI.pathSep())
        if (idx === -1) {
            Message.error('不能选择根目录')
            return
        }
        formData.dirname = path.substring(0, idx + 1)
        formData.basename = path.substring(idx + 1)
    }

    const selectBatchDir = async () => {
        const path = (await window.electronAPI.openDialog('dir', false))[0]
        if (path) {
            formData.batchDir = path
        }
    }

    const selectCover = async () => {
        const imgPath = (await window.electronAPI.openDialog('image', false))[0]
        if (imgPath) {
            formData.cover = imgPath
        }
    }

    const resetCover = () => {
        formData.cover = formData.originCover
    }

    const saveOriginData = (id?: number) => {
        if (id) {
            //  请求数据
            // window.electronAPI.

            // 写入原始数据
            // originTags.set()
            formData.id = id
        }
    }

    const submit = () => {
        // 1.检查数据
        // 2.提交数据 
        // window.electronAPI.manageREcord()
        formData.addTags = Array.from(addTags)
        formData.removeTags = Array.from(removeTags)
        formData.addAuthors = Array.from(addAuthors)
        formData.removeAuthors = Array.from(removeAuthors)
        formData.addSeries = Array.from(addSeries)
        formData.removeSeries = Array.from(removeSeries)
        console.log(formData)
    }

    const resetFormData = () => {
        formData.id = 0
        formData.dirname = ''
        formData.basename = ''
        formData.batchDir = ''
        formData.title = ''
        formData.hyperlink = ''
        formData.cover = ''
        formData.originCover = ''
        formData.rate = 0
        formData.addTags = []
        formData.removeTags = []
        formData.addAuthors = []
        formData.removeAuthors = []
        formData.addSeries = []
        formData.removeSeries = []
        formData.intro = ''
        formData.info = ''
    }

    return {
        // 标签
        displayTags,
        tagAdder,
        tagRemover,
        // 系列
        displaySeries,
        seriesAdder,
        seriesRemover,
        // 作者
        displayAuthors,
        authorAdder,
        authorRemover,
        // 表单数据 
        formData,
        options,
        switchBatch,
        selectCover,
        resetCover,
        selectRecordResource,
        selectBatchDir,
        // 表单行为
        saveOriginData,
        submit,
        resetFormData,
    }
}

export default useManageRecordService