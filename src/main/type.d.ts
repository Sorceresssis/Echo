declare class group {
    id: number
    name: string
    isOpen: number
    librarys: library[]
    constructor(id: number, name: string, isOpen: number, databases: database[]) {
        this.id = id
        this.name = name
        this.isOpen = isOpen
        this.databases = databases
    }
}
declare class library {
    id: number
    name: string
    constructor(id: number, name: string) {
        this.id = id
        this.name = name
    }
}
