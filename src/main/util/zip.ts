import fs from 'fs'
import archiver from 'archiver'
import unzipper from 'unzipper'

export const compress = (sourcePath: string, outputFilePath: string) => {
    const output = fs.createWriteStream(outputFilePath)
    const archive = archiver('zip', { zlib: { level: 9 } })

}

export const decompress = (sourceFilePath: string, outputPath: string) => {

}

export default { compress, decompress }