<template>
    <div v-if="user" class="user-profile">
        <!-- 用户信息 -->
        <h2>{{ user.username }} 的个人主页</h2>
        <p>邮箱：{{ user.email }}</p>
        <p>昵称：{{ user.nickname }}</p>
        <img v-if="user.avatar" :src="user.avatar" alt="头像" width="100">
        <p>{{ user.bio }}</p>

        <!-- 关注/取消关注按钮 -->
        <el-button v-if="!isMe" :type="isFollowing ? 'info' : 'primary'" @click="toggleFollow">
            {{ isFollowing ? '取消关注' : '关注' }}
        </el-button>
        <el-button v-if="!isMe" type="primary" @click="goToMessage">
            私信
        </el-button>
    </div>
    <div v-else>
        <p> 加载中... </p>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, useId } from 'vue';
import { followUser, unfollowUser, checkFollowing, getUserInfo } from '@/api/user'; // 导入 API
import { useUserStore } from '@/stores/user';
import { ElMessage } from 'element-plus';
import { useRoute } from 'vue-router';
import { getUserInfoById } from '../../api/user';
import { useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const user = ref(null); // 用于存储用户信息
const isFollowing = ref(false); // 是否已关注
const userStore = useUserStore(); // 如果你需要获取当前登录用户信息

// 计算属性：判断当前用户是否是正在查看的用户
const isMe = computed(() => {
    return userStore.isLoggedIn && userStore.currentUser && userStore.currentUser.id === user.value?.id;
});

onMounted(async () => {
    // 1. 获取要显示的用户的信息
    try {
        const userId = parseInt(route.params.userId); // 从路由参数中获取 userId
        // console.log(userId)
        const response = await getUserInfoById(userId); // 调用 API 获取用户信息
        user.value = response.data.data; // 将获取到的用户信息赋值给 user
        // 2. 检查是否已关注 (如果已登录)
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

// 关注/取消关注
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
        isFollowing.value = !isFollowing.value; // 更新关注状态
    } catch (error) {
        console.error("Error toggling follow:", error);
        ElMessage.error("操作失败");
    }
};

// 跳转到私信页面
const goToMessage = () => {
    // 检查是否登录
    if (!userStore.isLoggedIn) {
        ElMessage.warning('请先登录');
        router.push('/login'); // 跳转到登录页面, 可选
        return;
    }
    router.push({ name: 'MessageDetail', params: { userId: user.value.id } });
};

</script>

<style scoped>
/* 添加样式 */
</style>