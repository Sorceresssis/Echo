import { deepEqual } from '../utils/common'

export function onceGlobalScope() {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value
        let called = false

        descriptor.value = function (...args: any[]) {
            if (!called) {
                called = true
                return originalMethod.apply(this, args)
            }
        }
    }
}

export function onceObjectScope() {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value
        const set = new WeakSet()
        descriptor.value = function (...args: any[]) {
            if (set.has(this)) {
                return
            }
            set.add(this)
            return originalMethod.apply(this, args)
        }
    }
}

export function runOnParamChangeObjectScope() {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value;
        const map = new WeakMap();

        descriptor.value = function (...args: any[]) {
            // 获取实例的参数记录
            const previousArgs = map.get(this);
            const argsChanged = deepEqual(previousArgs, args);

            if (argsChanged) {
                return
            }
            map.set(this, args);
            return originalMethod.apply(this, args);
        };
    };
}
