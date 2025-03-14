<template>
    <div class="topic-item">
        <router-link :to="{ name: 'TopicDetail', params: { id: topic.id } }">
            <h3>{{ topic.title }}</h3>
        </router-link>
        <p>作者: {{ topic.username }}</p>
        <p>发布时间: {{ formatDate(topic.createTime) }}</p>
        <p>回复数: {{ topic.replyCount }}</p>
        <!-- 其他信息，例如最后回复时间、最后回复用户等 -->
    </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { formatDate } from '@/utils/date'; // 假设你有一个 formatDate 函数

const props = defineProps({
    topic: {
        type: Object,
        required: true
    }
});
</script>

<style scoped>
/* 添加样式 */
</style>