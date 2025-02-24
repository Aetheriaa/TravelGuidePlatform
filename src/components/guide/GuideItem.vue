<template>
    <el-card class="guide-item">
        <router-link :to="{ name: 'GuideDetail', params: { id: guide.id } }">
            <img v-if="guide.coverImage" :src="guide.coverImage" class="cover-image" />
            <div class="title">{{ guide.title }}</div>
        </router-link>
        <div class="info">
            <span>创建时间：{{ formatDate(guide.createTime) }}</span>
            <span>浏览量：{{ guide.viewCount }}</span>
            <span>点赞数：{{ guide.likeCount }}</span>
        </div>
        <div class="content-summary">
            {{ guide.content.substring(0, 100) }}... <!-- 显示内容摘要 -->
        </div>

    </el-card>
</template>

<script setup>
import { defineProps } from 'vue';
import { formatDate } from '@/utils/date'
const props = defineProps({
    guide: {
        type: Object,
        required: true
    }
});
</script>

<style scoped>
.guide-item {
    margin-bottom: 20px;
}

.cover-image {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 5px;
}

.title {
    font-size: 18px;
    font-weight: bold;
    margin: 10px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.info {
    font-size: 12px;
    color: #999;
    margin-bottom: 10px;
}

.content-summary {
    font-size: 14px;
    color: #666;
    line-height: 1.5;
    /* 多行文本溢出显示省略号 */
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    /* number of lines to show */
    line-clamp: 3;
    -webkit-box-orient: vertical;
}
</style>