import { SinglyNode } from "./LinkedNode";
import { Iterator, QueueIterator } from "./Iterator";

export default class Queue<T> {
    private head: SinglyNode<T> | null
    private tail: SinglyNode<T> | null
    private size: number

    constructor() {
        this.head = this.tail = null
        this.size = 0
    }

    enqueue(date: T): Queue<T> {
        if (this.isEmpty()) {
            this.head = this.tail = new SinglyNode<T>(date)
        } else {
            this.tail!.next = new SinglyNode<T>(date)
            this.tail = this.tail!.next
        }
        ++this.size
        return this
    }

    dequeue(): T | null {
        if (this.isEmpty()) return null
        const date = this.head!.data
        this.head = this.head!.next
        // 如果队列只有一个元素，那么出队后，队列为空，此时需要将tail置为null
        if (this.isEmpty()) this.tail = null
        --this.size
        return date
    }

    toArray(): T[] {
        return []
    }

    isEmpty(): boolean {
        return this.head === null
    }

    getSize(): number {
        return this.size
    }

    getIterator(): Iterator<T> {
        return new QueueIterator(this.head)
    }
}