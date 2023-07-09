<template>
    <div>
        <div class="setting-item">
            <div class="setting-item__title">视频教程</div>
            <div class="setting-item__content">
                <div>
                    <a @click.=" "
                       class="externalUrl">
                        Bilibili
                    </a>
                </div>
                <div>
                    <a @click.=" "
                       class="externalUrl">
                        Youtube
                    </a>
                </div>
            </div>
        </div>
        <div class="setting-item">
            <div class="setting-item__title">图文教程</div>
            <div class="setting-item__content">
                <div class="tutor-header">
                    <div v-for="menu in tutorMenus"
                         class="tutor-menu">
                        <div>{{ menu.menuTitle }}</div>
                        <div>
                            <div v-for="menuItem in menu.menu">
                                <a :href="menuItem.anchor"
                                   @click.prevent="scrollToAnchor">{{ menuItem.itemTitle }}</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div>
                        <h3 id="section-1">注意</h3>
                        <div>
                            <p>
                                作者， 标题可以重名，但是tag,系列，不能改软件不能保存相同的
                            </p>
                        </div>
                    </div>
                    <div>
                        <h3 id="section-2"></h3>
                        <div>

                        </div>
                    </div>
                    <div>
                        <h3 id="section-3"></h3>
                        <p>fdfdfdf</p>
                    </div>
                    <div>
                        <h3 id="section-4"></h3>
                        <p>fdfdfdf</p>
                    </div>
                    <div>
                        <h3 id="section-5"></h3>
                        <p class="tur">
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>

type tutorMenu = {
    menuTitle: string,
    menu: { itemTitle: string, anchor: string }[]
}

const tutorMenus: tutorMenu[] = [
    { menuTitle: 'fdf', menu: [{ itemTitle: '1', anchor: '#tutor-1-1' }, { itemTitle: '11', anchor: '#tutor-1-2' }] },
    { menuTitle: 'fdf', menu: [{ itemTitle: '2', anchor: '#tutor-2-1' }, { itemTitle: '22', anchor: '#tutor-2-2' }] },
    { menuTitle: 'fdf', menu: [{ itemTitle: '3', anchor: '#tutor-3-1' }, { itemTitle: '33', anchor: '#tutor-3-2' }] },
    { menuTitle: 'fdf', menu: [{ itemTitle: '4', anchor: '#tutor-4-1' }, { itemTitle: '44', anchor: '#tutor-4-2' }] },
    { menuTitle: 'fdf', menu: [{ itemTitle: '5', anchor: '#tutor-5-1' }, { itemTitle: '55', anchor: '#tutor-5-2' }] },
]

const scrollToAnchor = (e: MouseEvent) => {
    const href = (e.target as HTMLLinkElement).getAttribute("href"); // 获取链接的 href 属性
    const scrollContainer = document.querySelector('#settingContainer') as HTMLDivElement; // 获取滚动容器
    const targetElement = document.querySelector(href as string) as HTMLDivElement;  // 获取目标元素
    if (targetElement) {
        scrollContainer.scrollTo({
            top: targetElement.offsetTop,
            behavior: "smooth"
        });
    }
}
</script>

<style scoped>
.tutor-header {
    display: grid;
    grid-template-columns: repeat(auto-fill, 220px);
    overflow-y: auto;
    justify-content: space-around;
    grid-gap: 20px;
    column-gap: 20px;
}
</style>