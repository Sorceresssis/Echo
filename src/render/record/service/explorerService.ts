import { ref } from "vue"
import Message from '@/util/Message'

const useExplorer = function () {
    const pathLink = ref<string[]>([])
    const currDirContent = ref<DirContentItem[]>([])

    function back() {
        // 如果只有一个元素，就不用pop了
        if (pathLink.value.length === 1) return
        pathLink.value.pop()
        updateCurrDirContent()
    }

    // 位置
    function go(position: number, dirName?: string) {
        pathLink.value.splice(position + 1)
        if (dirName) pathLink.value.push(dirName)
        updateCurrDirContent()
    }

    function push(dirName: string) {
        pathLink.value.push(dirName)
        updateCurrDirContent()
    }

    function updateCurrDirContent() {
        let isWarned = false

        window.systemAPI.pathSep().then(sep => {
            return window.electronAPI.readdir(pathLink.value.join(sep))
        }).then(res => {
            if (res.code === 1) {
                isWarned = false
                currDirContent.value = res.data!
            } else {
                if (!isWarned) {
                    isWarned = true
                    Message.error(res.msg!)
                }
                back()
            }
        })
    }

    return {
        pathLink,
        currDirContent,
        back,
        push,
        go,
    }
}


export default useExplorer 