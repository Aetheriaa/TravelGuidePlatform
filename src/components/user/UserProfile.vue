<template>
    <Header />
    <div v-if="user" class="user-profile-container">
        <div class="header">
            <img v-if="user.avatar" :src="user.avatar" alt="头像" class="avatar">
            <div class="info">
                <h2 class="username">{{ user.username }}</h2>
                <p class="nickname" v-if="user.nickname">昵称：{{ user.nickname }}</p>
            </div>
        </div>
        <div class="details">
            <p class="email" v-if="user.email">邮箱：{{ user.email }}</p>
            <p class="bio" v-if="user.bio">{{ user.bio }}</p>
        </div>

        <div class="actions" v-if="!isMe">
            <el-button :type="isFollowing ? 'info' : 'primary'" @click="toggleFollow" class="action-button">
                <el-icon :icon="isFollowing ? 'Remove' : 'Plus'" />
                {{ isFollowing ? '取消关注' : '关注' }}
            </el-button>
            <el-button type="primary" @click="goToMessage" class="action-button">
                <el-icon icon="ChatDotSquare" />
                私信
            </el-button>
        </div>
    </div>
    <div v-else class="loading">
        <el-icon icon="Loading" class="loading-icon" />
        <p> 加载中... </p>
    </div>
    <Footer />
</template>
<script setup>
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import { ref, onMounted, computed } from 'vue';
import { followUser, unfollowUser, checkFollowing, getUserInfo } from '@/api/user';
import { useUserStore } from '@/stores/user';
import { ElMessage } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import { getUserInfoById } from '../../api/user';
import {
    Plus,
    Remove,
    ChatDotSquare,
    Loading,
} from '@element-plus/icons-vue';

const route = useRoute();
const router = useRouter();
const user = ref(null);
const isFollowing = ref(false);
const userStore = useUserStore();

const isMe = computed(() => {
    return userStore.isLoggedIn && userStore.currentUser && userStore.currentUser.id === user.value?.id;
});

onMounted(async () => {
    try {
        const userId = parseInt(route.params.userId);
        const response = await getUserInfoById(userId);
        user.value = response.data.data;
        if (userStore.isLoggedIn) {
            await checkIsFollowing();
        }
    } catch (error) {
        console.error("Error fetching user profile:", error);
        ElMessage.error('加载失败');
    }
});

const checkIsFollowing = async () => {
    try {
        const response = await checkFollowing(user.value.id);
        isFollowing.value = response.data.data;
    } catch (error) {
        console.error('Error checking follow status:', error);
    }
};

const toggleFollow = async () => {
    if (!userStore.isLoggedIn) {
        ElMessage.warning('请先登录');
        return;
    }
    try {
        if (isFollowing.value) {
            await unfollowUser(user.value.id);
            ElMessage.success('已取消关注');
        } else {
            await followUser(user.value.id);
            ElMessage.success('关注成功');
        }
        isFollowing.value = !isFollowing.value;
    } catch (error) {
        console.error("Error toggling follow:", error);
        ElMessage.error("操作失败");
    }
};

const goToMessage = () => {
    if (!userStore.isLoggedIn) {
        ElMessage.warning('请先登录');
        router.push('/login');
        return;
    }
    router.push({ name: 'MessageDetail', params: { userId: user.value.id } });
};
</script>
<style scoped>
.user-profile-container {
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    max-width: 700px;
    margin: 15px auto;
}

.header {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    gap: 15px;
}

.avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #ddd;
}

.info {
    flex-grow: 1;
}

.username {
    font-size: 20px;
    font-weight: bold;
    color: #333;
    margin-bottom: 3px;
}

.nickname {
    color: #666;
    font-size: 14px;
}

.details {
    margin-bottom: 15px;
    color: #555;
}

.details p {
    line-height: 1.4;
    margin-bottom: 5px;
}

.actions {
    display: flex;
    gap: 8px;
}

.action-button {
    border-radius: 4px;
    padding: 8px 12px;
    font-size: 14px;
}

.loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 30px;
    color: #777;
}

.loading-icon {
    font-size: 24px;
    margin-bottom: 8px;
    animation: spin 2s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>