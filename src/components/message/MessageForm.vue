<template>
    <div class="message-form">
        <el-input type="textarea" :rows="4" v-model="messageContent" placeholder="输入私信内容..."></el-input>
        <el-button type="primary" @click="submitMessage" :disabled="!messageContent.trim()">发送</el-button>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import { sendMessage } from '@/api/message';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

const props = defineProps({
    receiverId: {
        type: Number,
        required: true
    }
});

const emit = defineEmits(['message-sent']); // 用于通知父组件消息已发送
const router = useRouter()
const messageContent = ref('');

const submitMessage = () => {
    if (!messageContent.value.trim()) {
        return; // 内容为空，不发送
    }

    const messageData = {
        receiverId: props.receiverId,
        content: messageContent.value
    };

    sendMessage(messageData)
        .then(() => {
            ElMessage.success('私信发送成功');
            messageContent.value = ''; // 清空输入框
            emit('message-sent'); // 触发事件，通知父组件刷新消息列表
        })
        .catch(error => {
            console.error("Error sending message:", error);
            ElMessage.error('发送失败')
        });
};
</script>

<style scoped>
/* 你可以根据需要添加样式 */
.message-form {
    display: flex;
    align-items: flex-start;
    /* 让输入框和按钮顶部对齐 */
    gap: 10px;
    /* 输入框和按钮之间的间距 */
}
</style>