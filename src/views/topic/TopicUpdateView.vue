<template>
    <div class="topic-update-view">
        <h2>编辑主题</h2>
        <TopicForm :is-edit="true" :topic-data="topic" @submit="handleSubmit" @cancel="handleCancel" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import TopicForm from '@/components/topic/TopicForm.vue';
import { updateTopic, getTopicDetail } from '@/api/topic'; // 导入 API
import { ElMessage } from 'element-plus';

const router = useRouter();
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
            ElMessage.error("获取数据失败");
        });
};

const handleSubmit = (topicData) => {
    // 传入id
    topicData.id = parseInt(route.params.id)
    updateTopic(topicData)
        .then(() => {
            ElMessage.success('主题更新成功');
            router.push({ name: 'TopicList' }); // 更新成功后跳转到主题列表页
        })
        .catch(error => {
            console.error("Error updating topic:", error);
            ElMessage.error("更新失败");
        });
};

const handleCancel = () => {
    router.push({ name: 'TopicDetail', params: { id: route.params.id } }); // 取消编辑，返回主题详情页
};
</script>

<style scoped>
.topic-update-view {
    padding: 20px;
}
</style>