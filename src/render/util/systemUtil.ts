import { ElMessage } from 'element-plus'

/**
 * 用于打开外部 URL 或文件资源。例如，你可以使用这个方法在用户默认的浏览器中打开一个网页。
 * @param url 
 */
export const openExternal = (url: string) => {
    window.electronAPI.openExternal(url)
}

/**
 * 在资源管理器中打开，如果是文件夹，直接打开文件夹。如果是文件，打开文件所在的文件夹，滚动到文件的位置并高亮标记
 * @param fullPath 
 */
export const openInExplorer = (fullPath: string) => {
    window.electronAPI.openInExplorer(fullPath)
}

/**
 * 打开文件,如果该文件用户指定了打开软件，用指定的软件打开，否则用系统默认方式打开
 * @param fullPath 
 */
export const openFile = (fullPath: string) => {
    window.electronAPI.openFile(fullPath)
}

/**
 * 把文本复制到剪切板
 * @param text 复制的文本
 */
export function writeClibboard(text: string) {
    window.electronAPI.writeClipboard(text)
    ElMessage.success('已复制')
}

export default { openExternal, openInExplorer, openFile, writeClibboard }