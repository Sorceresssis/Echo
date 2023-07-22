import { SinglyNode } from "./LinkedNode";

export interface Iterator<T> {
    hasNext(): boolean
    next(): T
}

export class QueueIterator<T> implements Iterator<T> {
    private current: SinglyNode<T> | null

    constructor(head: SinglyNode<T> | null) {
        this.current = new SinglyNode<T>(null)
        this.current!.next = head
    }

    hasNext(): boolean {
        return this.current?.next !== null
    }

    next(): T {
        this.current = this.current!.next
        return this.current!.data as T
    }
}