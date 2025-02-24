<template>
    <div class="latest-guides-section">
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
.latest-guides-section {
    padding: 20px;
    /* 可以添加不同的样式 */
}
</style>