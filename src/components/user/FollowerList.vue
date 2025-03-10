<template>
  <Header />
    <div class="follower-list">
      <h2>我的粉丝</h2>
  
      <el-table
        :data="followers"
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
          <template #default="{ row }">
            <div class="bio-cell">{{ row.bio }}</div>
          </template>
        </el-table-column>
  
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button
              v-if="!isFollowing(row)"
              type="primary"
              size="small"
              @click="handleFollow(row)"
              :loading="followLoading[row.id]"
            >
              关注
            </el-button>
            <el-button
              v-else
              type="info"
              size="small"
              @click="handleUnfollow(row)"
              :loading="unfollowLoading[row.id]"
            >
              互相关注
            </el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <el-empty v-if="!loading && followers.length === 0" description="暂无粉丝" />
    </div>
  <Footer />
</template>

<script setup>
import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';
import { ref, onMounted, reactive, computed } from 'vue';
import { getFollowers, followUser, unfollowUser, getFollowing } from '@/api/user'; // Import follow/unfollow APIs
import { useUserStore } from '@/stores/user';
import { ElMessage } from 'element-plus';

const userStore = useUserStore();
const followers = ref([]);
const following = ref([]); // Store the users *I* am following
const loading = ref(false);
const followLoading = reactive({}); // For follow button loading states
const unfollowLoading = reactive({}); // For unfollow button loading states
const defaultAvatar = '/default-avatar.png';

onMounted(() => {
  fetchFollowers();
  fetchFollowing(); // Fetch the list of users *I* am following
});

const fetchFollowers = () => {
  if (!userStore.isLoggedIn) {
    return;
  }
  loading.value = true;
  getFollowers(userStore.currentUser.id)
    .then(res => {
      followers.value = res.data.data;
    })
    .catch(err => {
      console.error("Error fetching followers list:", err);
      ElMessage.error('获取粉丝列表失败');
    })
    .finally(() => {
      loading.value = false;
    });
};
const fetchFollowing = () => {
    if (!userStore.isLoggedIn) {
        return
    }
    getFollowing(userStore.currentUser.id).then(res => {
        following.value = res.data.data; // 假设后端返回 { data: [...] }
    }).catch(err => {
        console.error("Error fetching following list:", err);
    })
};

// Computed property to check if I am following a specific user
const isFollowing = (user) => {
  return following.value.some(u => u.id === user.id);
};

const handleFollow = async (user) => {
    if (!userStore.isLoggedIn) {
        return;
    }
  followLoading[user.id] = true;
  try {
    await followUser(user.id);
    following.value.push(user); //optimistic update

    ElMessage.success('关注成功');
  } catch (error) {
    console.error("Error following user:", error);
    ElMessage.error('关注失败');
  } finally {
    followLoading[user.id] = false;
  }
};

const handleUnfollow = async (user) => {
    if (!userStore.isLoggedIn) {
        return;
    }
  unfollowLoading[user.id] = true;
  try {
    await unfollowUser(user.id);
    following.value = following.value.filter(u => u.id !== user.id) //optimistic update
    ElMessage.success('取消关注成功');
  } catch (error) {
    console.error("Error unfollowing user:", error);
    ElMessage.error('取消关注失败');
  } finally {
    unfollowLoading[user.id] = false;
  }
};
</script>

<style scoped>
.follower-list {
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