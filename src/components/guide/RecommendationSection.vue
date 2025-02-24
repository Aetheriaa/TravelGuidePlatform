<template>
    <div class="recommendation-section">
        <el-row :gutter="20">
            <el-col :span="8" v-for="guide in guides" :key="guide.id">
                <GuideCard :guide="guide" />
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';
import GuideCard from './GuideCard.vue';

const props = defineProps({
    guides: {
        type: Array,
        required: true
    }
});
</script>

<style scoped>
.recommendation-section {
    padding: 20px;
    background-color: #f9f9f9;
    /* 添加背景颜色 */
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    /* 添加阴影 */
}

/* 可以根据需要添加更多样式 */
</style>