class LocalStorage {
    public static get<T>(key: string): T | undefined {
        const v = window.localStorage.getItem(key)
        return v ? JSON.parse(v) as T : void 0
    }

    public static set(key: string, value: any): void {
        window.localStorage.setItem(key, JSON.stringify(value))
    }
}

export default LocalStorage