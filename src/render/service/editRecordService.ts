import { reactive, ref, toRaw } from "vue"
import Message from "@/util/Message"
import { deepEqual } from "@/util/common";
import { $t } from "@/locale"

export function primitiveTypesArrayEqual<T extends PrimitiveTypes>(arr1: T[], arr2: T[]): boolean {
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
}

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
    const attributeAdder = <K extends PrimitiveTypes, V extends PrimitiveTypes>(
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
    const attributeRemover = <K extends PrimitiveTypes, V extends PrimitiveTypes>(
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

    const originAuthors = new Map<number, VO.RecordAuthorRelation>()    // 保存{id: 1, name: 'tag1'}这样的对象
    const displayAuthors = reactive<VO.RecordAuthorRelation[]>([])      // 保存作者详细信息的
    const displayAuthorsRaw: VO.RecordAuthorRelation[] = []
    const removeAuthors = new Set<number>()            // 保存int类型的id
    const addAuthor = (author: VO.AutoCompleteSuggestion) => {
        if (displayAuthors.findIndex(a => a.id === author.id) === -1) {
            const createdAuthor = {
                id: author.id,
                name: author.value,
                avatar: author.image,
                roles: []
            }
            displayAuthors.push(createdAuthor)
            displayAuthorsRaw.push(createdAuthor)
            originAuthors.has(author.id) && removeAuthors.delete(author.id)
        } else {
            Message.error($t('msg.thisAuthorAlreadyExists'))
        }
    }
    const removeAuthor = (id: number) => {
        const idx = displayAuthors.findIndex(a => a.id === id)
        if (-1 === idx) return
        displayAuthors.splice(idx, 1)
        displayAuthorsRaw.splice(idx, 1)
        originAuthors.has(id) && removeAuthors.add(id)
    }
    const authorEditRole = (id: number, roleIds: VO.Role[]) => {
        const idx = displayAuthors.findIndex(a => a.id === id)
        if (-1 === idx) return
        displayAuthors[idx].roles = roleIds
        displayAuthorsRaw[idx].roles = roleIds
    }

    // ANCHOR Sample Images
    const originSampleImages = new Set<string>()
    const displaySampleImages = ref<Array<string>>([])
    const removeSampleImages = new Set<string>()
    const sampleImageAdder = (paths: string[]) => {
        paths.forEach(path => {
            if (displaySampleImages.value.indexOf(path) !== -1) return
            displaySampleImages.value.push(path)
            originSampleImages.has(path) && removeSampleImages.delete(path)
        })
    }
    const sampleImageRemover = (path: string) => {
        const idx = displaySampleImages.value.indexOf(path)
        if (-1 === idx) return
        displaySampleImages.value.splice(idx, 1)
        originSampleImages.has(path) && removeSampleImages.add(path)
    }

    const formData = reactive<RP.EditRecordFormData>({
        id: 0,
        dirname: '',
        basename: '',
        title: '',
        translated_title: '',
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
        // TODO 根据 /或者 \ 分割。 C:users 只有一层怎么解决。
        // /root
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
        const data = await window.dataAPI.queryRecordDetail(libraryId, recordId)
        if (!data) {
            Message.error($t('msg.recordNotExist'))
            return
        }

        formData.id = data.id
        formData.title = data.title
        formData.translated_title = data.translated_title
        formData.rate = data.rate
        if (data.hyperlink) {
            formData.hyperlink = data.hyperlink
        }
        if (data.release_date) {
            formData.releaseDate = data.release_date
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
            // 很特殊，深拷贝
            originAuthors.set(item.id, JSON.parse(JSON.stringify(item)))
            displayAuthors.push(item)
            displayAuthorsRaw.push(item)
        })

        if (data.cover) {
            formData.cover = formData.originCover = data.cover
        }
        data.sample_images.forEach(item => originSampleImages.add(item))
        displaySampleImages.value.push(...data.sample_images)
    }

    const submit = (libraryId: number) => {
        formData.addTags = Array.from(addTags)
        formData.removeTags = Array.from(removeTags)

        formData.addSeries = Array.from(addSeries)
        formData.removeSeries = Array.from(removeSeries)

        const addAuthors: RP.RecordAuthorRelation[] = []
        const editAuthorsRole: RP.RecordAuthorRelation[] = []
        displayAuthorsRaw.forEach(author => {
            const existedAuthor = originAuthors.get(author.id)
            // let isChanged = false
            if (existedAuthor) {
                if (!deepEqual(author.roles, existedAuthor.roles)) {
                    editAuthorsRole.push({ id: author.id, roles: author.roles.map(item => item.id) })
                }
            } else {
                addAuthors.push({ id: author.id, roles: author.roles.map(item => item.id) })
            }
        })

        formData.addAuthors = addAuthors
        formData.editAuthorsRole = editAuthorsRole
        formData.removeAuthors = Array.from(removeAuthors)

        // Sample Images
        const originSampleImagesArray = Array.from(originSampleImages)
        const editSampleImages: RP.EditSampleImage[] = []
        displaySampleImages.value.forEach((path, index) => {
            if (!originSampleImages.has(path)) {
                editSampleImages.push({ type: 'add', idx: index + 1, path })
            } else if (path !== originSampleImagesArray[index]) {
                editSampleImages.push({ type: 'move', idx: index + 1, path })
            }
        })
        formData.removeSampleImages = Array.from(removeSampleImages)
        formData.editSampleImages = editSampleImages
        return window.dataAPI.editRecord(libraryId, toRaw(formData))
    }

    const resetFormData = () => {
        formData.id = 0
        formData.dirname = ''
        formData.basename = ''
        formData.title = ''
        formData.translated_title = ''
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
        originAuthors.clear()
        displayAuthors.splice(0)
        displayAuthorsRaw.splice(0)
        // 样例图片
        originSampleImages.clear()
        displaySampleImages.value = []
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
        addAuthor,
        removeAuthor,
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