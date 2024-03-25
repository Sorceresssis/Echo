import sharp, { type OutputInfo } from "sharp"

class ImageService {
    public static async handleNormalImage(input: string, output: string) {
        const maxW = 2560, maxH = 1440 // 2K
        sharp(input).resize(maxW, maxH, {
            fit: 'outside',
            withoutEnlargement: true
        }).toFormat('avif', {
            quality: 100,
            lossless: true,
            effort: 4
        }).toFile(output)
    }

    public static async handleAuthorAvatar(input: string, output: string) {
        const sharpImage = sharp(input)
        const metadata = await sharpImage.metadata()
        const { width, height } = metadata
        if (!(width && height)) return

        const resizeWidth = 400
        // 居中裁处最大的正方形
        const size = Math.min(width, height)
        const outputInfo: OutputInfo = await sharpImage.extract({
            left: Math.round((width - size) / 2),
            top: Math.round((height - size) / 2),
            width: size,
            height: size
        }).resize(resizeWidth, resizeWidth, {
            fit: 'cover',
            withoutEnlargement: true
        }).toFormat('avif', {
            quality: 100,
            lossless: true,
            effort: 4
        }).toFile(output)
        return outputInfo
    }
}


export default ImageService