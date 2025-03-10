<template>
    <div class="message-form">
      <el-input
        type="textarea"
        :rows="4"
        v-model="messageContent"
        placeholder="输入私信内容..."
        resize="none"
         class="message-input"
      />
      <el-button type="primary" @click="submitMessage" :disabled="!messageContent.trim()" :loading="isSending">
        发送
      </el-button>
    </div>
  </template>
  
  <script setup>
  import { ref, defineProps, defineEmits } from 'vue';
  import { sendMessage } from '@/api/message';
  import { ElMessage, ElInput, ElButton } from 'element-plus';
  import { useRouter } from 'vue-router';
  
  const props = defineProps({
    receiverId: {
      type: Number,
      required: true
    }
  });
  
  const emit = defineEmits(['message-sent']);
  const router = useRouter();
  const messageContent = ref('');
  const isSending = ref(false); // 添加发送状态
  
  const submitMessage = () => {
    if (!messageContent.value.trim()) {
      return;
    }
  
    isSending.value = true; // 开始发送，显示 loading
  
    const messageData = {
      receiverId: props.receiverId,
      content: messageContent.value
    };
  
    sendMessage(messageData)
      .then(() => {
        ElMessage.success('私信发送成功');
        messageContent.value = '';
        emit('message-sent');
      })
      .catch(error => {
        console.error("Error sending message:", error);
        ElMessage.error('发送失败');
      })
      .finally(() => {
        isSending.value = false; // 发送结束，隐藏 loading
      });
  };
  </script>
  
  <style scoped>
  .message-form {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 10px;
    border-top: 1px solid #eee; /* 添加顶部边框 */
  }
  .message-input{
      flex-grow: 1;
  }
  </style>