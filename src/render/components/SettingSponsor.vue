<template>
    <div>
        <div class="sponsorItem">
            If you find my project useful, please consider showing your love by giving it a
            star!
        </div>
        <div class="sponsorItem">
            <a href="https://github.com/Sorceresssis/echo"
               target="_blank"
               rel="noopener noreferrer">⭐to github⭐</a>
        </div>
        <div class="sponsorItem">
            <div>
                <div class="sponsor__title"> 微信</div>
                <img style="width: 200px;"
                     src="../assets/images/wechat.png"
                     alt="">
            </div>
            <div>
                <div class="sponsor__title">支付宝</div>
                <img style="width: 200px;"
                     src="../assets/images/alipay.jpg"
                     alt="">
            </div>
        </div>
        <div class="sponsorItem">
            <div>
                <div class="sponsor__title">paypal</div>
                <a href="www.paypal.com/FoxFairy"
                   target="_blank">www.paypal.com/FoxFairy</a>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>

</script>

<style scoped>
.sponsorItem {
    display: flex;
    margin-bottom: 20px;
    justify-content: left;
}

.sponsorItem>div {
    margin-right: 50px;
}

a {
    color: #000;
    text-decoration: none;
}

a:hover {
    color: #409eff;
}

.sponsor__title {
    margin: 8px 0;
}
</style>