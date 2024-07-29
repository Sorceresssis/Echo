import { parentPort } from 'node:worker_threads'
import AdmZip from 'adm-zip'
import ResponseResult from '../../pojo/ResponseResult'


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
        const opResults: ResponseResult<any>[] = Array.from({ length: wData.ops.length })

        const zip = new AdmZip(wData.zipFilePath)
        const zipEntries = zip.getEntries()

        for (const entry of zipEntries) {
            wData.ops.forEach((op, opIdx) => {
                switch (op.type) {
                    case 'extract':
                        if (opResults[opIdx]) return
                        if (entry.entryName === op.entryName) {
                            zip.extractEntryTo(entry.entryName, op.tragetPath!, true, true)
                            opResults[opIdx] = ResponseResult.success()
                        }
                        break
                    case 'read':
                        if (opResults[opIdx]) return
                        if (entry.entryName === op.entryName) {
                            opResults[opIdx] = ResponseResult.success(entry.getData())
                        }
                        break
                    case 'extractAll':
                        if (opResults[opIdx]) return
                        zip.extractAllToAsync(op.tragetPath!, true, false, (err) => {
                            if (err) throw err
                        })
                        opResults[opIdx] = ResponseResult.success()
                        break
                }
            })

            // 所有操作都完成了，就退出
            if (opResults.every(r => r)) break
        }

        // 把undefined的结果改成error
        opResults.forEach((r, idx) => {
            if (!r) opResults[idx] = ResponseResult.error('no such entry')
        })
        parentPort?.postMessage(ResponseResult.success(opResults))
    } catch (err: any) {
        parentPort?.postMessage(ResponseResult.error(err.message))
    }
})