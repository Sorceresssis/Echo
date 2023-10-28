import { reactive, toRaw } from "vue"
import Message from "@/util/Message"
import { $t } from "@/locale"

// 简单类型
type SimpleType = string | number | boolean | undefined | null | symbol

const useEditRecordService = () => {
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
    const tagAdder = () => {
        const tag = dispalyFormData.tagInput.trim()       // 去除空格
        if (tag.length === 0) return   // 空字符串不处理
        if (!attributeAdder(originTags, displayTags, removeTags, addTags, tag)) {
            Message.error($t('msg.thisTagAlreadyExists'))
        }
        dispalyFormData.tagInput = '' // 清空输入框
    }
    const tagRemover = (value: string) => {
        attributeRemover(originTags, displayTags, removeTags, addTags, value)
    }

    const originSeries = new Map<string, number>()    // 保存{id: 1, name: 'tag1'}这样的对象
    const displaySeries = reactive<Array<string>>([]) // 保存string类型的name
    const addSeries = new Set<string>()               // 保存string类型的name
    const removeSeries = new Set<number>()            // 保存int类型的id
    const seriesAdder = () => {
        const series = dispalyFormData.seriesInput.trim()       // 去除空格
        if (series.length === 0) return   // 空字符串不处理 
        if (!attributeAdder(originSeries, displaySeries, removeSeries, addSeries, series)) {
            Message.error($t('msg.thisSeriesAlreadyExists'))
        }
        dispalyFormData.seriesInput = '' // 清空输入框
    }
    const seriesRemover = (value: string) => {
        attributeRemover(originSeries, displaySeries, removeSeries, addSeries, value)
    }

    const originAuthors = new Map<number, number>()         // 保存{id: 1, name: 'tag1'}这样的对象
    const __displayAuthors = Array<number>()                // 保存int类型的id
    const displayAuthors = reactive<Array<VO.AuthorProfile>>([])   // 保存作者详细信息的 
    const addAuthors = new Set<number>()                    // 保存int类型的id
    const removeAuthors = new Set<number>()                 // 保存int类型的id  
    const authorAdder = (obj: VO.AcSuggestion) => {
        // 插入作者id
        attributeAdder(originAuthors, __displayAuthors, removeAuthors, addAuthors, obj.id) ?
            displayAuthors.push({
                id: obj.id,
                name: obj.value,
                avatar: obj.image
            })
            : Message.error($t('msg.thisAuthorAlreadyExists'))
    }
    const authorRemover = (id: number) => {
        if (attributeRemover(originAuthors, __displayAuthors, removeAuthors, addAuthors, id)) {
            // 删除作者详细信息
            displayAuthors.splice(displayAuthors.findIndex((v) => v.id === id), 1)
        }
    }

    const formData = reactive<DTO.EditRecordForm>({
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

    const dispalyFormData = reactive({
        authorInput: '',
        tagInput: '',
        seriesInput: ''
    })

    const options = reactive<DTO.EditRecordOptions>({
        batch: false,
        distinct: true,
    })

    const switchBatch = () => {
        options.batch = !options.batch
    }

    // 路径分割函数
    const separatePath = async (path: string): Promise<[dirname: string, basename: string] | undefined> => {
        const idx = path.lastIndexOf(await window.systemAPI.pathSep())
        if (idx === -1) {
            Message.error($t('msg.invalidPath'))
            return void 0
        }
        return [path.substring(0, idx + 1), path.substring(idx + 1)]
    }

    const selectRecordResource = async (type: 'dir' | 'file') => {
        const path = (await window.electronAPI.openDialog(type, false))[0]
        const sepd = await separatePath(path)
        if (sepd) {
            formData.dirname = sepd[0]
            formData.basename = sepd[1]
        }
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

    const saveOriginData = async (libraryId: number, recordId: number) => {
        // 保存数据时注意有些值是null, 有些值是undefined, 所以要替换成默认值 
        const data = await window.electronAPI.queryRecordDetail(libraryId, recordId)
        if (!data) {
            Message.error($t('msg.thisRecordAlreadyNotExists'))
            return
        }
        formData.id = data.id
        formData.title = data.title
        formData.rate = data.rate
        if (data.cover) {
            formData.cover = formData.originCover = data.cover
        }
        if (data.hyperlink) {
            formData.hyperlink = data.hyperlink
        }
        formData.dirname = data.dirname || ''
        formData.basename = data.basename || ''
        formData.intro = data.intro
        formData.info = data.info

        data.tags.forEach(item => {
            originTags.set(item.title, item.id)
            displayTags.push(item.title)
        })
        data.series.forEach(item => {
            originSeries.set(item.name, item.id)
            displaySeries.push(item.name)
        })
        data.authors.forEach(item => {
            originAuthors.set(item.id, item.id)
            __displayAuthors.push(item.id)
            displayAuthors.push(item)
        })
    }

    const submit = (libraryId: number) => {
        // 处理数据
        formData.addTags = Array.from(addTags)
        formData.removeTags = Array.from(removeTags)
        formData.addAuthors = Array.from(addAuthors)
        formData.removeAuthors = Array.from(removeAuthors)
        formData.addSeries = Array.from(addSeries)
        formData.removeSeries = Array.from(removeSeries)
        // 提交数据 
        return window.electronAPI.editRecord(libraryId, toRaw(formData), toRaw(options))
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
        formData.intro = ''
        formData.info = ''
        originTags.clear()
        addTags.clear()
        removeTags.clear()
        displayTags.splice(0)
        originSeries.clear()
        addSeries.clear()
        removeSeries.clear()
        displaySeries.splice(0)
        originAuthors.clear()
        addAuthors.clear()
        removeAuthors.clear()
        displayAuthors.splice(0)
        __displayAuthors.splice(0)
        dispalyFormData.authorInput = ''
        dispalyFormData.tagInput = ''
        dispalyFormData.seriesInput = ''
        options.batch = false
        options.distinct = true
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
        dispalyFormData,
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

export default useEditRecordService