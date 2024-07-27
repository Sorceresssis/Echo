declare type DashDropMenu = {
    HTMLElementTitle: string,
    title: string,
    items: DashDropMenuItem[] | Ref<DashDropMenuItem[]>
}

type DashDropMenuItem = {
    key?: any
    title: string
    divided: boolean
    click: (...args: any[]) => any
    dot: (...args: any[]) => boolean
}

type Tabs = {
    id: number,
    label: string,
    disabled?: boolean,
}