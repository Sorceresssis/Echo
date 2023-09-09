import { nativeImage, type NativeImage } from 'electron'
import fs from 'fs'
import { resolve } from 'path'
import config from '../app/config'
import generateUid from "../util/uid"
import { mkdirsSync } from '../util/FileManager'

export default class ImageService {
    private static readonly MIN_SIZE = 300
    image: NativeImage
    libId: number

    constructor(srcPath: string, libId: number) {
        this.image = nativeImage.createFromPath(srcPath)
        this.libId = libId
    }

    /**
     * 处理Record的cover，返回文件名
     */
    public handleRecordCover(): string | undefined {
        if (this.image.isEmpty()) return
        this.compress()
        return this.save()
    }

    /**
     * 处理Author的avatar, 返回文件名
     */
    public handleAuthorAvatar(): string | undefined {
        if (this.image.isEmpty()) return
        this.cropSquare()
        this.compress()
        return this.save()
    }

    /**
     * 把图图片等比例压缩，最小的边为300px
     */
    private compress() {
        const { width, height } = this.image.getSize()
        let newWidth, newHeight
        if (width < height) {
            newWidth = ImageService.MIN_SIZE
            newHeight = Math.round(height * newWidth / width)
        } else {
            newHeight = ImageService.MIN_SIZE
            newWidth = Math.round(width * newHeight / height)
        }
        this.image = this.image.resize({
            width: newWidth,
            height: newHeight,
            quality: 'best'
        })
    }

    /**
     * 在中心裁剪出最大的正方形
     */
    private cropSquare() {
        const { width, height } = this.image.getSize()
        const size = Math.min(width, height)
        this.image = this.image.crop({
            x: Math.round((width - size) / 2),
            y: Math.round((height - size) / 2),
            width: size,
            height: size
        })
    }

    /**
     * 保存图片
     */
    private save() {
        // 检查文件夹是否存在，不存在则创建 
        const dirname = config.getLibraryImagesDirPath(this.libId)
        mkdirsSync(dirname)
        const basename = generateUid() + '.jpg'
        // 保存图片 
        fs.writeFileSync(resolve(dirname, basename), this.image.toJPEG(100))
        return basename
    }
}