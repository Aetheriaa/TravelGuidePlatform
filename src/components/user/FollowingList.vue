<template>
    <div class="following-list">
        <h2>我的关注</h2>
        <el-table :data="following" style="width: 100%" v-loading="loading">
            <el-table-column prop="username" label="用户名"></el-table-column>
            <el-table-column prop="nickname" label="昵称"></el-table-column>
            <el-table-column prop="bio" label="简介"></el-table-column>
            <!-- 其他你想要显示的列 -->
        </el-table>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getFollowing } from '@/api/user'; // 导入 API
import { useUserStore } from '@/stores/user';
const userStore = useUserStore()
const following = ref([]);
const loading = ref(false);

onMounted(() => {
    fetchFollowing();
});

const fetchFollowing = () => {
    if (!userStore.isLoggedIn) {
        return
    }
    loading.value = true;
    getFollowing(userStore.currentUser.id).then(res => { // 获取当前登录用户的关注列表
        following.value = res.data.data; // 假设后端返回 { data: [...] }
        console.log(following.value);
    }).catch(err => {
        console.error("Error fetching following list:", err);
    }).finally(() => {
        loading.value = false;
    });
};
</script>

<style scoped>
.following-list {
    padding: 20px;
}
</style>