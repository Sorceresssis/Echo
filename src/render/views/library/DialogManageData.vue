<!-- <template>
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
            <div>
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
            <div>
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
import AutoCompleteSuggestion from '../../components/AutoCompleteSuggestion.vue';

const activeLibrary = inject<Ref<library>>('activeLibrary') as Ref<library>

const autoComp = (type: number, libraryId: number) => {
    return (queryString: string, cb: any) => {
        window.electronAPI.libraryAutoComplete(libraryId, type, queryString, 20).then((a) => {
            cb(a)
        })
    }
}



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
</script> -->