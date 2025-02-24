<template>
    <el-carousel :interval="4000" type="card" height="250px" :autoplay="true" arrow="always">
        <el-carousel-item v-for="item in banners" :key="item.id">
            <a :href="item.link" target="_blank">
                <img :src="item.imageUrl" :alt="item.title" class="banner-image">
            </a>
        </el-carousel-item>
    </el-carousel>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    banners: {
        type: Array,
        required: true
    }
});
</script>

<style scoped>
/* 设置轮播图容器的样式 */
.el-carousel {
    margin-bottom: 20px;
    /* 与下方内容隔开 */
}

/* 设置轮播图图片的样式 */
.banner-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    /* 重要：保持图片比例并填充容器 */
    display: block;
}
</style>