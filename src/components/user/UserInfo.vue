<template>
    <div class="user-info-page">
        <Header />
        <div class="user-info-container">
            <el-card class="user-info-card" shadow="hover">
                <div v-if="user" class="user-details">
                    <h2 class="user-info-title">
                        <i class="el-icon-user-solid"></i> 个人信息
                    </h2>
                    <div class="user-avatar-container">
                        <el-avatar :size="120" :src="user.avatar || defaultAvatar" class="user-avatar">
                            <img src="../assets/default_avatar.jpg" />
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
                            <span class="user-info-value">{{ user.bio }}</span>
                        </el-descriptions-item>

                    </el-descriptions>

                    <div class="user-actions">
                        <router-link to="/userupdate">
                            <el-button type="primary" icon="el-icon-edit">修改信息</el-button>
                        </router-link>
                        <el-button type="danger" icon="el-icon-delete" @click="handleDeleteAccount">注销账户</el-button>
                    </div>
                </div>
                <div v-else class="loading">
                    <el-skeleton :rows="6" animated />
                </div>
            </el-card>
        </div>
        <Footer />
    </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue';
import { useUserStore } from '@/stores/user';
import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import defaultAvatar from '@/assets/default_avatar.jpg'
import { useRouter } from 'vue-router'

const userStore = useUserStore();
const router = useRouter();

onMounted(() => {
    if (userStore.isLoggedIn) {
        userStore.fetchUserInfo(); // 获取用户信息
    } else {
        router.push('/login'); //未登录就跳转到登录
    }
});

const user = computed(() => userStore.currentUser);

//格式化时间
const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString(); // Or use a more sophisticated date formatting library
};

const handleDeleteAccount = () => {
    ElMessageBox.confirm(
        '您确定要注销账户吗？此操作不可撤销。',
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            // 调用注销账户的 API
            userStore.deleteAccount().then(() => {
                ElMessage({
                    type: 'success',
                    message: '账户已注销',
                });
                router.push('/')
            })
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消注销',
            });
        });
};

</script>

<style scoped>
.user-info-page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f5f7fa;
}

.user-info-container {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    /* 顶部对齐 */
    padding: 40px 20px;
}

.user-info-card {
    width: 100%;
    max-width: 600px;
    /* 更大的最大宽度 */
    border-radius: 8px;
    padding: 30px;
}

.user-info-title {
    text-align: center;
    margin-bottom: 30px;
    color: #333;
}

.user-info-title i {
    margin-right: 10px;
}

.user-avatar-container {
    text-align: center;
    margin-bottom: 20px;
}

.user-avatar {
    border: 3px solid #fff;
    /* 白色边框 */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    /* 阴影 */
}

.user-descriptions {
    margin-bottom: 20px;
}

.user-info-value {
    font-weight: 500;
    /* 加粗 */
    color: #555;
}

.user-actions {
    text-align: center;
}

.user-actions .el-button {
    margin: 0 5px;
}

.loading {
    padding: 20px;
    text-align: center;
}
</style>