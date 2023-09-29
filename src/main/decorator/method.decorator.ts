import DI_TYPES from "../DI/DITypes"

/**
 *  在整个生命周期中，只能调用一次
 */
export function oncePerGlobal(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    let called = false

    descriptor.value = function (...args: any[]) {
        if (!called) {
            called = true
            return originalMethod.apply(this, args)
        }
    }
}

export function oncePerObject() {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value
        const map = new WeakMap()

        descriptor.value = function (...args: any[]) {
            if (!map.has(this)) {
                map.set(this, true)
                return originalMethod.apply(this, args)
            }
        }
    }
}

export function transaction(identifier: symbol) {

}

export default { oncePerGlobal, oncePerObject, transaction }