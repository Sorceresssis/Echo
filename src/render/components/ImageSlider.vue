<template>
    <div class="work_slider_container">
        <Carousel v-model="currentSlide"
            v-viewer="{ transition: false }"
            class="slider_body"
            :items-to-show="1"
            :mouseDrag="false">
            <Slide v-for="image in images"
                :key="image">
                <div class="carousel__item">
                    <local-image :src="image" />
                </div>
            </Slide>
            <template #addons>
                <navigation />
                <pagination />
            </template>
        </Carousel>
        <Carousel v-model="currentSlide"
            class="slider_controller"
            :items-to-show="4"
            snapAlign="center"
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
    import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
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

    .work_slider_container,
    .slider_body,
    .slider_controller {
        width: 100%;
    }

    .slider_body {
        border: 1px solid #EEEEEE;
        box-sizing: border-box;
    }

    .slider_body .carousel__item {
        width: 100%;
        height: 280px;
        cursor: zoom-in
    }

    .slider_body .carousel__item img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: center;
    }

    .slider_body :deep(.carousel__pagination) {
        position: absolute;
        bottom: 8px;
        width: 100%;
        margin: 0;
    }

    .slider_body :deep(.carousel__pagination-button::after) {
        width: 15px;
        height: 2px;
    }

    .slider_controller {
        background-color: #EEEEEE;
        padding: 5px 0;
    }

    .slider_controller .carousel__item {
        width: 100%;
        height: 100px;
        border: 1px solid #eee;
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