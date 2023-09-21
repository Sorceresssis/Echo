export function debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | undefined
    return function debounced(...args: Parameters<T>) {
        if (timeoutId) {
            clearTimeout(timeoutId)
        }
        timeoutId = setTimeout(() => {
            func(...args)
            timeoutId = undefined
        }, delay)
    }
}

// 带key的防抖，如果key不同，就会重新计时
export function debounceWithKey<K extends boolean | string | number | bigint | symbol | Object, T extends (...args: any[]) => any>
    (key: K, func: T, delay: number): (...args: Parameters<T>) => void {
    const timeoutIdMap = new Map<K, ReturnType<typeof setTimeout>>()
    return function debounced(...args: Parameters<T>) {
        const timeoutId = timeoutIdMap.get(key)
        if (timeoutId) {
            clearTimeout(timeoutId)
        }
        timeoutIdMap.set(key, setTimeout(() => {
            func(...args)
            timeoutIdMap.delete(key)
        }, delay))
    }
}