<template>
    <div class="leftBar">
        <div id="logo">Echo</div>
        <div id="menuWrapper">
            <div>
                <div class="menuTitle">工作台</div>
                <div>
                    <ul>
                        <li :class="{ active: activeId == -1 }" class="menuItem " @click="setActive(-1)">稍后再看</li>
                        <li :class="{ active: activeId == -2 }" class="menuItem " @click="setActive(-2)">反对法</li>
                    </ul>
                </div>
            </div>
            <div>
                <div class="menuTitle spaceBetween"> <span>创建的组</span> <span class="iconfont" @click="">&#xe68c;</span>
                </div>
                <div>
                    <ul>
                        <li v-for="(group, index) in Alldatabase" :draggable="true" @click="showHide(index)">
                            <div class="menuItem "><span></span>{{ group.name }}</div>
                            <div class="contant">
                                <ul>
                                    <li :draggable="true" class="menuItem " :class="{ active: activeId == database.ID }"
                                        @click.stop="setActive(database.ID)"
                                        v-for="(database, index) in group.databaseList">
                                        {{ database.name }}
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { locStub } from '@vue/compiler-core';
import { ref } from 'vue';

let Alldatabase = [
    {
        ID: 1,
        order: 1,
        name: 'group1',
        databaseList: [
            {
                ID: 1,
                order: 1,
                name: '反季节1'
            },
            {
                ID: 2,
                order: 2,
                name: '反季节2'
            },
            {
                ID: 3,
                order: 3,
                name: '反季节3'
            }
        ]
    },
    {
        ID: 2,
        order: 2,
        name: 'group2',
        反季节List: [
            {
                ID: 1,
                order: 1,
                name: 'database1'
            },
            {
                ID: 2,
                order: 2,
                name: 'database2'
            },
            {
                ID: 3,
                order: 3,
                name: 'database3'
            }
        ]
    },
    {
        ID: 3,
        order: 3,
        name: 'group3',
        databaseList: [
            {
                ID: 1,
                order: 1,
                name: 'database1'
            },
            {
                ID: 2,
                order: 2,
                name: 'database2'
            },
            {
                ID: 3,
                order: 3,
                name: 'database3'
            }
        ]
    },
    {
        ID: 3,
        order: 3,
        name: 'group3',
        databaseList: [
            {
                ID: 1,
                order: 1,
                name: 'database1'
            },
            {
                ID: 2,
                order: 2,
                name: 'database2'
            },
            {
                ID: 3,
                order: 3,
                name: 'database3'
            }
        ]
    },
    {
        ID: 3,
        order: 3,
        name: 'group3',
        databaseList: [
            {
                ID: 1,
                order: 1,
                name: 'database1'
            },
            {
                ID: 2,
                order: 2,
                name: 'database2'
            },
            {
                ID: 3,
                order: 3,
                name: 'database3'
            }
        ]
    },
    {
        ID: 3,
        order: 3,
        name: 'group3',
        databaseList: [
            {
                ID: 1,
                order: 1,
                name: 'database1'
            },
            {
                ID: 2,
                order: 2,
                name: 'database2'
            },
            {
                ID: 3,
                order: 3,
                name: 'database3'
            }
        ]
    },
    {
        ID: 3,
        order: 3,
        name: 'group3',
        databaseList: [
            {
                ID: 1,
                order: 1,
                name: 'database1'
            },
            {
                ID: 2,
                order: 2,
                name: 'database2'
            },
            {
                ID: 3,
                order: 3,
                name: 'database3'
            }
        ]
    },
    {
        ID: 3,
        order: 3,
        name: 'group3',
        databaseList: [
            {
                ID: 1,
                order: 1,
                name: 'datdfffffffffffffffffffffffffffffffffffffffffffffffabase1'
            },
            {
                ID: 2,
                order: 2,
                name: 'database2'
            },
            {
                ID: 3,
                order: 3,
                name: 'database3'
            }
        ]
    },
    {
        ID: 3,
        order: 3,
        name: 'group3',
        databaseList: [
            {
                ID: 1,
                order: 1,
                name: 'database1'
            },
            {
                ID: 2,
                order: 2,
                name: 'database2'
            },
            {
                ID: 3,
                order: 3,
                name: 'database3'
            }
        ]
    }
]
let activeId = ref()

function setActive(index: number) {
    activeId.value = index
}

function showHide(index: number) {    //点击展开收起
    let contant: HTMLDivElement = <HTMLDivElement>document.getElementsByClassName('contant')[index];    //这里我们通过参数index来让浏览器判断你点击的是哪一个列表   
    // let height = contant.getBoundingClientRect().height;    //获取页面元素的当前高度


}

</script>

<style scoped>
.leftBar {
    display: flex;
    width: 230px;
    height: 100%;
    flex-direction: column;
    background-color: #f0f0f0;
}

#logo {
    height: 40px;
    padding: 0 20px;
    line-height: 40px;
    text-align: left;
    font-size: 30px;
    font-weight: 200;
    -webkit-app-region: drag;
}

#menuWrapper {
    height: 100%;
    padding: 0 15px;
    overflow-y: auto;
}

#menuWrapper::-webkit-scrollbar {
    width: 4px;
    background-color: transparent;
}

#menuWrapper::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background-color: #cfcfcf;
}

.menuTitle {
    margin-top: 40px;
    font-size: 13px;
    color: #787878;
}

.menuTitle>span:hover {
    color: #000000;
}

.iconfont {
    font-size: 13px;
    font-weight: 700;
    line-height: 16px;
}

.spaceBetween {
    display: flex;
    justify-content: space-between;
}

.contant {
    transition: height 0.3s;
}

.menuItem {
    height: 32px;
    margin: 10px 0;
    padding: 0 10px;
    font-size: 13px;
    line-height: 32px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    border-radius: 5px;
}

.menuItem:hover:not(.active) {
    background-color: #d9d9d9;
}

.active {
    background-color: #1ecd9a;
    color: #fff;
}
</style>