import { reactive, toRaw } from "vue"
import Message from "@/util/Message"
import { $t } from "@/locale"

// 简单类型
type SimpleType = string | number | boolean | undefined | null | symbol

const useEditRecordService = () => {
    /**
     * 添加属性, 注意：K,V 不能是复杂类型，如对象，数组等, 因为Set, Map都是===比较
     * display === origin + add - remove 等式左右完全相等，且add和remove不相交
     * JS的map和set都是哈希表,他会保留插入的顺序
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

    const originAuthors = new Map<number, DTO.AuthorIdAndRole['role']>()    // 保存{id: 1, name: 'tag1'}这样的对象
    const addAuthors = new Map<number, DTO.AuthorIdAndRole['role']>()       // 保存int类型的id
    const editAuthorsRole = new Map<number, DTO.AuthorIdAndRole['role']>()  // 保存int类型的id
    const removeAuthors = new Set<number>()                                 // 保存int类型的id
    const displayAuthors = reactive<Array<VO.RecordAuthorProfile>>([])      // 保存作者详细信息的
    const authorAdder = (obj: VO.AcSuggestion) => {
        // 先判断是否已经存在 
        if (displayAuthors.findIndex((v) => v.id === obj.id) === -1) {
            displayAuthors.push({
                id: obj.id,
                name: obj.value,
                avatar: obj.image,
                role: null
            })
            originAuthors.has(obj.id) ? removeAuthors.delete(obj.id) : addAuthors.set(obj.id, null)
        } else {
            Message.error($t('msg.thisAuthorAlreadyExists'))
        }
    }
    const authorRemover = (id: number) => {
        const idx = displayAuthors.findIndex((v) => v.id === id)
        if (-1 === idx) return

        displayAuthors.splice(idx, 1)
        originAuthors.has(id) ? removeAuthors.add(id) : addAuthors.delete(id)

        editAuthorsRole.delete(id)
    }
    const authorEditRole = (id: number, role: string | null) => {
        if (removeAuthors.has(id)) return
        // 可以editRole的只存在于addAuthors和originAuthors中
        originAuthors.has(id) ? editAuthorsRole.set(id, role) : addAuthors.set(id, role)
    }

    // ANCHOR Sample Images
    const originSampleImages = new Set<string>()
    const displaySampleImages = reactive<Array<string>>([])
    const removeSampleImages = new Set<string>()
    const sampleImageAdder = (paths: string[]) => {
        paths.forEach(path => {
            if (displaySampleImages.indexOf(path) !== -1) return
            displaySampleImages.push(path)
            originSampleImages.has(path) && removeSampleImages.delete(path)
        })
    }
    const sampleImageRemover = (path: string) => {
        const idx = displaySampleImages.indexOf(path)
        if (-1 === idx) return
        displaySampleImages.splice(idx, 1)
        originSampleImages.has(path) && removeSampleImages.add(path)
    }

    const formData = reactive<DTO.EditRecordForm>({
        id: 0,
        dirname: '',
        basename: '',
        title: '',
        hyperlink: '',
        releaseDate: '',
        cover: '',
        originCover: '',
        rate: 0,
        addTags: [],
        removeTags: [],
        addAuthors: [],
        editAuthorsRole: [],
        removeAuthors: [],
        addSeries: [],
        removeSeries: [],
        plot: '',
        searchText: '',
        reviews: '',
        info: '',
        editSampleImages: [],
        removeSampleImages: []
    })

    const dispalyFormData = reactive({
        authorInput: '',
        tagInput: '',
        seriesInput: ''
    })

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

    const selectCover = async () => {
        const imgPath = (await window.electronAPI.openDialog('image', false))[0]
        if (imgPath) formData.cover = imgPath
    }

    const resetCover = () => {
        formData.cover = formData.originCover
    }

    const saveOriginData = async (libraryId: number, recordId: number) => {
        // 保存数据时注意有些值是null, 有些值是undefined, 所以要替换成默认值 
        const data = await window.electronAPI.queryRecordDetail(libraryId, recordId)
        if (!data) {
            Message.error($t('msg.recordNotExist'))
            return
        }

        formData.id = data.id
        formData.title = data.title
        formData.rate = data.rate
        if (data.hyperlink) {
            formData.hyperlink = data.hyperlink
        }
        if (data.releaseDate) {
            formData.releaseDate = data.releaseDate
        }
        formData.dirname = data.dirname || ''
        formData.basename = data.basename || ''
        formData.plot = data.plot
        formData.searchText = data.search_text
        formData.reviews = data.reviews
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
            originAuthors.set(item.id, item.role)
            displayAuthors.push(item)
        })

        if (data.cover) {
            formData.cover = formData.originCover = data.cover
        }
        data.sampleImages.forEach(item => originSampleImages.add(item))
        displaySampleImages.push(...data.sampleImages)
    }

    const submit = (libraryId: number) => {
        // tag 
        formData.addTags = Array.from(addTags)
        formData.removeTags = Array.from(removeTags)
        formData.addAuthors = Array.from(addAuthors.entries()).map(([id, role]) => ({ id, role }))
        formData.editAuthorsRole = Array.from(editAuthorsRole.entries()).map(([id, role]) => ({ id, role }))
        formData.removeAuthors = Array.from(removeAuthors)
        formData.addSeries = Array.from(addSeries)
        formData.removeSeries = Array.from(removeSeries)
        const originSampleImagesArray = Array.from(originSampleImages)
        const editSampleImages: DTO.EditSampleImage[] = []
        displaySampleImages.forEach((path, index) => {
            if (!originSampleImages.has(path)) {
                editSampleImages.push({ type: 'add', idx: index + 1, path })
            } else if (path !== originSampleImagesArray[index]) {
                editSampleImages.push({ type: 'move', idx: index + 1, path })
            }
        })
        formData.removeSampleImages = Array.from(removeSampleImages)
        formData.editSampleImages = editSampleImages

        // 提交数据 
        return window.electronAPI.editRecord(libraryId, toRaw(formData))
    }

    const resetFormData = () => {
        formData.id = 0
        formData.dirname = ''
        formData.basename = ''
        formData.title = ''
        formData.hyperlink = ''
        formData.releaseDate = ''
        formData.cover = ''
        formData.originCover = ''
        formData.rate = 0
        formData.plot = ''
        formData.searchText = ''
        formData.reviews = ''
        formData.info = ''
        // 提交前会重新赋值的不需要清空
        //  addTags removeTags removeSeries addSeries
        // addAuthor removeAuthors editAuthorsRole
        // editSampleImages removeSampleImages

        // 标签
        displayTags.splice(0)
        originTags.clear()
        addTags.clear()
        removeTags.clear()
        // 系列
        displaySeries.splice(0)
        originSeries.clear()
        addSeries.clear()
        removeSeries.clear()
        // 作者
        displayAuthors.splice(0)
        originAuthors.clear()
        addAuthors.clear()
        editAuthorsRole.clear()
        removeAuthors.clear()
        // 样例图片
        displaySampleImages.splice(0)
        originSampleImages.clear()
        removeSampleImages.clear()
        // 重置输入框
        dispalyFormData.authorInput = ''
        dispalyFormData.tagInput = ''
        dispalyFormData.seriesInput = ''
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
        authorEditRole,
        // 样例图片
        displaySampleImages,
        sampleImageAdder,
        sampleImageRemover,
        // 表单数据 
        formData,
        dispalyFormData,
        selectCover,
        resetCover,
        selectRecordResource,
        // 表单行为
        saveOriginData,
        submit,
        resetFormData,
    }
}

export default useEditRecordService