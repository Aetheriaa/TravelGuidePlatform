<template>
  <Header />
    <div class="message-list">
      <h2>私信列表</h2>
      <el-skeleton :loading="loading" :rows="5" animated>
        <template #default>
          <el-empty v-if="recentContacts.length === 0" description="暂无私信" />
  
          <el-card
            v-for="contact in recentContacts"
            :key="contact.otherUserId"
            class="contact-item"
            shadow="hover"
            @click="goToMessageDetail(contact)"
          >
            <div class="contact-content">
              <el-avatar :src="contact.otherUserAvatar || defaultAvatar" :size="50" />
              <div class="contact-info">
                <div class="username">{{ contact.otherUsername }}</div>
                <div class="last-message">{{ contact.content }}</div>
                <div class="timestamp">{{ formatDate(contact.sendTime) }}</div>
              </div>
              <el-badge v-if="!contact.isRead" :is-dot="true" class="unread-badge" />
            </div>
          </el-card>
        </template>
      </el-skeleton>
    </div>
  <Footer />  
</template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import { getRecentContacts } from '@/api/message';
  import { formatDate } from '@/utils/date';
  import defaultAvatar from '@/assets/default_avatar.jpg';
  import { useUserStore } from '@/stores/user';
  import { useRouter } from 'vue-router';
  import { ElMessage, ElSkeleton, ElEmpty, ElCard, ElAvatar, ElBadge } from 'element-plus'; // 引入 Element Plus 组件
  
  const recentContacts = ref([]);
  const loading = ref(true);
  const userStore = useUserStore();
  const router = useRouter();
  const currentUserId = computed(() => userStore.currentUser?.id);
  
  onMounted(() => {
    fetchRecentContacts();
  });
  
  const fetchRecentContacts = () => {
    getRecentContacts(currentUserId.value)  //直接 .value
      .then(response => {
        recentContacts.value = response.data.data;
      })
      .catch(error => {
        console.error("Error fetching recent contacts:", error);
        ElMessage.error('获取私信列表失败');
      })
      .finally(() => {
        loading.value = false;
      });
  };
  
  const goToMessageDetail = (contact) => {
    router.push({ name: 'MessageDetail', params: { userId: contact.otherUserId } });
  };
  </script>
  
  <style scoped>
  .message-list {
    padding: 20px;
  }
  
  .contact-item {
    margin-bottom: 10px;
    cursor: pointer;
    transition: background-color 0.2s; /* 添加过渡效果 */
  }
  
  .contact-item:hover {
    background-color: #f0f9ff; /* 鼠标悬停时背景颜色 */
  }
  
  .contact-content {
    display: flex;
    align-items: center;
  }
  
  .contact-info {
    flex-grow: 1;
    margin-left: 15px;
  }
  
  .username {
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .last-message {
    font-size: 14px;
    color: #666;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 250px; /* 限制最大宽度 */
  }
  
  .timestamp {
    font-size: 12px;
    color: #999;
  }
  
  .unread-badge {
      /*margin-left: auto;  让未读标记靠右 */
      align-self: flex-start; /* 未读标记垂直居顶 */
  }
  
  /* 响应式设计 */
  @media (max-width: 768px) {
    .last-message {
      max-width: 150px; /* 在小屏幕上进一步限制最大宽度 */
    }
  }
  </style>