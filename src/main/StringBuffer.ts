export class StringBuffer {
    private buffer: string[]
    constructor() {
        this.buffer = []
    }
    append(str: string): void {
        this.buffer.push(str)
    }
    toString(): string {
        return this.buffer.join("")
    }
}