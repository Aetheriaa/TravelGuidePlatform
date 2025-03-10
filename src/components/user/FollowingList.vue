<template>
  <Header />
    <div class="following-list">
      <h2>我的关注</h2>
      <el-table
        :data="following"
        style="width: 100%"
        v-loading="loading"
        stripe
        border
        highlight-current-row
        :row-style="{ height: '50px' }"  >
        <el-table-column label="头像" width="80">
          <template #default="{ row }">
            <el-avatar :src="row.avatar || defaultAvatar" :size="40" />
          </template>
        </el-table-column>
  
        <el-table-column prop="username" label="用户名" min-width="120"></el-table-column>
        <el-table-column prop="nickname" label="昵称" min-width="150"></el-table-column>
        <el-table-column prop="bio" label="简介" min-width="200">
            <template #default="{row}">
                <div class="bio-cell">{{ row.bio }}</div>
            </template>
        </el-table-column>
  
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button type="danger" size="small" @click="handleUnfollow(row)" :loading="unfollowLoading[row.id]">
              取消关注
            </el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <el-empty v-if="!loading && following.length === 0" description="暂无关注" />
  
    </div>
  <Footer />
</template>

<script setup>
import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';
import { ref, onMounted, reactive } from 'vue';
import { getFollowing, unfollowUser } from '@/api/user'; // Import unfollow API
import { useUserStore } from '@/stores/user';
import { ElMessage } from 'element-plus';

const userStore = useUserStore();
const following = ref([]);
const loading = ref(false);
const unfollowLoading = reactive({}); // Reactive object for individual unfollow loading states
const defaultAvatar = '/default-avatar.png'; // Path to your default avatar image

onMounted(() => {
  fetchFollowing();
});

const fetchFollowing = () => {
  if (!userStore.isLoggedIn) {
    return;
  }
  loading.value = true;
  getFollowing(userStore.currentUser.id)
    .then(res => {
      following.value = res.data.data; // Assuming backend returns { data: [...] }
      console.log(following.value);
    })
    .catch(err => {
      console.error("Error fetching following list:", err);
      ElMessage.error('获取关注列表失败'); // Show a user-friendly error message
    })
    .finally(() => {
      loading.value = false;
    });
};

const handleUnfollow = async (user) => {
  if (!userStore.isLoggedIn) {
      return;
  }
  unfollowLoading[user.id] = true;  // Set loading state for *this* user

  try {
    await unfollowUser(user.id); //  Replace with your actual API call
    //  Remove the user from the following list (optimistic update)
    following.value = following.value.filter(u => u.id !== user.id);
     ElMessage.success('取消关注成功');
  } catch (error) {
    console.error("Error unfollowing user:", error);
    ElMessage.error('取消关注失败'); // Show error message
  } finally {
      unfollowLoading[user.id] = false; // Reset loading state
  }
};
</script>

<style scoped>
.following-list {
  padding: 20px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .el-table {
    font-size: 14px; /* Smaller font size on smaller screens */
  }
}
.bio-cell {
    max-width: 300px; /* Adjust the value as needed */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>