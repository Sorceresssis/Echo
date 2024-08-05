  type DashDropMenu = {
    HTMLElementTitle: string,
    title: string,
    items: DashDropMenuItem[]
}

type DashDropMenuItem = {
    key?: any
    title: string
    divided: boolean
    click: (...args: any[]) => any
    hit: (...args: any[]) => boolean
}

type Tabs = {
    id: number,
    label: string,
    disabled?: boolean,
}