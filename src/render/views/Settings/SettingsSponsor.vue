<template>
    <div class="flex-col">
        <div class="dashboard__content scrollbar-y-w8">
            <div class="settings-item">
                <h2 class="settings-item__title">{{ $t('settings.addStar') }}</h2>
                <div class="settings-item__content">
                    <div class="row">
                        {{ $t('settings.addStarTips') }}
                        <a class="openExternal"
                           @click.prevent="openInBrowser(repositoryUrl)"> Github </a>
                    </div>
                </div>
            </div>
            <div class="settings-item">
                <h2 class="settings-item__title">{{ $t('settings.support') }}</h2>
                <div class="settings-item__content flexRow">
                    <div class="row">{{ $t('settings.china') }}</div>
                    <div class="row">
                        <img class="col"
                             src="../../assets/images/wechat.png">
                        <img class="col"
                             src="../../assets/images/alipay.jpg">
                    </div>
                    <div class="row">{{ $t('settings.other') }}</div>
                    <div class="row">
                        <a @click.prevent="openInBrowser(paypalUrl)"
                           class="openExternal col"> Paypal </a>
                        <a @click.prevent="openInBrowser(patreonUrl)"
                           class="openExternal col"> Patreon </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { $t } from '@/locale'
import { openInBrowser } from '@/util/systemUtil'

const repositoryUrl = "https://github.com/Sorceresssis/echo"
const paypalUrl = "https://www.paypal.me/FoxFairy"
const patreonUrl = "https://www.patreon.com/Sorceresssis/membership"
</script>