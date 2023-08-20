import os from 'os'
import fs from 'fs'
import nodePath from 'path'

/**
 * 通过路径递归的创建多层文件夹
 * @param dirPath  路径
 */
export function mkdirsSync(path: string): void {
    if (fs.existsSync(path)) {
        return
    } else {
        mkdirsSync(nodePath.dirname(path))
        fs.mkdirSync(path)
    }
}

export function unlinkSync(path: string): void {
    if (fs.existsSync(path)) {
        fs.unlinkSync(path)
    }
}

export function isLegalAbsolutePath(path: string): boolean {
    // 长度
    const maxPath: { [key: string]: number } = {
        win32: 32767,
        darwin: 1024,
        linux: 4096
    }
    if (path.length === 0 || path.length > maxPath[os.platform()]) {
        return false
    }
    // 路径
    /* windows平台测试
    path.isAbsolute('/')  true
    path.isAbsolute('/root')  true
    path.isAbsolute('/root/')  true
    path.isAbsolute('C')  false
    path.isAbsolute('C:')  false
    path.isAbsolute('C:.')  false
    path.isAbsolute('C:\\')  true
    path.isAbsolute('C:\\foo')  true
    path.isAbsolute('C:\\foo\\')  true
    */
    if (!nodePath.isAbsolute(path)) {
        return false
    }
    // 字符
    if (/[*?"<>]/.test(path)) {
        return false
    }
    return true
}

export function isLegalFileName(fileName: string): boolean {
    // 长度
    if (fileName.length === 0 || fileName.length > 255) {
        return false
    }
    // 剔除字符
    if (/[\\/:*?"<>]/.test(fileName)) {
        return false
    }
    return true
}

export default { mkdirsSync, unlinkSync, isLegalAbsolutePath, isLegalFileName }