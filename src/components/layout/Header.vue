<template>
    <el-header height="60px" class="custom-header">
        <div class="logo-container">
            <router-link :to="{ name: 'HomeView' }" class="logo-link">
                <img src="@/assets/logo.jpg" alt="Logo" class="logo-img" />
                <span class="logo-text">旅游攻略分享平台</span>
            </router-link>
        </div>

        <div class="search-bar-container">
            <el-input placeholder="搜索攻略、用户、旅游产品..." v-model="searchText" @keyup.enter="handleSearch" clearable
                class="search-input">
                <template #append>
                    <el-button type="primary" @click="handleSearch" class="search-button">
                        <i class="el-icon-search"></i> 搜索
                    </el-button>
                </template>
            </el-input>
        </div>

        <div class="navigation">
            <router-link :to="{ name: 'GuideList' }" class="nav-link">
                攻略
            </router-link>
            <router-link :to="{ name: 'ProductList' }" class="nav-link">
                产品
            </router-link>
            <router-link :to="{ name: 'ItineraryList' }" class="nav-link">
                行程
            </router-link>
            <router-link :to="{ name: 'PopularTags' }" class="nav-link">
                热门标签
            </router-link>
            <router-link :to="{ name: 'TopicList' }" class="nav-link">
                论坛
            </router-link>
        </div>

        <div class="user-actions">
            <template v-if="isLoggedIn">
                <el-dropdown trigger="click">
                    <span class="el-dropdown-link user-info">
                        <img :src="currentUser?.avatar || defaultAvatar" alt="用户头像" class="avatar" />
                        <span class="username">{{ currentUser?.nickname ?? currentUser?.username ?? '游客' }}</span>
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item>
                                <router-link :to="{ name: 'UserInfo' }" class="dropdown-link">个人中心</router-link>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <router-link :to="{ name: 'OrderList' }" class="dropdown-link">我的订单</router-link>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <router-link :to="{ name: 'UserGuideHistory' }" class="dropdown-link">历史记录</router-link>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <router-link :to="{ name: 'UserLikedGuides' }" class="dropdown-link">我的点赞</router-link>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <router-link :to="{ name: 'UserFavoriteGuides' }"
                                    class="dropdown-link">我的收藏</router-link>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <router-link :to="{ name: 'MessageList' }" class="dropdown-link">我的消息</router-link>
                            </el-dropdown-item>
                            <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>

            </template>
            <template v-else>
                <router-link :to="{ name: 'Login' }" class="auth-link">
                    <el-button type="text">登录</el-button>
                </router-link>
                <router-link :to="{ name: 'Register' }" class="auth-link">
                    <el-button type="primary" round>注册</el-button>
                </router-link>
            </template>
        </div>
    </el-header>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import defaultAvatar from '@/assets/default_avatar.jpg';

const router = useRouter();
const userStore = useUserStore();
const searchText = ref('');
const isLoggedIn = computed(() => userStore.isLoggedIn);
const currentUser = computed(() => userStore.currentUser);

onMounted(() => {
    if (userStore.isLoggedIn && !userStore.currentUser) {
        userStore.fetchUserInfo();
    }
});

const handleSearch = () => {
    router.push({ name: 'SearchResult', query: { keyword: searchText.value } });
};

const handleLogout = () => {
    userStore.logout();
    router.push({ name: 'HomeView' });
}
</script>

<style scoped>
.custom-header {
    display: flex;
    align-items: center;
    padding: 0 20px;
    background-color: #fff;
    /* 纯白背景 */
    border-bottom: 1px solid #e0e0e0;
    /* 更细的边框 */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    /* 淡淡的阴影 */
}

.logo-container {
    display: flex;
    align-items: center;
    margin-right: 30px;
    /* 与搜索框保持更大间距 */
}

.logo-link {
    display: flex;
    align-items: center;
    text-decoration: none;
    /* 移除链接下划线 */
}

.logo-img {
    height: 40px;
    margin-right: 10px;
}

.logo-text {
    font-size: 1.2em;
    /* 增大字体大小 */
    font-weight: bold;
    color: #333;
}

.search-bar-container {
    flex-grow: 1;
    margin-right: 30px;
}

.search-input {
    width: 100%;
    /* 让搜索框尽可能宽 */
}

.search-button {
    border-radius: 0 4px 4px 0;
}

.navigation {
    display: flex;
    margin-right: 30px;
}

.nav-link {
    margin-right: 20px;
    color: #555;
    /* 稍微深一点的颜色 */
    text-decoration: none;
    padding: 5px 10px;
    border-radius: 4px;
    transition: background-color 0.3s, color 0.3s;
    /* 平滑过渡 */
}

.nav-link:hover {
    background-color: #f2f2f2;
    color: #409EFF;
}

.user-actions {
    display: flex;
    align-items: center;
}

.user-info {
    display: flex;
    align-items: center;
    cursor: pointer;
    /* 鼠标悬停时显示为手型 */
    margin-right: 15px;
}

.avatar {
    width: 36px;
    /* 稍微小一点的头像 */
    height: 36px;
    border-radius: 50%;
    margin-right: 8px;
}

.username {
    color: #333;
    font-weight: 500;
}

.auth-link {
    margin-left: 10px;
    text-decoration: none;
}

/* 下拉菜单样式 */
.el-dropdown-link {
    cursor: pointer;
    display: flex;
    align-items: center;
}

.dropdown-link {
    text-decoration: none;
    color: black;
    display: block;
    width: 100%;
}
</style>