<template>
    <button class="button1"
            type="button">
        <span>
            <slot></slot>
        </span>
    </button>
</template>

<script setup lang='ts'></script>

<style>
.button1 {
    min-width: 28px;
    height: 28px;
    border-radius: 4px;
    border: 1.6px solid #dedee0;
    background-color: #fff;
    cursor: pointer;
    box-sizing: border-box;
    user-select: none;
}

.button1 .iconfont {
    font-size: 14px;
}

.button1:hover {
    background-color: #f5f5f5;
}

.button1 span {
    display: inline-block;
}

.button1:active {
    background-color: #d9d9d9;
}

.button1:active span {
    transform: translate(0, .5px);
}
</style>