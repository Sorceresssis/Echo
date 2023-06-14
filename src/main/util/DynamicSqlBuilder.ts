// 动态sql类
export class DynamicSqlBuilder {
    private sql: string = '';
    private params: any[] = [];

    constructor() {
    }

    public append(sql: string, ...params: any[]): DynamicSqlBuilder {
        this.sql += sql;
        this.params.push(...params);
        return this;
    }

    public build(): { sql: string, params: any[] } {
        return { sql: this.sql, params: this.params };
    }
}