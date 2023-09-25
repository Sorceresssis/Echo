export function exceptionalHandler<T extends (...args: any[]) => any>
    (tryFn: T, catchFn: (e: any) => void, catchReturn: ReturnType<T>, finallyFn?: () => void) {
    return function (...args: any[]) {
        try {
            return tryFn(...args)
        } catch (e: any) {
            catchFn(e)
            return catchReturn
        } finally {
            finallyFn && finallyFn()
        }
    }
}


export default { exceptionalHandler }