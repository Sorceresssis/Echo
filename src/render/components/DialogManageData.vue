<template>
    <div class="manageData-wrap">
        <div class="Menu">
            <div v-for="(menuItem, index) in menuItems"
                 :class="activeCard == index ? 'Menu__item--active' : ''"
                 class="Menu__item"
                 @click="activeCard = index">
                {{ menuItem }}
            </div>
        </div>
        <div class="manageData__body">
            <div v-if="activeCard == 0 || activeCard == 1">
                <div class="dialogCol"
                     v-show="activeCard == 0">
                    <div class="col-title">文件路径</div>
                    <div class="col-content">
                        <div>
                            <el-input readonly
                                      placeholder="父文件夹"></el-input>
                        </div>
                        <div>
                            <el-input readonly
                                      placeholder="文件名"></el-input>
                            <button class="button"><span>清空</span></button>
                            <button class="button"
                                    @click="test"><span>选择文件</span></button>
                        </div>
                    </div>
                </div>
                <div class="dialogCol"
                     v-show="activeCard == 1">
                    <div class="col-title">导入源</div>
                    <div class="col-content">
                        <div>
                            <el-input readonly></el-input>
                            <button class="button"><span>选择文件夹</span></button>
                        </div>
                    </div>
                </div>
                <div class="dialogCol">
                    <div class="col-title">链接</div>
                    <div class="col-content"><el-input clearable></el-input></div>
                </div>
                -------------------------------------------------------------
                <div class="dialogCol"
                     v-show="activeCard == 0">
                    <div class="col-title">{{ $t('mainContainer.title') }}</div>
                    <div class="col-content">
                        <div>
                            <!-- TODO: ::after 伪类 加必填标记 -->
                            <!-- TODO: 加一点提示tips -->
                            <!-- 支持png, jpg -->
                            <el-autocomplete v-model="addItem_title"
                                             :placeholder="i18n.global.t('mainContainer.universalSearch')"
                                             clearable
                                             :trigger-on-focus="false"
                                             :fetch-suggestions="getSuggestions"
                                             onfocus="this.select()">
                                <template #default="{ item }">
                                    <AutoCompleteSuggestion :item="item"></AutoCompleteSuggestion>
                                </template>
                            </el-autocomplete>
                        </div>
                    </div>
                </div>
                <div class="dialogCol"
                     v-show="activeCard == 0">
                    <div class="col-title">封面</div>
                    <div class="col-content">
                        <div>
                            <el-input></el-input>
                            <button class="button"><span>选择图片</span></button>
                        </div>
                    </div>
                </div>
                <div class="dialogCol">
                    <div class="col-title">{{ $t('mainContainer.author') }}</div>
                    <div class="col-content">
                        <div>
                            <el-autocomplete v-model="addItem_title"
                                             :placeholder="i18n.global.t('mainContainer.universalSearch')"
                                             clearable
                                             :trigger-on-focus="false"
                                             :fetch-suggestions="getSuggestions"
                                             onfocus="this.select()">
                                <template #default="{ item }">
                                    <AutoCompleteSuggestion :item="item"></AutoCompleteSuggestion>
                                </template>
                            </el-autocomplete>
                            <button class="button"><span>添加作者</span></button>
                        </div>
                        <div>
                            <div v-for="author in addItem_authors"
                                 class="authorProfile">
                                <div><img class="img--cover"
                                         src="../assets/images/2.jpg"
                                         alt=""></div>
                                <div>{{ author.name }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="dialogCol">
                    <div class="col-title">标签</div>
                    <div class="col-content">
                        <div>
                            <el-autocomplete v-model="addItem_title"
                                             :placeholder="i18n.global.t('mainContainer.universalSearch')"
                                             clearable
                                             :trigger-on-focus="false"
                                             :fetch-suggestions="getSuggestions"
                                             onfocus="this.select()">
                                <template #default="{ item }">
                                    <AutoCompleteSuggestion :item="item"></AutoCompleteSuggestion>
                                </template>
                            </el-autocomplete>
                            <button class="button"><span>添加标签</span></button>
                        </div>
                        <div>
                            <span v-for="tag in addItem_tags">
                                {{ tag }}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="dialogCol">
                    <div class="col-title">加入系列</div>
                    <div class="col-content">
                        <div>

                        </div>
                        <div>
                            系列表
                        </div>
                    </div>
                </div>
                <div class="dialogCol">
                    <div class="col-title">介绍</div>
                    <div class="col-content">
                        <div>
                            <div class="el-input__wrapper"
                                 style="height: 80px;">
                                <textarea name=""
                                          id=""
                                          cols="30"
                                          rows="10"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="dialogCol">
                    <div class="col-title">信息</div>
                    <div class="col-content">
                        <div>
                            <div class="el-input__wrapper"
                                 style="height: 80px;">
                                <textarea name=""
                                          id=""
                                          cols="30"
                                          rows="10"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="dialogCol">
                    <el-button>导入</el-button>
                </div>
            </div>
            <div v-else-if="activeCard == 2">
                <div class="dialogCol">
                    <div class="col-title">作者</div>
                    <div class="col-content">
                        <div>
                            <el-input clearable></el-input>
                            <button class="button"><span>选择图片</span></button>
                        </div>
                        <div>
                            <el-input clearable></el-input>
                            <button class="button"><span>添加</span></button>
                        </div>
                    </div>
                </div>
                批量添加
                添加的文件夹
                tag
                作者
            </div>
            <div v-else-if="activeCard == 3">
                添加属性
                tag
                author
                系列
            </div>
            <div v-else-if="activeCard == 4">
                批量删除，by 属性 文件夹， 作者， 标签
            </div>
            <div v-else-if="activeCard == 5">
                更改 删除 属性
                authorName1 -> authorName2
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue'
import i18n from '../locales/index'
const menuItems = ['添加', '批量添加', '添加属性', '删除', '更改属性']
const activeCard = ref<number>(0)

const addItem_path = ref<string>('')
const addItem_hyperlink = ref<string>('')
const addItem_title = ref<string>('')
const addItem_authors = ref<{ id: number, name: string }[]>([{ id: 1, name: '作者A' }, { id: 2, name: '作者B' }, { id: 3, name: '作者C' }])
const addItem_tags = ref<string[]>(['tag1', 'tag2', 'tag3'])
const addItem_intro = ref<string>('')
const addItem_info = ref<string>('')
const getSuggestions = () => {

}


const test = async () => {
    console.log(await window.electronAPI.openDialog(2, true));
}
</script>

<style scoped>
.manageData-wrap {
    padding: 15px 0;
}

.Menu {
    display: flex;
    border-bottom: 1.5px solid #ebebeb;
}

.Menu__item {
    height: 25px;
    width: 70px;
    text-align: center;
    font-size: 14px;
    font-weight: 700;
    margin-right: 10px;
    line-height: 1;
    border-bottom: 3px solid #fff;
}

.Menu__item:hover {
    color: #887cf7;
}

.Menu__item--active {
    color: #887cf7;
    border-bottom: 3px solid #887cf7;
}

.manageData__body {
    height: 290px;
    padding: 0 10px;
    overflow: auto;
}

.manageData__body::-webkit-scrollbar {
    width: 6px;
    background-color: transparent;
}

.manageData__body::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background-color: #cfcfcf;
}

.manageData__body textarea {
    width: 100%;
    height: 100%;
    resize: none;
    border: none;
    outline: none;
    padding: 4px 0;
    font-family: inherit;
    font-size: inherit;
    color: #606266;
    background-color: inherit;
    box-sizing: border-box;
}

.authorProfile {}
</style>