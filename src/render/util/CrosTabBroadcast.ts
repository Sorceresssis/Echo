export type CrosTabBroadcastMsg<T> = {
    type: string,
    payload: T
}

class CrosTabBroadcast extends BroadcastChannel {
    constructor(channel: string) {
        super(channel)
    }

    public sendMsg<T extends any>(msg: CrosTabBroadcastMsg<T>) {
        this.postMessage(msg)
    }

    public onMessage(cb: (e: MessageEvent) => void) {
        this.addEventListener('message', cb)
    }
}

export default CrosTabBroadcast