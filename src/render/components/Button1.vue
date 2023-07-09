<template>
    <div class="button-1">
        <span>
            <slot></slot>
        </span>
    </div>
</template>

<script setup lang='ts'>
</script>

<style scoped>
.button-1 {
    min-width: 18px;
    height: 18px;
    padding: 4px;
    border-radius: 4px;
    border: 2px solid #dedee0;
    line-height: 18px;
    background-color: #fff;
    cursor: pointer;
    text-align: center;
}

.button-1:hover {
    background-color: #f5f5f5;
}

.button-1 span {
    display: inline-block;
}

.button-1:active {
    background-color: #d9d9d9;
}

.button-1:active span {
    transform: translate(0px, .5px);
}
</style>