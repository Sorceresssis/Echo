class Result {
    code: number
    msg?: string
    data?: any

    constructor(code: number, msg?: string, data?: any) {
        this.code = code
        this.msg = msg
        this.data = data
    }

    static success(data?: any) {
        return new Result(1, 'ok', data)
    }

    static error(msg?: string) {
        return new Result(0, msg)
    }
}

export default Result