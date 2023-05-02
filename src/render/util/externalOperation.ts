/**
 * 用系统默认的浏览器打开链接
 * @param url 链接
 */
export function openUrlExternal(url: string) {
    window.electronAPI.openUrlExternal(url)
}

/**
 * 打开选取文件的对话框
 */
export function selectFile() {
    // return window.electronAPI.selectFile()
}

/**
 * 把文本复制到剪切板
 * @param text 复制的文本
 */
export function copy(text: string) {

}