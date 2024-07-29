import { parentPort } from 'node:worker_threads'
import fs from 'fs'
import path from 'node:path'
import archiver from 'archiver'
import type internal from 'node:stream'
import ResponseResult from '../../pojo/ResponseResult'

export type zipperOperation = ({
    type: "Buffer" | "String" | "Stream",
    source: string | Buffer | internal.Readable
    data?: archiver.EntryData | archiver.ZipEntryData,
} | {
    type: "File"
    filename: string
    data: archiver.EntryData
} | {
    type: "Dir"
    dirpath: string
    destpath: string | false,
    data?: Partial<archiver.EntryData> | archiver.EntryDataFunction
} | {
    type: "Glob"
    pattern: string,
    options?: any | undefined,
    data?: Partial<archiver.EntryData> | undefined
})

parentPort?.on('message', (wData: {
    exportPath: string
    ops: zipperOperation[]
}) => {
    fs.mkdirSync(path.dirname(wData.exportPath), { recursive: true })

    const output = fs.createWriteStream(wData.exportPath)
    output.on('error', err => { throw err })
    output.on('close', function () {
        // 输出流关闭后，代表压缩完成
        parentPort?.postMessage(ResponseResult.success())
    })

    output.on('end', function () {
        parentPort?.postMessage(ResponseResult.error('Data has been drained'))
    });

    const archive = archiver('zip', {
        zlib: { level: 9 }
    })
    archive.on('warning', err => {
        if (err.code !== 'ENOENT') { throw err }
    })
    archive.on('error', err => { throw err })


    archive.pipe(output)

    wData.ops.forEach(op => {
        switch (op.type) {
            case 'Stream':
            case 'Buffer':
            case 'String':
                archive.append(op.source, op.data)
                break
            case 'File':
                archive.file(op.filename, op.data)
                break
            case 'Dir':
                // 要先创建空目录，否则unzipper读取时无法读取掉 destpath/ 目录
                if (op.destpath) archive.append('', { name: op.destpath + '/' })
                archive.directory(op.dirpath, op.destpath, op.data)
                break
            case 'Glob':
                archive.glob(op.pattern, op.options, op.data)
                break
            default:
                throw Error('Unknown type')
        }
    })

    archive.finalize()
})