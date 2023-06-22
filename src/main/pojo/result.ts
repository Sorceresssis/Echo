/**
* ipc返回结果类，code的0代表失败，1代表成功。
*/
export default class Result {
    code: number
    msg: string
    data: any
    constructor(code: number, msg: string, data: any) {
        this.code = code
        this.msg = msg
        this.data = data
    }

    static success(data: any = null) {
        return new Result(1, '', data)
    }

    static error(msg: string) {
        return new Result(0, msg, null)
    }
}