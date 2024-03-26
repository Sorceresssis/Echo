import sharp, { type OutputInfo } from "sharp"


class ImageService {
    private static FORMAT_NAME: keyof sharp.FormatEnum = 'avif'
    private static FORMAT_OPTIONS = {
        quality: 80,
        effort: 4
    }

    public static async handleNormalImage(input: string, output: string) {
        const maxW = 1920, maxH = 1080 // 1080P 

        const outputInfo: OutputInfo = await sharp(input)
            .resize(maxW, maxH, {
                fit: 'outside',
                withoutEnlargement: true
            }).toFormat(this.FORMAT_NAME, this.FORMAT_OPTIONS)
            .keepMetadata().toFile(output)
        return outputInfo
    }

    public static async handleAuthorAvatar(input: string, output: string) {
        const sharpImage = sharp(input)
        const metadata = await sharpImage.metadata()
        const { width, height } = metadata

        if (!(width && height)) return

        const resizeWidth = 400
        // 居中裁处最大的正方形
        const size = Math.min(width, height)
        const outputInfo: OutputInfo = await sharpImage
            .extract({
                left: Math.round((width - size) / 2),
                top: Math.round((height - size) / 2),
                width: size,
                height: size
            }).resize(resizeWidth, resizeWidth, {
                fit: 'cover',
                withoutEnlargement: true
            }).toFormat(this.FORMAT_NAME, this.FORMAT_OPTIONS)
            .keepMetadata().toFile(output)
        return outputInfo
    }
}


export default ImageService