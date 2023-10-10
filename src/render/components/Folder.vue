<template>
    <div class="folderWrapper">
        <div class="folder">
            <div class="front"></div>
            <div class="center"></div>
            <div class="back"></div>
        </div>
        <div class="folderName">
            <span>工作/学习</span>
        </div>
        <div class="folderTime">
            <span>2021/07/17 10:49</span>
        </div>
    </div>
</template>

<script setup lang='ts'>

</script>

<style scoped>
.folder {
    width: 110px;
    height: 80px;
    perspective: 600px;
    transform-style: preserve-3d;
    cursor: pointer;
}

.folderWrapper {
    padding: 20px 20px 10px 20px;
    position: relative;
    transition: all .2s ease;
    border-radius: 6px;
    cursor: pointer;
}

.folderWrapper:hover {
    background-color: #ffffff;
}

.folder div.back,
.folder div.front {
    position: absolute;
    top: 0;
    left: 0;
    width: 110px;
    height: 80px;
    background-color: #c5b7f1;
}

.folder div.center {
    width: 90px;
    height: 60px;
    background-color: #ffffff;
    position: absolute;
    top: 5px;
    left: 10px;
    z-index: 2;
    border-radius: 6px;
}

.folder .front {
    background-image: linear-gradient(to left, #24d5ff 0%, #1eb2ff 45%, #1890ff 100%);
    border-radius: 6px;
    z-index: 3;
    /* 若想把文件夹名字放到文件夹上面，则需要以下属性
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        color: rgba(0,0,0,1);
        font-weight: 500;
        line-height: 16px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;*/
    box-shadow: 0 1px rgba(255, 255, 255, 0.25) inset, 0 -2px 2px rgba(0, 0, 0, 0.1);
    transform: rotateX(-30deg);
    transform-origin: bottom;
    transition: all .2s ease;
}

.folder:hover .front {
    transform: rotateX(-40deg);
}

.folder .back:before {
    content: " ";
    position: absolute;
    left: 0;
    top: -10px;
    width: 40px;
    height: 10px;
    border-radius: 6px 6px 0 0;
    background-color: #1eb2ff;
}

.folder .back {
    background-image: linear-gradient(to top, #24d5ff 0%, #1eb2ff 45%, #1eb2ff 100%);
    border-radius: 0 6px 6px 6px;
    box-shadow: 0 -1px 1px rgba(0, 0, 0, 0.15);
}

.folderName {
    margin-top: 10px;
    font-size: 14px;
    font-weight: 500;
    color: rgb(37, 48, 43);
}

.folderTime {
    width: 100%;
    text-align: center;
    font-size: 12px;
    line-height: 1.6;
    color: rgba(37, 48, 43, .36);
    max-width: 100%;
    overflow: hidden;
    white-space: nowrap;
    -o-text-overflow: ellipsis;
    text-overflow: ellipsis;
}
</style>