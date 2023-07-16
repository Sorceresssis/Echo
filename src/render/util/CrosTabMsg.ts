export const sendCrosTabMsg = (channel: BroadcastChannel, msg: string) => {
    channel.postMessage(msg)
}

export const listenCrosTabMsg = (channel: BroadcastChannel, cb: (e: MessageEvent, options?: boolean | AddEventListenerOptions | undefined) => void) => {
    channel.addEventListener('message', cb)
}