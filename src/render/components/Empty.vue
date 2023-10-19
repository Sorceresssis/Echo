<template>
    <div class="empty">
        <div class="empty__text">
            <span> {{ title }} </span>
        </div>
    </div>
</template>

<script setup lang='ts'>

withDefaults(defineProps<{
    title?: string
}>(), {
    title: '还没有任何东西哦~'
})

</script>

<style>
.empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
}

.empty__text {
    font-size: 14px;
    color: #6d757a;
}
</style>