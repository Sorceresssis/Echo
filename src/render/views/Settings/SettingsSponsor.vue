<template>
    <div>
        <div class="dashboard__content scrollbar-y-w8">
            <div class="settings-item">
                <h2 class="settings-item__title">加个星</h2>
                <div class="settings-item__content">
                    <div class="row">
                        如果你觉得我的项目对你有帮助，请考虑给它一个星星！
                        <!-- If you find my project useful, please consider showing your love by giving it a star! -->
                        <a class="openExternal"
                           @click.prevent="openInBrowser(repositoryUrl)"> Github </a>
                    </div>
                </div>
            </div>
            <div class="settings-item">
                <h2 class="settings-item__title">经济支持</h2>
                <div class="settings-item__content flexRow">
                    <div class="row"> 中国 </div>
                    <div class="row">
                        <img class="col"
                             src="../../assets/images/wechat.png">
                        <img class="col"
                             src="../../assets/images/alipay.jpg">
                    </div>
                    <div class="row"> 其他 </div>
                    <div class="row">
                        <a @click.prevent="openInBrowser(paypalUrl)"
                           class="openExternal col">
                            Paypal
                        </a>
                        <a @click.prevent="openInBrowser(patreonUrl)"
                           class="openExternal col">
                            Patreon
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { openInBrowser } from '@/util/systemUtil'

const repositoryUrl = "https://github.com/Sorceresssis/echo"
const paypalUrl = "https://www.paypal.me/FoxFairy"
const patreonUrl = "https://patreon.com/Sorceresssis"
</script>

<style scoped></style>