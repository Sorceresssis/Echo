import { ElMessage } from 'element-plus'
/**
 * 用系统默认的方式打开 url email path
 * @param url 链接
 */
export function openUrlExternal(url: string) {
    window.electronAPI.openUrl(url)
}

/**
 * 把文本复制到剪切板
 * @param text 复制的文本
 */
export function clibboardWriteText(text: string) {
    ElMessage.success('已经复制到剪贴板')
    window.electronAPI.clibboardWriteText(text)
}

/**
 * 用系统默认方式打开文件
 * @param path 打开文件的路径
 */
export function openFile(path: string) {
}