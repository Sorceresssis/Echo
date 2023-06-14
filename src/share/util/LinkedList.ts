class LinkNode<T> {
    public data: T
    public next: LinkNode<T> | null

    constructor(data: any) {
        this.data = data
        this.next = null
    }


}



export class LinkedList<T> {
    private head: LinkNode<T> | null
    private tail: LinkNode<T> | null

    constructor() {
        this.head = this.tail = null
    }

    push(t: T) {
        if (this.head) {
            this.tail!.next = new LinkNode(t)
            this.tail! = this.tail!.next
        } else {
            this.head = this.tail = new LinkNode(t)
        }
    }

    pop() {
        if (this.head) {

        } else {

        }
    }
    toArray() {
    }
}

let test: LinkedList<number> = new LinkedList<number>()

test.push(1);
test.push(2);
test.push(3);
test.push(4);
console.log(test);


