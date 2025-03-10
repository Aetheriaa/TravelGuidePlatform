<template>
    <div class="message-detail">
      <h2>与 {{ otherUser.username }} 的私信</h2>
  
      <el-skeleton :loading="loading" :rows="8" animated>
        <template #default>
          <el-empty v-if="messages.length === 0" description="暂无私信" />
  
          <div class="message-list">
            <div v-for="message in messages" :key="message.id" class="message-item" :class="messageClass(message)">
              <el-avatar :src="message.senderAvatar || defaultAvatar" :size="40" class="avatar" />
              <div class="message-bubble">
                <div class="message-sender">{{ message.senderName }}</div>
                <div class="message-content">{{ message.content }}</div>
                <div class="message-timestamp">{{ formatDate(message.sendTime) }}</div>
              </div>
              <el-popconfirm
                v-if="message.senderId === currentUserId"
                title="确定删除这条私信吗？"
                @confirm="handleDelete(message.id)"
              >
                <template #reference>
                  <el-button type="text" size="small" style="margin-left: 10px;">
                    删除
                  </el-button>
                </template>
              </el-popconfirm>
            </div>
          </div>
        </template>
      </el-skeleton>
  
      <MessageForm :receiver-id="otherUser.id" @message-sent="fetchMessages" />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import { getConversation, deleteMessage } from '@/api/message';
  import { useRoute } from 'vue-router';
  import { formatDate } from '@/utils/date';
  import MessageForm from './MessageForm.vue';
  import { useUserStore } from '@/stores/user';
  import { ElMessage, ElSkeleton, ElEmpty, ElAvatar, ElPopconfirm, ElButton } from 'element-plus';
  import defaultAvatar from '@/assets/default_avatar.jpg';
  import { getUserInfoById } from '@/api/user';
  
  const route = useRoute();
  const otherUser = ref({});
  const messages = ref([]);
  const loading = ref(true);
  const userStore = useUserStore();
  const currentUserId = computed(() => userStore.currentUser?.id);
  
  onMounted(() => {
    otherUser.value.id = parseInt(route.params.userId);
    getUserInfoById(otherUser.value.id)
      .then(response => {
        otherUser.value = response.data.data;
        fetchMessages();
      })
      .catch(error => {
        console.error("Error fetching user info:", error);
        ElMessage.error("获取对方信息失败");
      });
  });
  
  const fetchMessages = () => {
      loading.value = true;
    getConversation(otherUser.value.id)
      .then(response => {
        messages.value = response.data.data;
      })
      .catch(error => {
        console.error("Error fetching messages:", error);
        ElMessage.error('获取私信失败');
      })
      .finally(()=> {
          loading.value = false;
      });
  };
  
  const messageClass = (message) => ({
    'message-sent': message.senderId === currentUserId.value,
    'message-received': message.senderId !== currentUserId.value
  });
  
  const handleDelete = (messageId) => {
    deleteMessage(messageId)
      .then(() => {
        ElMessage.success("删除成功");
        fetchMessages(); // 删除后重新获取消息列表
      })
      .catch(err => {
        console.error("Error deleting message:", err);
        ElMessage.error("删除失败");
      });
  };
  </script>
  
  <style scoped>
  .message-detail {
    padding: 20px;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 120px); /* 假设头部和底部固定高度共 120px */
  
  }
  
  .message-list {
    flex-grow: 1;
    overflow-y: auto; /* 允许消息列表滚动 */
    margin-bottom: 20px;
    padding-bottom: 20px;
    padding-right: 10px;
  }
  .message-item {
      margin-bottom: 15px;
      display: flex;
  }
  
  .message-sent {
      flex-direction: row-reverse; /* 自己发送的消息靠右 */
      justify-content: flex-start; /* 让元素靠右对齐 */
  }
  .message-sent .message-bubble{
      background-color: #DCF8C6;
      color: #000000;
      border-radius: 15px 15px 0 15px;/* 左下角不变 */
  }
  .message-sent .avatar{
      margin-left: 10px;
      margin-right: 0;
  }
  .message-received .message-bubble{
      background-color: #ffffff;
      border: 1px solid #e0e0e0;
      border-radius: 15px 15px 15px 0; /* 右下角不变 */
  }
  .message-received {
    /* 对方发送的消息靠左 */
  }
  .message-bubble {
      max-width: 70%;
      padding: 10px;
      word-wrap: break-word;
  }
  .message-sender{
      font-size: small;
      color: grey;
  }
  .message-timestamp{
      font-size: small;
      color: grey;
  }
  .avatar {
      margin-right: 10px;
  }
  </style>