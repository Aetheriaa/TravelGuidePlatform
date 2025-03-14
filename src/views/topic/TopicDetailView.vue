<template>
        <TopicDetail></TopicDetail>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getTopicDetail } from '@/api/topic'; // 导入 API
import { useRoute } from 'vue-router';
import TopicDetail from '@/components/topic/TopicDetail.vue';

const route = useRoute();
const topic = ref(null);

onMounted(() => {
    fetchTopicDetail();
});

const fetchTopicDetail = () => {
    getTopicDetail(route.params.id)
        .then(response => {
            topic.value = response.data.data; // 根据你的后端返回数据结构调整
            console.log(topic.value);
        })
        .catch(error => {
            console.error("Error fetching topic detail:", error);
        });
};
</script>

<style scoped>
.topic-detail-view {
    padding: 20px;
}

.topic-content {
    margin-top: 20px;
    /* 可以根据需要添加更多样式 */
}
</style>