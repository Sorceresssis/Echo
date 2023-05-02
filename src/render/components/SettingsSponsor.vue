<template>
    <div>
        <div class="setting-item">
            <div class="setting-item__title">联系方式</div>
            <div class="setting-item__content">
                <div>Email: sorceresssis@gmail.com</div>
            </div>
        </div>
        <div class="setting-item">
            <div class="setting-item__title">GitHub Star</div>
            <div class="setting-item__content">
                If you find my project useful, please consider showing your love by giving it a
                star!
                <div>
                    <a @click.prevent="openUrlExternal('https://github.com/Sorceresssis/echo')"
                       rel="noopener noreferrer"
                       class="externalUrl">
                        to github
                    </a>
                </div>
            </div>
        </div>
        <div class="setting-item">
            <div class="setting-item__title">经济支持(中国)</div>
            <div class="setting-item__content flexRow">
                <div>
                    <div>微信</div>
                    <div class="marginTop10">
                        <img src="../assets/images/wechat.png">
                    </div>
                </div>
                <div>
                    <div>支付宝</div>
                    <div class="marginTop10">
                        <img src="../assets/images/alipay.jpg">
                    </div>
                </div>
            </div>
        </div>
        <div class="setting-item">
            <div class="setting-item__title">经济支持(非中国)</div>
            <div class="setting-item__content">
                <div>
                    <div>
                        paypal
                    </div>
                    <div class="marginTop10">
                        <a @click.prevent="openUrlExternal('https://www.paypal.com/FoxFairy')"
                           class="externalUrl">
                            www.paypal.com/FoxFairy
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { openUrlExternal } from '../util/externalOperation';
</script>

<style scoped>
img {
    width: 150px;
}
</style>