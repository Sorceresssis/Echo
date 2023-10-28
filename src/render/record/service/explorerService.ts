import { ref, nextTick, } from "vue"
import { $t } from "@/locale"
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

    // dropdown的 目录下面的文件夹
    const dropdownFolders = ref<string[]>([])

    function back() {
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

    function showFoldersDropdownMenu(index: number) {
        dropdownFolders.value = []

        const dirname = realFolders.value.slice(0, index + 1).join('/')
        window.electronAPI.readdir(dirname).then(res => {
            if (res.code === 1) {
                dropdownFolders.value = (res.data as DirContentItem[]).filter(item => item.type === 'folder').map(item => item.name)
            } else {
                Message.error(res.msg!)
                dropdownFolders.value = []
            }
        })
    }

    function updateCurrDirContent() {
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
        const folderNavNode = document.querySelector('.folder-nav') as HTMLElement
        if (folderNavNode) {
            new ResizeObserver(throttle(__refreshFolderNav, 300)).observe(folderNavNode)
        }
        reset()

        realFolders.value.push(rootPath)
        shadowFolders.value.push($t('layout.rootDir'))

        updateCurrDirContent()
    }

    function reset() {
        realFolders.value = []
        collapseFolderIdxs.value = []
        showFolderIdxs.value = []
        shadowFolders.value = []
    }

    return {
        realFolders,
        shadowFolders,
        showFolderIdxs,
        collapseFolderIdxs,
        currDirContent,
        dropdownFolders,
        init,
        reset,
        push,
        go,
        showFoldersDropdownMenu,
        back,
    }
}


export default useExplorer 