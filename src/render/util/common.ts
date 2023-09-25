// 判断两个对象类型是否相同, 相同的key, key的类型和值都相同，递归判断
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


export default { isSameType }