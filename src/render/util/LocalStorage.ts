export const getLocalStorage = (key: string): any => {
    const v = window.localStorage.getItem(key)
    return v ? JSON.parse(v) : void 0
}

export const setLocalStorage = (key: string, value: any) => {
    window.localStorage.setItem(key, JSON.stringify(value))
}

export default { setLocalStorage, getLocalStorage }