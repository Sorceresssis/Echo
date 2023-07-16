<template>
    <!-- <div>

        <el-dialog v-model="isVisibleAdvancedSearch"
                   align-center
                   :title="t('mainContainer.advancedSearch')"
                   width="400px"
                   class="dialog">
            <div>
                <div class="dialogCol">
                    <div class="col-title">{{ $t('app.title') }}</div>
                    <el-autocomplete class="col-content"
                                     size="small"
                                     style="width: 240px;"
                                     v-model="searchWord_title"
                                     placeholder="搜索标题"
                                     clearable
                                     fit-input-width
                                     :trigger-on-focus="false"
                                     :fetch-suggestions="autoCompSug_title"
                                     onfocus="this.select()">
                        <template #default="{ item }">
                            <AutoCompleteSuggestion :item="item"></AutoCompleteSuggestion>
                        </template>
                    </el-autocomplete>
                </div>
                <div class="dialogCol">
                    <div class="col-title">{{ $t('app.author') }}</div>
                    <el-autocomplete class="col-content"
                                     size="small"
                                     style="width: 240px;"
                                     v-model="searchWord_author"
                                     placeholder="输入作者"
                                     clearable
                                     :trigger-on-focus="false"
                                     :fetch-suggestions="autoCompSug_author"
                                     onfocus="this.select()">
                        <template #default="{ item }">
                            <AutoCompleteSuggestion :item="item"></AutoCompleteSuggestion>
                        </template>
                    </el-autocomplete>
                </div>
                <div class="dialogCol">
                    <div class="col-title">{{ $t('app.tag') }}</div>
                    <el-autocomplete class="col-content"
                                     size="small"
                                     v-model="searchWord_tag"
                                     placeholder="输入标签"
                                     clearable
                                     :trigger-on-focus="false"
                                     :fetch-suggestions="autoCompSug_tag"
                                     onfocus="this.select()">
                        <template #default="{ item }">
                            <AutoCompleteSuggestion :item="item"></AutoCompleteSuggestion>
                        </template>
                    </el-autocomplete>
                </div>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary"
                               @click="">
                        {{ $t('opr.search') }}
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div> -->
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'

</script>

<style scoped></style>