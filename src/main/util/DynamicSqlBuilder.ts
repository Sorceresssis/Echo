export type SortRule = {
    field: string,
    order: 'ASC' | 'DESC',
    table?: string,
}

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

    public appendWhereSQL(rule: string[], ...params: any[]) {
        if (!rule.length) return this
        this.params.push(...params)
        return this.append('WHERE').append(rule.join(' AND '))
    }

    public appendOrderSQL(
        sortRule: SortRule[],
    ): DynamicSqlBuilder {
        return sortRule.length
            ? this.append('ORDER BY').append(sortRule.map(rule => {
                if (rule.table) {
                    return `${rule.table}.${rule.field} ${rule.order}`
                }
                return `${rule.field} ${rule.order}`
            }).join(','))
            : this
    }

    public appendLimitSQL(offset: number, rowCount: number) {
        return this.append('LIMIT ?,?', offset, rowCount)
    }
}