<template>
  <!-- 1. 添加 page-container 作为 Flex 容器 -->
  <div class="page-container">
    <Header />

    <!-- 2. 将 message-list 包裹在 main.main-content 中 -->
    <main class="main-content">
      <div class="message-list">
        <h2>私信列表</h2>
        <el-skeleton :loading="loading" :rows="5" animated>
          <template #default>
            <el-empty v-if="!loading && recentContacts.length === 0" description="暂无私信" />

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
                </div>
                 <!-- 将时间和未读标记放在一起，方便布局 -->
                <div class="meta-info">
                    <div class="timestamp">{{ formatDate(contact.sendTime) }}</div>
                    <el-badge v-if="!contact.isRead" :is-dot="true" class="unread-badge" />
                </div>
              </div>
            </el-card>
          </template>
        </el-skeleton>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import Header from '@/components/layout/Header.vue'; // 导入 Header
import Footer from '@/components/layout/Footer.vue'; // 导入 Footer
import { ref, onMounted, computed } from 'vue';
import { getRecentContacts } from '@/api/message';
import { formatDate } from '@/utils/date';
import defaultAvatar from '@/assets/default_avatar.jpg';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import { ElMessage, ElSkeleton, ElEmpty, ElCard, ElAvatar, ElBadge } from 'element-plus';

const recentContacts = ref([]);
const loading = ref(true);
const userStore = useUserStore();
const router = useRouter();
const currentUserId = computed(() => userStore.currentUser?.id);

onMounted(() => {
  if (currentUserId.value) { // 确保 currentUserId 有值再请求
      fetchRecentContacts();
  } else {
      // 可以选择显示错误消息或重定向到登录页
      ElMessage.warning('请先登录');
      loading.value = false; // 停止加载状态
  }
});

const fetchRecentContacts = () => {
  loading.value = true; // 开始请求前设置 loading
  getRecentContacts(currentUserId.value)
    .then(response => {
      recentContacts.value = response.data.data || []; // 确保有默认值
    })
    .catch(error => {
      console.error("Error fetching recent contacts:", error);
      ElMessage.error('获取私信列表失败');
      recentContacts.value = []; // 出错时清空
    })
    .finally(() => {
      loading.value = false;
    });
};

const goToMessageDetail = (contact) => {
  // 可以在跳转前将该联系人标记为已读（如果后端支持或在本地模拟）
  router.push({ name: 'MessageDetail', params: { userId: contact.otherUserId } });
};
</script>

<style scoped>
/* 3. 添加粘性页脚基础样式 */
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex-grow: 1;
}

/* 保留 message-list 的原有样式 */
.message-list {
  padding: 20px;
  max-width: 900px; /* 给列表一个最大宽度，并居中 */
  margin: 0 auto;   /* 左右自动边距实现居中 */
}

h2 {
    margin-bottom: 20px;
}

.contact-item {
  margin-bottom: 15px; /* 稍微增大卡片间距 */
  cursor: pointer;
  transition: all 0.2s ease-in-out; /* 平滑过渡 */
  border-radius: 8px; /* 添加圆角 */
}

.contact-item:hover {
  transform: translateY(-2px); /* 悬停时轻微上移 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* 悬停时阴影更明显 */
  /* background-color: #f0f9ff; */ /* 或者使用背景色变化 */
}

.contact-content {
  display: flex;
  align-items: center; /* 垂直居中对齐 */
}

.el-avatar {
    margin-right: 15px; /* 头像右边距 */
    flex-shrink: 0; /* 防止头像被压缩 */
}

.contact-info {
  flex-grow: 1;
  overflow: hidden; /* 防止内容溢出 */
  margin-right: 10px; /* 与右侧 meta-info 间距 */
}

.username {
  font-weight: 600; /* 稍粗字体 */
  margin-bottom: 4px;
  font-size: 16px;
}

.last-message {
  font-size: 14px;
  color: #555; /* 稍深一点的灰色 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  /* max-width: 250px;  移除固定宽度，让 flex 自动处理 */
}

.meta-info {
    display: flex;
    flex-direction: column; /* 时间和未读标记垂直排列 */
    align-items: flex-end;  /* 靠右对齐 */
    flex-shrink: 0;        /* 防止被压缩 */
    min-width: 80px;      /* 给一个最小宽度，防止时间戳换行 */
}

.timestamp {
  font-size: 12px;
  color: #999;
  margin-bottom: 5px; /* 与未读标记的间距 */
}

.unread-badge {
    /* .el-badge 本身是 inline-block，这里不需要额外样式 */
    line-height: 1; /* 确保小红点位置正确 */
}

/* 响应式设计调整 */
@media (max-width: 768px) {
  .message-list {
      padding: 15px;
      max-width: 100%; /* 小屏幕取消最大宽度 */
  }
  .username {
      font-size: 15px;
  }
  .last-message {
      /* 可以根据需要在小屏幕上调整 */
  }
   .meta-info {
       min-width: 70px;
   }
}
@media (max-width: 480px) {
    .el-avatar {
        width: 40px !important; /* 调整 Element Plus 组件大小 */
        height: 40px !important;
        line-height: 40px !important; /* 确保内部文字/图标居中 */
        font-size: 18px !important; /* 调整内部文字/图标大小 */
        margin-right: 10px;
    }
     .username {
        font-size: 14px;
     }
    .last-message {
        font-size: 13px;
    }
    .timestamp {
        font-size: 11px;
    }
    .meta-info {
        min-width: 60px;
    }
}

</style>