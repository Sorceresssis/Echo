<template>
    <div class="work_slider_container">
        <Carousel v-model="currentSlide"
            v-viewer="{ transition: false }"
            class="slider_body"
            :items-to-show="1"
            :mouseDrag="false"
            wrap-around>
            <Slide v-for="image in images"
                :key="image">
                <div class="carousel__item">
                    <local-image :src="image" />
                </div>
            </Slide>
            <template #addons>
                <navigation />
            </template>
        </Carousel>
        <Carousel v-model="currentSlide"
            class="slider_controller"
            :items-to-show="4"
            :itemsToScroll="4"
            snapAlign="start"
            wrap-around>
            <Slide v-for="(image, index) in images"
                :key="image">
                <div class="carousel__item"
                    @click="slideTo(index)">
                    <local-image :src="image" />
                </div>
            </Slide>
            <template #addons>
                <navigation />
            </template>
        </Carousel>
    </div>
</template>

<script setup
    lang='ts'>
    import { ref } from 'vue';
    import 'vue3-carousel/dist/carousel.css'
    import { Carousel, Slide, Navigation } from 'vue3-carousel'
    import LocalImage from './LocalImage.vue';

    defineProps<{
        images: string[]
    }>()

    const currentSlide = ref(0)

    const slideTo = (index: number) => {
        currentSlide.value = index
    }
</script>

<style scoped>

    .work_slider_container {
        width: 100%;
    }

    .slider_body .carousel__item {
        width: 100%;
        height: 280px;
        cursor: zoom-in;
    }

    .slider_body .carousel__item img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: center;
    }

    .slider_controller {
        background-color: #eeeeee;
        padding: 5px 0;
    }

    .slider_controller .carousel__item {
        width: 100%;
        height: 100px;
        border: 1px solid #eeeeee;
        margin: 0 2.5px;
        cursor: pointer;
    }

    .slider_controller .carousel__item img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
    }

    .slider_controller .carousel__item:hover {
        border: 2px solid var(--echo-theme-color);
    }
</style>