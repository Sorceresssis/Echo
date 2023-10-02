export const sendCrosTabMsg = (channel: BroadcastChannel, msg: string) => {
    channel.postMessage(msg)
}

export const listenCrosTabMsg = (channel: BroadcastChannel, cb: (e: MessageEvent, options?: boolean | AddEventListenerOptions | undefined) => void) => {
    channel.addEventListener('message', cb)
}

// const useCrosTabMsg = (name: string) => {
//     const bc = new BroadcastChannel(name)

//     return {
//         send(msg: string) {
//             bc.postMessage(msg)
//         },
//         listen(cb: (e: MessageEvent, options?: boolean | AddEventListenerOptions | undefined) => void) {
//             bc.addEventListener('message', cb)
//         }
//     }
// }