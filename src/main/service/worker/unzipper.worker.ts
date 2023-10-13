import { parentPort } from 'node:worker_threads'
import AdmZip from 'adm-zip'
import Result from '../../util/Result'


export type unzipperOperation = {
    type: 'extractAll' | 'read' | 'extract'
    entryName?: string,
    tragetPath?: string,
}

parentPort?.on('message', (wData: {
    zipFilePath: string,
    ops: unzipperOperation[]
}) => {
    try {
        const results: Result[] = Array.from({ length: wData.ops.length })

        const zip = new AdmZip(wData.zipFilePath)
        const zipEntries = zip.getEntries()

        for (const entry of zipEntries) {
            wData.ops.forEach((op, opIdx) => {
                switch (op.type) {
                    case 'extract':
                        if (results[opIdx]) return
                        if (entry.entryName === op.entryName) {
                            zip.extractEntryTo(entry.entryName, op.tragetPath!, true, true)
                            results[opIdx] = Result.success()
                        }
                        break
                    case 'read':
                        if (results[opIdx]) return
                        if (entry.entryName === op.entryName) {
                            results[opIdx] = Result.success(entry.getData())
                        }
                        break
                    case 'extractAll':
                        if (results[opIdx]) return
                        zip.extractAllToAsync(op.tragetPath!, true, false, (err) => {
                            if (err) throw err
                        })
                        results[opIdx] = Result.success()
                        break
                }
            })

            // 所有操作都完成了，就退出
            if (results.every(r => r)) break
        }

        parentPort?.postMessage(results)
    } catch (err: any) {
        parentPort?.postMessage([Result.error(err.message)])
    }
})