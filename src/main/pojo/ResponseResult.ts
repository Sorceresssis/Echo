class ResponseResult<T extends any> {
    code: number
    msg: string
    data?: T

    public constructor(code: number, msg: string, data?: T) {
        this.code = code
        this.msg = msg
        this.data = data
    }

    public static success<T>(data?: T) {
        return new ResponseResult(1, 'ok', data)
    }

    public static error(msg?: string) {
        return new ResponseResult<undefined>(0, msg ?? 'Unknown Error')
    }
}

export default ResponseResult