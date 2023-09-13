export async function getConfig(key: keyof Config) {
    return await window.electronAPI.config(key)
}

export async function setConfig(key: keyof Config, value: string) {
    return await window.electronAPI.config(key, value)
}

export default {getConfig, setConfig}