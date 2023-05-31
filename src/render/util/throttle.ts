export function throttle<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
    let isThrottled = false;
    return function throttled(...args: Parameters<T>) {
        if (!isThrottled) {
            func(...args);
            isThrottled = true;
            setTimeout(() => {
                isThrottled = false;
            }, delay);
        }
    };
}