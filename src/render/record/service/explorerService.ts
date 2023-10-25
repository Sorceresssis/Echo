import { ref, nextTick, } from "vue"
import { createRange, throttle } from "@/util/common"
import Message from '@/util/Message'

const useExplorer = function () {
    // 保存了所有的路径
    const realFolders = ref<string[]>([])

    // 展示在页面上的路径
    const showFolderIdxs = ref<number[]>([])

    // 折叠起来的路径
    const collapseFolderIdxs = ref<number[]>([])

    // 用于计算路径的宽度来决定是否折叠多少路径
    const shadowFolders = ref<string[]>([])

    // 当前文件夹下的内容
    const currDirContent = ref<(DirContentItem & {
        fullPath: string
    })[]>([])


    const back = function () {
        if (realFolders.value.length > 1) {
            shadowFolders.value.pop()
            realFolders.value.pop()

            updateCurrDirContent()
        }
    }

    function push(folderName: string) {
        realFolders.value.push(folderName)
        shadowFolders.value.push(folderName)

        updateCurrDirContent()
    }

    function go(index: number, folderName?: string) {
        realFolders.value.splice(index + 1)
        shadowFolders.value.splice(index + 1)

        if (folderName) {
            push(folderName)
        }

        updateCurrDirContent()
    }

    const updateCurrDirContent = () => {
        const dirname = realFolders.value.join('/')

        window.electronAPI.readdir(dirname).then(res => {
            if (res.code === 1) {

                currDirContent.value = (res.data as DirContentItem[]).sort((a, b) => {
                    if (a.type !== b.type) {
                        return a.type === 'folder' ? -1 : 1
                    } else {
                        return a < b ? -1 : 1
                    }
                }).map(item => {
                    return {
                        ...item,
                        fullPath: dirname + '/' + item.name
                    }
                })

                __refreshFolderNav()
            } else {
                if (realFolders.value.length === 1) {
                    Message.error(res.msg!)
                    currDirContent.value = []
                }
                // 一直递归到根目录
                back()
            }
        })
    }

    function __refreshFolderNav() {
        nextTick(() => {
            const folderNavNode = document.querySelector('.folder-nav') as HTMLElement
            const shadowFolderNodes = document.querySelectorAll('.folder-nav .shadow li')

            const availableWidth = folderNavNode!.offsetWidth - 10
            let totalWidth = 0
            let splitIdx = -1

            for (let i = shadowFolderNodes.length - 1; i >= 0; i--) {
                totalWidth += (shadowFolderNodes[i] as HTMLElement).offsetWidth

                if (totalWidth > availableWidth) {
                    splitIdx = i
                    break
                }
            }

            // 到了第 i 个就溢出了, 所以显示 i+1 ~ 最后一个
            showFolderIdxs.value = createRange(splitIdx + 1, shadowFolderNodes.length - 1)
            // 从i~0的路径都是折叠起来的
            collapseFolderIdxs.value = splitIdx === -1 ? [] : createRange(splitIdx, 0)
        })
    }

    function init(rootPath: string) {
        // 监听窗口大小变化
        new ResizeObserver(throttle(__refreshFolderNav, 300)).observe(document.querySelector('.folder-nav') as HTMLElement)

        realFolders.value.push(rootPath)
        shadowFolders.value.push('根目录')

        updateCurrDirContent()
    }


    return {
        realFolders,
        shadowFolders,
        showFolderIdxs,
        collapseFolderIdxs,
        currDirContent,
        init,
        push,
        go,
        back,
    }
}


export default useExplorer 