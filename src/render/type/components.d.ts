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

type TabsComponent = {
    id: number,
    name: string,
    component: any,
} 