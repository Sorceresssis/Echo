type BaseType = "undefined" | "boolean" | "number" | "string" | "symbol" | "object" | "function"

function createOverload() {
    const callMap = new Map()
    function overload(...args: any[]) {
        const key = args.map(arg => typeof arg).join(',')
        const fn = callMap.get(key)
        if (fn) {
            return fn.apply(this, args)
        }
        throw new Error(`No matching function for call(${args.join(',')})`)
    }
    overload.addImpl = function (...args: (BaseType | ((...args: any[]) => any))[]) {
        const fn = args.pop()
        if (typeof fn !== 'function') {
            return
        }
        callMap.set(args.join(','), fn)
    }
    return overload
}

export default createOverload