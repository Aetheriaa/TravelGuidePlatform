<template>
    <div class="follower-list">
        <h2>我的粉丝</h2>
        <el-table :data="followers" style="width: 100%" v-loading="loading">
            <el-table-column prop="username" label="用户名"></el-table-column>
            <el-table-column prop="nickname" label="昵称"></el-table-column>
            <el-table-column prop="bio" label="简介"></el-table-column>
            <!-- 其他你想要显示的列 -->
        </el-table>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getFollowers } from '@/api/user'; // 导入 API
import { useUserStore } from '@/stores/user';
const userStore = useUserStore()
const followers = ref([]);
const loading = ref(false);

onMounted(() => {
    fetchFollowers();
});

const fetchFollowers = () => {
    if (!userStore.isLoggedIn) {
        return
    }
    loading.value = true;
    getFollowers(userStore.currentUser.id).then(res => {
        followers.value = res.data.data
    }).catch(err => {
        console.error("Error fetching followers list:", err);
    }).finally(() => {
        loading.value = false
    })
};
</script>

<style scoped>
.follower-list {
    padding: 20px;
}
</style>