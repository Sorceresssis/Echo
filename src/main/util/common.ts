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


export function formatCurrentTime() {
    const now = new Date()

    // 获取年、月、日、小时、分钟和秒
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0') // 月份从0开始，需要加1
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')

    // 创建格式化后的时间字符串
    const formattedTime = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`

    return formattedTime
}


export default { exceptionalHandler, formatCurrentTime }