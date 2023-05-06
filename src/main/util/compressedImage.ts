const { nativeImage } = require('electron')
const fs = require('fs')

/**
 * try catch 没有写入权限
 * @param filePath 
 * @param compressedFilePath 
 */
export function compressedImage(filePath: string, compressedFilePath: string) {
    const imageBuffer = fs.readFileSync(filePath)
    const nativeImageObj = nativeImage.createFromBuffer(imageBuffer)

    const { width, height } = nativeImageObj.getSize()
    let newWidth, newHeight
    if (width < height) {
        newWidth = 300 
        newHeight = Math.round(height * newWidth / width) 
    } else {
        newHeight = 300 
        newWidth = Math.round(width * newHeight / height) 
    }
    // const newWidth = 300 // 新的宽度
    // const newHeight = Math.round(height * newWidth / width) // 等比例缩放
    const compressedNativeImageObj = nativeImageObj.resize({
        width: newWidth,
        height: newHeight,
        quality: 'best'
    })
    const compressedImageBuffer = compressedNativeImageObj.toJPEG(100)
    fs.writeFileSync(compressedFilePath, compressedImageBuffer)
}
