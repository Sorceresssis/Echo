<template>
    <div>
        <h1 class="fw-bold">{{ info.name }}</h1>
        <div>
            {{ info.recordCount }}
            {{ info.intro }}
            <p>
                <span class="inline-list-title">头像地址</span>
                <span> {{ info.avatar }} </span>
            </p>
            <p>
                <span class="inline-list-title">创建时间</span>
                <span> {{ info.createTime }} </span>

            </p>
            <p>
                <span class="inline-list-title">修改时间</span>
                {{ info.modifiedTime }}
            </p>
        </div>
    </div>
</template>

<script setup lang='ts'>
import LocalImage from '@/components/LocalImage.vue';

defineProps<{
    info: VO.AuthorDetail
}>()

</script>