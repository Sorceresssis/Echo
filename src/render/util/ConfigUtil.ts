export function getConfig(key: keyof Config) {
    return window.electronAPI.config('get', key) as Promise<string>
}

export function setConfig(key: keyof Config, value: string) {
    return window.electronAPI.config('set', key, value) as Promise<string>
}

export function resetConfig() {
    return window.electronAPI.config('reset') as Promise<void>
}

export function getAllConfig(): Promise<Config> {
    return window.electronAPI.config('all') as Promise<Config>
}

export default { getConfig, setConfig, resetConfig, getAllConfig }