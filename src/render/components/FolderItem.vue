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
    </div>
</template>

<script setup lang='ts'>

</script>

<style scoped>
.folderWrapper {
    cursor: pointer;
}

.folder {
    position: relative;
}

.folder:hover {}

.folder .front,
.folder .center,
.folder .back {
    position: absolute;
    border-radius: 2px;
    box-shadow:
        0.9px 1.1px 3.9px rgba(0, 0, 0, 0.007),
        1.9px 2.2px 7.4px rgba(0, 0, 0, 0.018),
        3px 3.6px 10.3px rgba(0, 0, 0, 0.032),
        4.4px 5.3px 12.6px rgba(0, 0, 0, 0.047),
        6.7px 8px 15.3px rgba(0, 0, 0, 0.061),
        10px 12px 20px rgba(0, 0, 0, 0.07);
}

.folder .front {
    /* width: 213px;
    height: 158px; */
    width: 180px;
    height: 134px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: linear-gradient(to bottom, #767575 0%, #5b5a5a 50%, #393939 100%);
    z-index: 3;
}

.folder .center {
    /* width: 213px;
    height: 136px; */
    width: 180px;
    height: 114px;

    background-color: #fff;
    top: 11px;
    left: 10px;
    z-index: 2;
}

.folder .back {
    /* width: 213px;
    height: 114px; */
    width: 180px;
    height: 96px;

    background-color: #fff;
    top: 22px;
    left: 20px;
    z-index: 1;
}
</style>