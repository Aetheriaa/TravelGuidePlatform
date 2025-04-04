<template>
    <div v-if="user" class="user-info-page">
        <Header />
        <div class="user-info-container">
            <el-card class="user-info-card" shadow="hover">
                <div class="user-details">
                    <h2 class="user-info-title">
                        <!-- 使用 Element Plus 图标组件 -->
                        <el-icon :size="20" style="vertical-align: middle; margin-right: 8px;"><UserFilled /></el-icon> 个人信息
                    </h2>
                    <!-- 头像和基本信息 -->
                    <div class="user-avatar-container">
                        <el-avatar :size="120" :src="user.avatar || defaultAvatar" class="user-avatar">
                            <img :src="defaultAvatar" />
                        </el-avatar>
                    </div>

                    <el-descriptions class="user-descriptions" :column="1" border>
                        <el-descriptions-item label="用户名">
                            <span class="user-info-value">{{ user.username }}</span>
                        </el-descriptions-item>
                        <el-descriptions-item label="邮箱">
                            <span class="user-info-value">{{ user.email }}</span>
                        </el-descriptions-item>
                        <el-descriptions-item label="昵称">
                            <span class="user-info-value">{{
                                user.nickname || '未设置昵称'
                                }}</span>
                        </el-descriptions-item>
                        <!-- 其他用户信息 -->
                        <el-descriptions-item label="注册时间">
                            <span class="user-info-value">{{ formatDate(user.registrationTime) }}</span>
                        </el-descriptions-item>
                        <el-descriptions-item label="性别">
                            <span class="user-info-value">
                                <template v-if="user.gender === 'M'">男</template>
                                <template v-else-if="user.gender === 'F'">女</template>
                                <template v-else>未知</template>
                            </span>
                        </el-descriptions-item>
                        <el-descriptions-item label="描述">
                            <span class="user-info-value">{{ user.bio || '暂无描述' }}</span>
                        </el-descriptions-item>

                    </el-descriptions>
                    <!-- 新增：关注数和粉丝数 -->
                    <div class="user-stats">
                        <div class="stat-item">
                            <span>关注数：</span>
                             <!-- 确保路由名称正确 -->
                            <router-link :to="{ name: 'FollowingList', params: { userId: user.id } }">
                                <span class="stat-count">{{ followingCount }}</span>
                            </router-link>
                        </div>
                        <div class="stat-item">
                            <span>粉丝数：</span>
                             <!-- 确保路由名称正确 -->
                            <router-link :to="{ name: 'FollowerList', params: { userId: user.id } }">
                                <span class="stat-count">{{ followerCount }}</span>
                            </router-link>
                        </div>
                    </div>
                    <div class="user-actions">
                        <router-link to="/userupdate">
                             <!-- 修改这里：使用 :icon 绑定导入的 Edit 图标组件 -->
                            <el-button type="primary" :icon="Edit">修改信息</el-button>
                        </router-link>
                        <router-link to="/user/guide-history">
                            <el-button type="primary">浏览历史</el-button>
                        </router-link>
                        <router-link to="/user/liked-guides">
                            <el-button type="primary">点赞列表</el-button>
                        </router-link>
                        <router-link to="/user/favorite-guides">
                            <el-button type="primary">收藏列表</el-button>
                        </router-link>
                         <!-- 修改这里：使用 :icon 绑定导入的 Delete 图标组件 -->
                        <el-button type="danger" :icon="Delete" @click="handleDeleteAccount">注销账户</el-button>
                    </div>
                </div>

            </el-card>
        </div>
        <Footer />
    </div>
     <div v-else class="loading">
        <!-- 可以添加一个加载状态或提示 -->
        加载中...
    </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue';
import { useUserStore } from '@/stores/user';
import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';
import { ElMessageBox, ElMessage, ElIcon } from 'element-plus'; // 引入 ElIcon (如果标题图标也使用)
import defaultAvatar from '@/assets/default_avatar.jpg'
import { useRouter } from 'vue-router'
import { getFollowingCount, getFollowerCount } from '@/api/user'; // 假设 getUserInfoById 不再需要，因为 store 会处理

// --- 关键改动：导入 Element Plus 图标 ---
import { Edit, Delete, UserFilled } from '@element-plus/icons-vue';
// --------------------------------------

const userStore = useUserStore();
const router = useRouter();

const followingCount = ref(0); // 关注数
const followerCount = ref(0);  // 粉丝数

// 计算属性获取当前用户，更安全
const user = computed(() => userStore.currentUser);

onMounted(async () => {
    // 检查登录状态
    if (!userStore.isLoggedIn) {
        ElMessage.warning('请先登录');
        router.push('/login'); // 未登录就跳转到登录
        return; // 阻止后续代码执行
    }

    try {
        // 确保用户信息已获取 (如果store没有自动获取)
        if (!userStore.currentUser) {
             await userStore.fetchUserInfo(); // 等待用户信息获取完成
        }
        // 确保获取到用户信息后再获取关注/粉丝数
        if (userStore.currentUser && userStore.currentUser.id) {
            fetchFollowingCount(userStore.currentUser.id);
            fetchFollowerCount(userStore.currentUser.id);
        } else {
             // 处理获取用户信息失败或ID不存在的情况
             console.error("无法获取用户信息或用户ID");
             ElMessage.error("加载用户信息失败，请稍后重试");
             // 可以考虑跳转回登录页或显示错误信息
             // router.push('/login');
        }
    } catch (error) {
        console.error("Error during component mount:", error);
        ElMessage.error("页面加载失败，请稍后重试");
    }
});


//格式化时间
const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A'; // 处理空时间戳
    try {
        const date = new Date(timestamp);
         // 检查日期是否有效
         if (isNaN(date.getTime())) {
            return '无效日期';
        }
        // 使用更健壮的格式化，例如 YYYY-MM-DD
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始，需要+1，并补零
        const day = date.getDate().toString().padStart(2, '0'); // 补零
        return `${year}-${month}-${day}`;
        // 或者 return date.toLocaleDateString();
    } catch (e) {
        console.error("Error formatting date:", e);
        return "日期格式错误";
    }
};

const handleDeleteAccount = () => {
    ElMessageBox.confirm(
        '您确定要注销账户吗？此操作将永久删除您的所有数据且不可恢复。', // 更明确的警告
        '警告：注销账户', // 更清晰的标题
        {
            confirmButtonText: '确定注销',
            cancelButtonText: '取消',
            type: 'warning',
            dangerouslyUseHTMLString: true, // 如果消息内容包含 HTML
            center: true, // 居中显示
        }
    )
        .then(async () => { // 使用 async/await
            try {
                // 调用注销账户的 action/API
                await userStore.deleteAccount(); // 等待注销完成
                ElMessage({
                    type: 'success',
                    message: '账户已成功注销',
                });
                // 注销成功后跳转到首页或登录页
                router.push('/');
            } catch (error) {
                console.error("Delete account failed:", error);
                 ElMessage({
                    type: 'error',
                    message: '注销失败，请稍后重试',
                 });
            }
        })
        .catch(() => {
            // 用户点击取消按钮
            ElMessage({
                type: 'info',
                message: '已取消注销操作',
            });
        });
};

// 获取关注数
const fetchFollowingCount = (userId) => {
     if (!userId) return; // 增加 userId 检查
    getFollowingCount(userId)
        .then(response => {
             // 确保接口返回的数据结构正确
            followingCount.value = response.data?.data ?? 0; // 使用可选链和空值合并
        })
        .catch(error => {
            console.error("Error fetching following count:", error);
             // 可以给用户一个提示
             // ElMessage.error('获取关注数失败');
             followingCount.value = 0; // 出错时设为0
        });
};

// 获取粉丝数
const fetchFollowerCount = (userId) => {
     if (!userId) return; // 增加 userId 检查
    getFollowerCount(userId)
        .then(response => {
            // 确保接口返回的数据结构正确
            followerCount.value = response.data?.data ?? 0; // 使用可选链和空值合并
        })
        .catch(error => {
            console.error("Error fetching follower count:", error);
            // 可以给用户一个提示
            // ElMessage.error('获取粉丝数失败');
            followerCount.value = 0; // 出错时设为0
        });
};

</script>

<style scoped>
.user-info-page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f5f7fa; /* 淡灰色背景 */
}

.user-info-container {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: flex-start; /* 从顶部开始对齐 */
    padding: 40px 20px; /* 上下左右边距 */
}

.user-info-card {
    width: 100%;
    max-width: 700px; /* 可以适当增大宽度 */
    border-radius: 8px;
    padding: 30px 40px; /* 增加内边距 */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); /* 更柔和的阴影 */
}

.user-info-title {
    text-align: center;
    margin-bottom: 30px;
    color: #303133; /* 深灰色 */
    font-size: 22px; /* 稍大字体 */
    font-weight: 600; /* 加粗 */
    display: flex; /* 使用 flex 布局让图标和文字对齐 */
    align-items: center; /* 垂直居中 */
    justify-content: center; /* 水平居中 */
}

/* 如果标题图标使用 el-icon, 可以这样设置 */
.user-info-title .el-icon {
    margin-right: 8px; /* 图标和文字间距 */
    color: #409EFF; /* Element Plus 主题色 */
}


.user-avatar-container {
    text-align: center;
    margin-bottom: 25px; /* 增加头像下方间距 */
}

.user-avatar {
    border: 4px solid #fff; /* 白色边框 */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); /* 阴影效果 */
}

.user-descriptions {
    margin-bottom: 30px; /* 描述列表下方间距 */
    font-size: 14px; /* 统一描述字体大小 */
}

/* 优化描述项标签和内容的样式 */
:deep(.el-descriptions__label) { /* 使用 :deep() 穿透作用域 */
    color: #606266; /* 标签颜色 */
    font-weight: normal; /* 标签不加粗 */
    width: 100px; /* 固定标签宽度 */
    text-align: right; /* 标签右对齐 */
    padding-right: 15px; /* 增加右侧内边距 */
}

:deep(.el-descriptions__content) {
     color: #303133; /* 内容颜色 */
}

.user-info-value {
    /* font-weight: 500; */ /* 内容可以不用特别加粗 */
    color: #303133; /* 保持内容颜色一致 */
    word-break: break-all; /* 长内容换行 */
}

.user-stats {
    display: flex;
    justify-content: space-around; /* 分散对齐 */
    align-items: center; /* 垂直居中 */
    margin-bottom: 30px;
    padding: 15px 0; /* 上下内边距 */
    border-top: 1px solid #e4e7ed; /* 上边框线 */
    border-bottom: 1px solid #e4e7ed; /* 下边框线 */
    background-color: #fafafa; /* 浅灰色背景 */
    border-radius: 4px; /* 轻微圆角 */
}

.user-stats .stat-item {
    display: flex; /* 改为 flex 布局 */
    align-items: center; /* 垂直居中对齐 */
    gap: 8px; /* 项目之间的间隙 */
    color: #606266; /* 默认文字颜色 */
    font-size: 14px;
}

.user-stats .stat-item > span:first-child { /* 标签文字 */
    /* font-weight: bold; */ /* 标签可以不加粗 */
    color: #606266;
}

.user-stats .stat-item a {
    text-decoration: none; /* 去掉链接下划线 */
}

.user-stats .stat-item .stat-count { /* 数字 */
    font-size: 18px; /* 数字稍大 */
    font-weight: 600; /* 数字加粗 */
    color: #409EFF; /* Element Plus 主题色 */
    transition: color 0.3s ease; /* 添加颜色过渡效果 */
}
.user-stats .stat-item a:hover .stat-count {
    color: #66b1ff; /* 悬停时颜色变浅 */
}

.user-actions {
    text-align: center;
    margin-top: 20px; /* 与上方元素的间距 */
    display: flex; /* 使用 flex 布局 */
    flex-wrap: wrap; /* 允许换行 */
    justify-content: center; /* 居中对齐 */
    gap: 10px; /* 按钮之间的间隙 */
}

/* 移除 router-link 的默认样式干扰 */
.user-actions router-link {
    margin: 0;
    padding: 0;
    display: inline-block; /* 或 block，取决于布局需要 */
}

.user-actions .el-button {
     /* margin: 0 8px 10px 8px; */ /* 调整按钮间距，底部留出换行空间 */
     min-width: 110px; /* 给按钮一个最小宽度，使其更统一 */
}

/* 加载状态样式 */
.loading {
    padding: 40px;
    text-align: center;
    color: #909399;
    font-size: 16px;
}
</style>