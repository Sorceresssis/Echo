<template>
    <div id="Items">
        <div class="item">1</div>
        <div class="item">2</div>
        <div class="item">3</div>
        <div class="item">4</div>
        <div class="item">5</div>
        <div class="item">6</div>
        <div class="item">7</div>
        <div class="item">8</div>
        <div class="item">9</div>
        <div class="item">10</div>
        <div class="item">11</div>
        <div class="item">12</div>
        <div class="item">13</div>
        <div class="item">14</div>
        <div class="item">14</div>
        <div class="item">14</div>
        <div class="item">14</div>
        <div class="item">14</div>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'

</script>

<style scoped>
#Items {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-content: flex-start;
    align-items: center;
    overflow-y: auto;
}

#Items::-webkit-scrollbar {
    width: 10px;
    background-color: transparent;
}

#Items::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background-color: #cfcfcf;
}

.item {
    width: 180px;
    height: 150px;
    margin: 10px;
    background-color: pink;
    cursor: pointer;
}
</style>