export class SinglyNode<T> {
    public data: T | null
    public next: SinglyNode<T> | null

    constructor(data: T | null) {
        this.data = data
        this.next = null
    }
}

export class DoublyNode<T> {
    public data: T
    public next: DoublyNode<T> | null
    public prev: DoublyNode<T> | null

    constructor(data: T) {
        this.data = data
        this.next = null
        this.prev = null
    }
}