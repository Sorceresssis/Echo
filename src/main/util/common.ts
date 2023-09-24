import { dialog } from "electron"

export function handleError<T extends (...args: any[]) => any>
    (fn: T, catchReturn: ReturnType<T>, title: string = 'Error', suggest?: string) {
    return function (...args: any[]) {
        try {
            return fn(...args)
        } catch (e: any) {
            // 处理异常，您可以在这里添加自定义的异常处理逻辑 
            dialog.showErrorBox(title, suggest ? `${suggest}\n${e.message}` : e.message)
            return catchReturn
        }
    }
}

export default { handleError }