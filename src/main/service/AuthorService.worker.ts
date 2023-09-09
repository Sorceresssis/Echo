import { parentPort, workerData } from 'worker_threads'
import AuthorService from './AuthorService'

function getParameterNames(func: Function) {
    const functionString = func.toString()
    const parameterList = functionString
        .slice(functionString.indexOf('(') + 1, functionString.indexOf(')'))
        .split(',')
        .map(param => param.trim())
    return parameterList
}

type MessageData<T> = {
    functionName: T
    functionParams: any
}

parentPort?.on('message', (data: MessageData<Exclude<keyof AuthorService, 'close'>>) => {
    const authorService = new AuthorService(workerData.libraryId)
    const func = authorService[data.functionName]
    const params = getParameterNames(func)
    // @ts-ignore
    parentPort?.postMessage(func.apply(authorService, params.map((param) => data.functionParams[param])))
    authorService.close()
})