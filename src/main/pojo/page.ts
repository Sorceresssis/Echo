export class DBPageQueryOptions {
    constructor(
        public pn: number = 1,
        public ps: number = 30,
        public totalCountRequired = false,
    ) { }
}

export class Page {
    public constructor(
        public pn: number,
        public ps: number,
        public total_count: number,
        public total_page: number = this.total_count ? Math.ceil(this.total_count / this.ps) : 0
    ) {
    }
}

export class PagedResult<T> {
    public results: T[];
    public page: Page;

    public constructor(
        results: T[],
        pn: number,
        ps: number,
        total_count: number
    ) {
        this.results = results;
        this.page = new Page(pn, ps, total_count);
    }
}

