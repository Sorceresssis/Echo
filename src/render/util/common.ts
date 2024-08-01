/**
 * 防抖函数,要等触发事件后,delay时间内不再触发事件,事件才执行.
 * 执行事件永远比触发晚delay时间.执行事件使用的参数是最后一次触发传入的参数
 */
export function debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | undefined
    return function debounced(...args: Parameters<T>) {
        if (timeoutId) {
            clearTimeout(timeoutId)
        }
        timeoutId = setTimeout(() => {
            func(...args)
            timeoutId = void 0
        }, delay)
    }
}


/**
 * 节流函数,在 delay 时间内,如果多次触发事件,只执行一次. 
 * 
 * immediate表示是否立即执行.
 * 为true时,时间段内第一次触发事件会立即执行,之后的触发会被忽略(Leading edge throttle),
 * 为false时,时间段内第一次触发事件不会立即执行,而是在会在时间段结束后执行(Trailing edge throttle).
 * 
 * 注意: 不管触发事件多少次,不论immediate为true还是false,执行事件使用的参数都是第一次触发传入的参数.
 * 
 * @param func 要节流的函数
 * @param delay 延迟时间
 * @param immediate 是否立即执行,默认false.
 */
export function throttle<T extends (...args: any[]) => any>(func: T, delay: number, immediate: boolean = false): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | undefined
    return function throttled(...args: Parameters<T>) {
        if (!timeoutId) {
            if (immediate) {
                func(...args)
            }
            timeoutId = setTimeout(() => {
                if (!immediate) {
                    func(...args)
                }
                clearTimeout(timeoutId)
                timeoutId = void 0
            }, delay)
        }
    }
}


/**
 * 判断两个对象类型是否相同, 通过递归，深度检查key和value的类型是否相同
 */
export function isSameType(a: any, b: any) {
    if (typeof a !== typeof b) return false

    if (typeof a === "object") {
        const aKeys = Object.keys(a)
        const bKeys = Object.keys(b)
        if (aKeys.length !== bKeys.length) return false

        for (let key of aKeys) {
            if (!bKeys.includes(key)) return false
            if (!isSameType(a[key], b[key])) return false
        }
    }
    return true
}


/**
 * 前端没有node的assert模块，所以写了一个简单版的深度比较函数
 * 只支持 Array 和普通对象，其他的Map、 Set、WeakMap、WeakSet、Date、RegExp、Error等不支持
 */
export function deepEqual(a: any, b: any): boolean {
    // 基本类型比较
    if (typeof a !== typeof b) return false;

    // 对象和数组的处理
    if (typeof a === 'object' && a !== null && b !== null) {
        // 处理数组
        if (Array.isArray(a) && Array.isArray(b)) {
            if (a.length !== b.length) return false;
            for (let i = 0; i < a.length; i++) {
                if (!deepEqual(a[i], b[i])) return false;
            }
            return true;
        }

        // 处理对象
        if (!Array.isArray(a) && !Array.isArray(b)) {
            const aKeys = Object.keys(a);
            const bKeys = Object.keys(b);
            if (aKeys.length !== bKeys.length) return false;

            for (let key of aKeys) {
                if (!bKeys.includes(key)) return false;
                if (!deepEqual(a[key], b[key])) return false;
            }
            return true;
        }
    }

    // 其他基本类型（string, number, boolean, etc.）
    return a === b;
}

export function generateUniqueID() {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 7); // 取随机数的一部分
    return timestamp + randomStr;
}


// scroll 拖拽滚动
export function useDragScroll() {
    let currentTarget: HTMLDivElement

    function startScroll(e: MouseEvent) {
        e.preventDefault()
        currentTarget = e.currentTarget as HTMLDivElement
        document.addEventListener('mousemove', scroll)
        document.addEventListener('mouseup', stopScroll)
    }

    function scroll(e: MouseEvent) {
        currentTarget.scrollLeft -= e.movementX
    }

    function stopScroll() {
        document.removeEventListener('mousemove', scroll)
        document.removeEventListener('mouseup', stopScroll)
    }

    return {
        startScroll
    }
}

export function createRange(start: number, end: number) {
    if (start < end) {
        return Array.from({ length: Math.abs(end - start) + 1 }, (_, index) => start + index);
    } else if (start > end) {
        return Array.from({ length: Math.abs(end - start) + 1 }, (_, index) => start - index);
    } else {
        return [start];
    }
}
