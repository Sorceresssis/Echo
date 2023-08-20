// 动态sql类
export default class DynamicSqlBuilder {
    private sqlBuffer: string[]
    private params: any[]

    constructor() {
        this.sqlBuffer = []
        this.params = []
    }

    public getSql(): string {
        return this.sqlBuffer.join(' ')
    }

    public getParams(): any[] {
        return this.params
    }

    public append(sql: string, ...params: any[]): DynamicSqlBuilder {
        this.sqlBuffer.push(sql)
        this.params.push(...params)
        return this
    }

    public appendParam(...params: any[]): DynamicSqlBuilder {
        this.params.push(...params)
        return this
    }
}