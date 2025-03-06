<template>
    <div class="message-list">
        <h2>私信列表</h2>
        <div v-if="loading">加载中...</div>
        <div v-else-if="recentContacts.length > 0">
            <div v-for="contact in recentContacts" :key="contact.otherUserId" class="contact-item">
                <router-link :to="{ name: 'MessageDetail', params: { userId: contact.otherUserId } }">
                    <img :src="contact.otherUserAvatar || defaultAvatar" alt="头像" class="avatar">
                    <div class="contact-info">
                        <div class="username">{{ contact.otherUsername }}</div>
                        <div class="last-message">
                            {{ contact.content }}
                        </div>
                        <div class="timestamp">{{ formatDate(contact.sendTime) }}</div>
                    </div>
                    <div v-if="!contact.isRead" class="unread-badge">未读</div>
                </router-link>
            </div>
        </div>
        <div v-else>
            <p>暂无私信</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { getRecentContacts } from '@/api/message'; // 导入 API
import { formatDate } from '@/utils/date'; // 导入日期格式化函数
import defaultAvatar from '@/assets/default_avatar.jpg'; // 导入默认头像
import { useUserStore } from '@/stores/user'
const recentContacts = ref([]);
const loading = ref(true);
const userStore = useUserStore();
const currentUserId = computed(() => userStore.currentUser?.id);  //计算属性


onMounted(() => {
    fetchRecentContacts();
});

const fetchRecentContacts = () => {
    getRecentContacts(currentUserId)
        .then(response => {
            recentContacts.value = response.data.data;
            console.log(recentContacts.value);
        })
        .catch(error => {
            console.error("Error fetching recent contacts:", error);
        })
        .finally(() => {
            loading.value = false;
        });
};
</script>

<style scoped>
/* 添加样式 */
.message-list {
    padding: 20px;
}

.contact-item {
    display: flex;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
    text-decoration: none;
    color: inherit;
    /* 移除 router-link 的默认样式 */
}

.contact-item:hover {
    background-color: #f5f5f5;
}

.avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
}

.contact-info {
    flex-grow: 1;
}

.username {
    font-weight: bold;
    margin-bottom: 5px;
}

.last-message {
    font-size: 14px;
    color: #999;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
    /* 或者你希望的最大宽度 */
}

.timestamp {
    font-size: 12px;
    color: #999;
}

.unread-badge {
    background-color: red;
    color: white;
    border-radius: 50%;
    width: 10px;
    height: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
}
</style>