type DashDropMenu = {
    HTMLElementTitle: string,
    title: string,
    items: {
        title: string,
        divided: boolean,
        click: (...args: any[]) => any,
        dot: (...args: any[]) => boolean
    }[]
}

type Tabs = {
    id: number,
    label: string,
    disabled?: boolean,
}