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
                            <el-autocomplete v-model="add_folderName"
                                             :placeholder="$t('dialog.inputDirName')"
                                             :trigger-on-focus="false"
                                             :fetch-suggestions="autoCompSug_folder"
                                             clearable
                                             onfocus="this.select()">
                                <template #default="{ item }">
                                    <AutoCompleteSuggestion :item="item" />
                                </template>
                            </el-autocomplete>
                        </div>
                        <div>
                            <el-input v-model="add_fileName"
                                      :placeholder="$t('dialog.inputBaseName')"
                                      clearable />
                        </div>
                        <div>
                            <button class="button"
                                    @click="selectFile(false, separatePaths)">
                                <span>{{ $t('dialog.selectFile') }}</span>
                            </button>
                            <button class="button"
                                    @click="selectDir(false, separatePaths)">
                                <span>{{ $t('dialog.selectDir') }}</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="dialogCol"
                     v-show="activeCard == 1">
                    <div class="col-title"><span class="required">导入源</span></div>
                    <div class="col-content">
                        <div>
                            <el-input placeholder="将文件夹里的文件名作为标题名快速导入"
                                      readonly />
                            <button class="button"
                                    @click="selectDir(false, (path) => {
                                    })">
                                <span>选择文件夹</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="dialogCol"
                     v-show="activeCard == 0">
                    <div class="col-title">链接</div>
                    <div class="col-content">
                        <el-input v-model="add_hyperlink"
                                  placeholder="https://example.com/"
                                  clearable />
                    </div>
                </div>
                <div class="divider"></div>
                <div class="dialogCol"
                     v-show="activeCard == 0">
                    <div class="col-title"><span class="required">{{ $t('mainContainer.title') }}</span></div>
                    <div class="col-content">
                        <div>
                            <el-autocomplete v-model="add_title"
                                             clearable
                                             :trigger-on-focus="false"
                                             :fetch-suggestions="autoCompSug_title"
                                             onfocus="this.select()">
                                <template #default="{ item }">
                                    <AutoCompleteSuggestion :item="item" />
                                </template>
                            </el-autocomplete>
                        </div>
                    </div>
                </div>
                <div class="dialogCol"
                     v-show="activeCard == 0">
                    <div class="col-title">{{ $t('app.coverImage') }}</div>
                    <div class="col-content">
                        <div>
                            <el-input v-model="add_coverImage"
                                      :placeholder="$t('dialog.inputImage')" />
                            <button class="button"
                                    @click="selectImage(false,
                                        (path) => {
                                            add_coverImage = path as string
                                        })">
                                <span>{{ $t('dialog.selectImage') }}</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="dialogCol">
                    <div class="col-title">{{ $t('app.author') }}</div>
                    <div class="col-content">
                        <div>
                            <el-autocomplete v-model="add_input_author"
                                             placeholder="添加已经有的，不能直接新建一个作者"
                                             clearable
                                             :trigger-on-focus="false"
                                             :fetch-suggestions="autoCompSug_author"
                                             onfocus="this.select()">
                                <template #default="{ item }">
                                    <AutoCompleteSuggestion :item="item" />
                                </template>
                            </el-autocomplete>
                            <button class="button"><span>{{ $t('dialog.add') }}</span></button>
                        </div>
                        <div style="flex-wrap: wrap;">
                            <div v-for="author in add_authors"
                                 style="width: 100%;">
                                <div class="author__avatar">
                                    <img class="img--cover"
                                         src="../assets/images/2.jpg"
                                         alt="">
                                </div>
                                <div>
                                    {{ author.name }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="dialogCol">
                    <div class="col-title">{{ $t('app.tag') }}</div>
                    <div class="col-content">
                        <div>
                            <el-autocomplete v-model="add_input_tag"
                                             :placeholder="$t('dialog.inputTag')"
                                             clearable
                                             :trigger-on-focus="false"
                                             :fetch-suggestions="autoCompSug_tag"
                                             onfocus="this.select()">
                                <template #default="{ item }">
                                    <AutoCompleteSuggestion :item="item" />
                                </template>
                            </el-autocomplete>
                            <button class="button"><span>{{ $t('dialog.add') }}</span></button>
                        </div>
                        <div>
                            <span v-for="tag in add_tags">
                                {{ tag }}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="dialogCol">
                    <div class="col-title">{{ $t('app.series') }}</div>
                    <div class="col-content">
                        <div>
                            <el-autocomplete clearable
                                             :trigger-on-focus="false"
                                             :fetch-suggestions="autoCompSug_series"
                                             onfocus="this.select()">
                                <template #default="{ item }">
                                    <AutoCompleteSuggestion :item="item" />
                                </template>
                            </el-autocomplete>
                            <button class="button"><span>{{ $t('dialog.add') }}</span></button>
                        </div>
                        <div>
                            系列表
                        </div>
                    </div>
                </div>
                <div class="dialogCol">
                    <div class="col-title">{{ $t('app.intro') }}</div>
                    <div class="col-content">
                        <div>
                            <el-input v-model="adAuth_intro"
                                      :placeholder="i18n.global.t('dialog.inputIntro_item')"
                                      :autosize="{ minRows: 4 }"
                                      type="textarea"
                                      resize="none"
                                      clearable />
                        </div>
                    </div>
                </div>
                <div class="dialogCol">
                    <div class="col-title">{{ $t('app.info') }}</div>
                    <div class="col-content">
                        <div>
                            <el-input v-model="adAuth_intro"
                                      :placeholder="i18n.global.t('dialog.inputInfo_item')"
                                      :autosize="{ minRows: 4 }"
                                      type="textarea"
                                      resize="none"
                                      clearable />
                        </div>
                    </div>
                </div>
                <div class="dialogCol">
                    <el-button>{{ $t('dialog.add') }}</el-button>
                </div>
            </div>
            <div v-else-if="activeCard == 2">
                <div class="dialogCol">
                    <div class="col-title">{{ $t('app.folder') }}</div>
                    <div class="col-content">
                        <div>
                            <el-autocomplete v-model="de_item_Byfolder"
                                             :placeholder="$t('dialog.inputFolder')"
                                             clearable
                                             :trigger-on-focus="false"
                                             :fetch-suggestions="autoCompSug_folder"
                                             onfocus="this.select()">
                                <template #default="{ item }">
                                    <AutoCompleteSuggestion :item="item" />
                                </template>
                            </el-autocomplete>
                        </div>
                        <div>
                            <button class="button"><span>{{ $t('dialog.delete') }}</span></button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else-if="activeCard == 3">
                <div class="dialogCol">
                    <div class="col-title">{{ $t('app.avatar') }}</div>
                    <div class="col-content">
                        <div>
                            <el-input v-model="adAuth_AvatarPath"
                                      :placeholder="$t('dialog.filePath')"
                                      clearable />
                            <button class="button"
                                    @click="selectImage(false, (path) => adAuth_AvatarPath = path as string)">
                                <span>{{ $t('dialog.selectImage') }}</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="dialogCol">
                    <div class="col-title"><span class="required">{{ $t('app.name') }}</span> </div>
                    <div class="col-content">
                        <div>
                            <el-autocomplete v-model="adAuth_name"
                                             clearable
                                             :trigger-on-focus="false"
                                             :fetch-suggestions="autoCompSug_author"
                                             onfocus="this.select()">
                                <template #default="{ item }">
                                    <AutoCompleteSuggestion :item="item" />
                                </template>
                            </el-autocomplete>
                        </div>
                    </div>
                </div>
                <div class="dialogCol">
                    <div class="col-title">{{ $t('app.intro') }}</div>
                    <div class="col-content">
                        <div>
                            <el-input v-model="adAuth_intro"
                                      :autosize="{ minRows: 4 }"
                                      type="textarea"
                                      resize="none"
                                      clearable />
                        </div>
                    </div>
                </div>
                <div class="dialogCol">
                    <el-button>{{ $t('dialog.add') }}</el-button>
                </div>
            </div>
            <div v-else-if="activeCard == 4">
                <div class="dialogCol">
                    <div class="col-title">{{ $t('app.folder') }}</div>
                    <div class="col-content">
                        <div>
                            <el-autocomplete v-model="ed_folder"
                                             :placeholder="$t('dialog.oldValue')"
                                             clearable
                                             :trigger-on-focus="false"
                                             :fetch-suggestions="autoCompSug_folder"
                                             onfocus="this.select()">
                                <template #default="{ item }">
                                    <AutoCompleteSuggestion :item="item" />
                                </template>
                            </el-autocomplete>
                        </div>
                        <div>
                            <el-input v-model="ed_folder_new"
                                      :placeholder="$t('dialog.newValue')"
                                      clearable />
                        </div>
                        <div>
                            <button class="button"
                                    @click="">
                                <span>{{ $t('dialog.alter') }}</span>
                            </button>
                            <button class="button"
                                    @click="">
                                <span>{{ $t('dialog.delete') }}</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="divider"></div>
                <div class="dialogCol">
                    <div class="col-title">{{ $t('app.tag') }}</div>
                    <div class="col-content">
                        <div>
                            <el-autocomplete v-model="ed_tag"
                                             :placeholder="$t('dialog.oldValue')"
                                             clearable
                                             :trigger-on-focus="false"
                                             :fetch-suggestions="autoCompSug_tag"
                                             onfocus="this.select()">
                                <template #default="{ item }">
                                    <AutoCompleteSuggestion :item="item" />
                                </template>
                            </el-autocomplete>
                        </div>
                        <div>
                            <el-input v-model="ed_tag_new"
                                      :placeholder="$t('dialog.newValue')"
                                      clearable />
                        </div>
                        <div>
                            <button class="button"
                                    @click="">
                                <span>{{ $t('dialog.alter') }}</span>
                            </button>
                            <button class="button"
                                    @click="">
                                <span>{{ $t('dialog.delete') }}</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="divider"></div>
                <div class="dialogCol">
                    <div class="col-title">{{ $t('app.series') }}</div>
                    <div class="col-content">
                        <div>
                            <el-autocomplete v-model="ed_series"
                                             :placeholder="$t('dialog.oldValue')"
                                             clearable
                                             :trigger-on-focus="false"
                                             :fetch-suggestions="autoCompSug_series"
                                             onfocus="this.select()">
                                <template #default="{ item }">
                                    <AutoCompleteSuggestion :item="item" />
                                </template>
                            </el-autocomplete>
                        </div>
                        <div>
                            <el-input v-model="ed_series_new"
                                      :placeholder="$t('dialog.newValue')"
                                      clearable />
                        </div>
                        <div>
                            <button class="button"
                                    @click="">
                                <span>{{ $t('dialog.alter') }}</span>
                            </button>
                            <button class="button"
                                    @click="">
                                <span>{{ $t('dialog.delete') }}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { inject, ref, Ref } from 'vue'
import i18n from '../../locales/index'
import { autoCompleteType } from '../../store/enum'
import { selectFile, selectDir, selectImage } from '../../util/externalOperation';
import AutoCompleteSuggestion from './AutoCompleteSuggestion.vue';

const activeLibrary = inject<Ref<library>>('activeLibrary') as Ref<library>

const autoCompSug_title = (queryString: string, cb: any) => {
    window.electronAPI.libraryAutoComplete(activeLibrary.value.id, autoCompleteType.ITEM_TITLE, queryString, 20).then((a) => {
        cb(a)
    })
}
const autoCompSug_author = (queryString: string, cb: any) => {
    window.electronAPI.libraryAutoComplete(activeLibrary.value.id, autoCompleteType.AUTHOR_NAME, queryString, 20).then((a) => {
        cb(a)
    })
}
const autoCompSug_tag = (queryString: string, cb: any) => {
    window.electronAPI.libraryAutoComplete(activeLibrary.value.id, autoCompleteType.TAG_TITLE, queryString, 20).then((a) => {
        cb(a)
    })
}
const autoCompSug_folder = (queryString: string, cb: any) => {
    window.electronAPI.libraryAutoComplete(activeLibrary.value.id, autoCompleteType.FOLDER_PATH, queryString, 20).then((a) => {
        cb(a)
    })
}
const autoCompSug_series = (queryString: string, cb: any) => {
    window.electronAPI.libraryAutoComplete(activeLibrary.value.id, autoCompleteType.SERIES_NAME, queryString, 20).then((a) => {
        cb(a)
    })
}
const separatePaths = (path: string | string[]) => {
    add_fileName.value = (path as string).substring((path as string).lastIndexOf('\\') + 1);
    add_folderName.value = (path as string).substring(0, (path as string).lastIndexOf('\\'));
}

/******************** 页面操作 ********************/
const menuItems = [i18n.global.t('dialog.add'),
i18n.global.t('dialog.batchAdd'),
i18n.global.t('dialog.batchDelete'),
i18n.global.t('dialog.addAuthor'),
i18n.global.t('dialog.edOrDeAttri'),]
const activeCard = ref<number>(0)


/******************** add & adds********************/
const add_folderName = ref<string>('')
const add_fileName = ref<string>('')
const add_hyperlink = ref<string>('')
const add_title = ref<string>('')
const add_coverImage = ref<string>('')
const add_authors = ref<{ id: number, name: string }[]>([{ id: 0, name: 'fdf' }, { id: 1, name: 'fdf' }])
const add_tags = ref<string[]>(['tag1', 'tag2', 'tag3'])
const add_series = ref<string[]>(['series1', 'series2', 'series3'])
const add_intro = ref<string>('')
const add_info = ref<string>('')

const add_input_series = ref<string>('')
const add_input_author = ref<string>('')
const add_input_tag = ref<string>('')


const add_Item = () => {
}



/******************** deleteItem ********************/
const de_item_Byfolder = ref<string>('')
const de_item_Byseries = ref<string>('')


/******************** add Author ********************/
const adAuth_AvatarPath = ref<string>('')
const adAuth_name = ref<string>('')
const adAuth_intro = ref<string>('')



/******************** edit Attribute ********************/
const ed_folder = ref<string>('')
const ed_folder_new = ref<string>('')
const ed_tag = ref<string>('')
const ed_tag_new = ref<string>('')
const ed_series = ref<string>('')
const ed_series_new = ref<string>('')



</script>

<style scoped>
.manageData-wrap {
    padding: 15px 0;
}

.Menu {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    border-bottom: 1.5px solid #ebebeb;
}

.Menu__item {
    height: 25px;
    text-align: center;
    font-size: 14px;
    font-weight: 700;
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

.required::after {
    content: '﹡';
    color: #fd6778;
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

.author {
    width: 74px;
    height: 100px;
    margin: 0 10px;
    text-align: center;
    overflow: hidden;
}

.author__avatar {
    width: 74px;
    height: 74px;
    flex-shrink: 0;
    border-radius: 50%;
    overflow: hidden;
}

.author__profile {
    height: 86px;
    display: flex;
    justify-content: left;
    align-items: start;
    margin-bottom: 10px;
    overflow: hidden;
}
</style>