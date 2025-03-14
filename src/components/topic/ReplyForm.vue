<template>
    <div class="reply-form">
        <el-input type="textarea" :rows="4" v-model="content" placeholder="发表评论..."></el-input>
        <el-button type="primary" @click="submitReply">回复</el-button>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import { createReply } from '@/api/reply'; // 导入 API
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';

const props = defineProps({
    topicId: {
        type: Number,
        required: true
    },
    parentReplyId: { // 可选，用于回复的回复
        type: Number,
        default: null
    }
});

const emit = defineEmits(['reply-created']); // 用于通知父组件回复已创建

const content = ref('');
const userStore = useUserStore()
const router = useRouter()
const submitReply = () => {
    if (!content.value.trim()) {
        ElMessage.warning('请输入回复内容');
        return;
    }
    // 检查用户是否登录
    if (!userStore.isLoggedIn) {
        ElMessage.warning('请先登录');
        router.push('/login'); // 可选
        return;
    }
    const replyData = {
        topicId: props.topicId,
        content: content.value,
        parentReplyId: props.parentReplyId // 如果是回复的回复，则传递 parentReplyId
    };

    createReply(replyData)
        .then(() => {
            ElMessage.success('回复成功');
            content.value = ''; // 清空输入框
            emit('reply-created'); // 触发事件，通知父组件刷新消息列表
        })
        .catch(error => {
            console.error("Error sending message:", error);
            ElMessage.error('发送失败')
        });
};
</script>

<style scoped>
/* 你可以根据需要添加样式 */
</style>