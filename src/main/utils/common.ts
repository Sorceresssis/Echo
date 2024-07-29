/**
* 当 throwException 为 false 时，异常触发才会返回 defaultReturn
*/
export function exceptionHandleWrap<
    T extends (...args: any[]) => any
>(
    action: T,
    errorHandle?: (e: any) => void,
    throwException = true,
    finallyHandle?: () => void,
    defaultReturn?: ReturnType<T>
) {
    return (...args: Parameters<T>): ReturnType<T> | undefined => {
        try {
            return action()
        } catch (e) {
            errorHandle && errorHandle(e)
            if (throwException) throw e
            if (defaultReturn !== void 0) return defaultReturn
        } finally {
            finallyHandle && finallyHandle()
        }
    }
}

export function exceptionHandleWrapAsync<
    T extends (...args: any[]) => Promise<K>,
    K
>(
    action: T,
    errorHandle?: (e: any) => void,
    throwException = true,
    finallyHandle?: () => void,
    defaultReturn?: K
) {
    return async (...args: Parameters<T>): Promise<K | undefined> => {
        try {
            return await action(...args);
        } catch (e) {
            errorHandle && errorHandle(e)
            if (throwException) throw e
            if (defaultReturn !== void 0) return defaultReturn
            return;
        } finally {
            finallyHandle && finallyHandle()
        }
    };
}


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

export function isNotEmptyString(str: string) {
    return str.trim().length > 0
}


type ArrayDiffResult<K, V> = {
    added: K[];
    updated: K[];
    removed: V[];
};

export function diffArray<
    T extends unknown,
    U extends unknown,
    K extends unknown = U,
    V extends unknown = T
>(
    a: T[],
    b: U[],
    keyA?: keyof T,
    keyB?: keyof U,
    addedUpdatedObjectFactory?: (a: U) => K,
    removedObjectFactory?: (a: T) => V,
    compare?: (a: T, b: U) => boolean,
): ArrayDiffResult<K, V> {
    const added: (U | K)[] = [];
    const updated: (U | K)[] = [];
    const removed: (T | V)[] = [];

    const aMap = new Map<any, T>();
    const bMap = new Map<any, U>();

    if (keyA && keyB) {
        if (!(addedUpdatedObjectFactory && removedObjectFactory && compare)) {
            throw new Error('compare, addedUpdatedObjectFactory, and removedObjectFactory are required');
        }
        a.forEach(item => aMap.set(item[keyA], item));
        b.forEach(item => {
            bMap.set(item[keyB], item);

            const aItem = aMap.get(item[keyB]);
            if (aItem) {
                if (!compare(aItem, item)) {
                    updated.push(addedUpdatedObjectFactory(item));
                }
            } else {
                added.push(addedUpdatedObjectFactory(item));
            }
        });
        a.forEach(item => {
            if (!bMap.has(item[keyA])) {
                removed.push(removedObjectFactory(item));
            }
        });
    } else if (keyA && !keyB) {
        if (!removedObjectFactory) {
            throw new Error('removedObjectFactory is required');
        }

        a.forEach(item => aMap.set(item[keyA], item));
        b.forEach(item => {
            bMap.set(item, item);

            if (!aMap.has(item)) {
                added.push(item);
            }
        });
        a.forEach(item => {
            if (!bMap.has(item[keyA])) {
                removed.push(removedObjectFactory(item));
            }
        });
    } else if (!keyA && keyB) {
        if (!addedUpdatedObjectFactory) {
            throw new Error('addedUpdatedObjectFactory is required');
        }
        a.forEach(item => aMap.set(item, item));
        b.forEach(item => {
            bMap.set(item[keyB], item);

            const aItem = aMap.get(item);
            if (aItem) {
                if (aItem !== item) {
                    updated.push(addedUpdatedObjectFactory(item));
                }
            } else {
                added.push(addedUpdatedObjectFactory(item));
            }
        });
        a.forEach(item => {
            if (!bMap.has(item)) {
                removed.push(item);
            }
        });
    } else {
        a.forEach(item => aMap.set(item, item));
        b.forEach(item => {
            bMap.set(item, item);

            if (!aMap.has(item)) {
                added.push(item);
            }
        });

        a.forEach(item => {
            if (!bMap.has(item)) {
                removed.push(item);
            }
        });
    }

    return {
        added: added as K[],
        updated: updated as K[],
        removed: removed as V[],
    };
}


/**
 * 类型和值都要相同
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

/**
 * 类型相同
*/
export function typeEqual(a: any, b: any): boolean {
    if (typeof a !== typeof b) return false;

    if (typeof a === 'object' && a !== null && b !== null) {
        if (Array.isArray(a) && Array.isArray(b)) {
            if (a.length !== b.length) return false;
            for (let i = 0; i < a.length; i++) {
                if (!typeEqual(a[i], b[i])) return false;
            }
            return true;
        }

        if (!Array.isArray(a) && !Array.isArray(b)) {
            const aKeys = Object.keys(a);
            const bKeys = Object.keys(b);
            if (aKeys.length !== bKeys.length) return false;

            for (let key of aKeys) {
                if (!bKeys.includes(key)) return false;
                if (!typeEqual(a[key], b[key])) return false;
            }
            return true;
        }
        return false;
    }
    return true;
}

export default {
    exceptionalHandler,
    formatCurrentTime,
    isNotEmptyString,
    diffArray,
}