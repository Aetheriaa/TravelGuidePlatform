<template>
    <Header />
    <div class="topic-create-view">
        <TopicForm @submit="handleSubmit" @cancel="handleCancel" />
    </div>
    <Footer />
</template>

<script setup>
import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';
import { useRouter } from 'vue-router';
import TopicForm from '@/components/topic/TopicForm.vue'; // 导入 TopicForm 组件
import { createTopic } from '@/api/topic';
import { ElMessage } from 'element-plus';

const router = useRouter();

const handleSubmit = (topicData) => {
    createTopic(topicData)
        .then(() => {
            ElMessage.success('主题发布成功');
            router.push({ name: 'TopicList' }); // 发布成功后跳转到主题列表页
        })
        .catch(error => {
            console.error("Error creating topic:", error);
            ElMessage.error('发布失败');
        });
};

const handleCancel = () => {
    router.push({ name: 'TopicList' }); // 取消发布，返回主题列表页
};
</script>

<style scoped>
.topic-create-view {
    padding: 20px;
}
</style>