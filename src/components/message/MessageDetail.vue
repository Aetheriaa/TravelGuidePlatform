<template>
    <div class="message-detail">
        <h2>与 {{ otherUser.username }} 的私信</h2>
        <div class="message-list">
            <div v-for="message in messages" :key="message.id" :class="messageClass(message)">
                <div class="message-content">
                    <img :src="message.senderAvatar || defaultAvatar" class="avatar">
                    <span>{{ message.senderName }}:</span>
                    {{ message.content }}
                </div>
                <div class="timestamp">{{ formatDate(message.sendTime) }}</div>
                <!-- 删除按钮 (只有发送者才能删除) -->
                <el-button v-if="message.senderId === currentUserId" type="text" size="small"
                    @click="handleDelete(message.id)">
                    删除
                </el-button>
            </div>
        </div>
        <MessageForm :receiver-id="otherUser.id" @message-sent="fetchMessages" />
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { getConversation, deleteMessage } from '@/api/message';
import { useRoute } from 'vue-router';
import { formatDate } from '@/utils/date';
import MessageForm from './MessageForm.vue'; // 导入发送私信的表单组件
import { useUserStore } from '@/stores/user';
import { ElMessage } from 'element-plus';
import defaultAvatar from '@/assets/default_avatar.jpg'; // 导入默认头像
import { getUserInfoById } from '@/api/user'

const route = useRoute();
const otherUser = ref({}); // 对话的用户信息
const messages = ref([]);
const loading = ref(true);
const userStore = useUserStore();
const currentUserId = computed(() => userStore.currentUser?.id);  //计算属性

onMounted(() => {
    // 根据路由参数获取对方用户的 ID
    otherUser.value.id = parseInt(route.params.userId);
    getUserInfoById(otherUser.value.id)
        .then(response => {
            otherUser.value = response.data.data; // 假设后端返回 { data: { username: '...', ... } }
            // console.log(otherUser.value);
            // 获取到用户信息后，再获取私信
            fetchMessages();
            
        })
        .catch(error => {
            console.error("Error fetching user info:", error);
            ElMessage.error("获取对方信息失败")
            // 可以显示错误信息或设置默认值
            // otherUser.value.username = '未知用户';
        });

});

const fetchMessages = () => {
    loading.value = true
    getConversation(otherUser.value.id)
        .then(response => {
            messages.value = response.data.data;
            // console.log(messages.value);
        })
        .catch(error => {
            console.error("Error fetching messages:", error);
            ElMessage.error('获取私信失败');
        }).finally(() => {
            loading.value = false
        });
};

// 计算属性：根据消息的发送者ID，判断消息是自己发送的还是对方发送的
const messageClass = (message) => {
    return {
        'message-sent': message.senderId === currentUserId.value, // 自己发送的消息
        'message-received': message.senderId !== currentUserId.value // 对方发送的消息
    };
};

const handleDelete = (messageId) => {
    deleteMessage(messageId).then(res => {
        ElMessage.success("删除成功")
        fetchMessages()
    }).catch(err => {
        console.log(err);
        ElMessage.error("删除失败")
    })
}
</script>

<style scoped>
.message-detail {
    padding: 20px;
}

.message-list {
    margin-bottom: 20px;
    /* 对话气泡样式 */
}

.avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 10px;
}

.message-content {
    display: flex;
    margin-bottom: 5px;
}

.message-sent {
    /* 自己发送的消息的样式 */
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-bottom: 10px;
}

.message-sent .message-content {
    background-color: #DCF8C6;
    /* 浅绿色背景 */
    color: #333;
    padding: 10px;
    border-radius: 10px;
    max-width: 70%;
    /* 防止消息过长 */
    word-wrap: break-word;
    /* 自动换行 */
}

.message-received {
    /* 对方发送的消息的样式 */
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 10px;
}

.message-received .message-content {
    background-color: #fff;
    border: 1px solid #eee;
    color: #333;
    padding: 10px;
    border-radius: 10px;
    max-width: 70%;
    /* 防止消息过长 */
    word-wrap: break-word;
    /* 自动换行 */
}

.timestamp {
    font-size: 12px;
    color: #999;
}
</style>