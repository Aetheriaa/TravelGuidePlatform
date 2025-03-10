<template>
    <div class="user-guide-history">
      <h2>我的点赞</h2>
  
      <el-skeleton :loading="loading" :rows="8" animated>
        <template #default>
          <el-empty v-if="guides.length === 0" description="暂无点赞" />
  
          <el-table :data="guides" style="width: 100%" stripe border>
            <el-table-column prop="title" label="攻略标题" min-width="200">
              <template #default="{row}">
                <router-link :to="{ name: 'GuideDetail', params: { id: row.id } }" class="link-style">
                  {{ row.title }}
                </router-link>
              </template>
            </el-table-column>
  
            <el-table-column label="作者" width="150">
              <template #default="{ row }">
                <div class="author-info">
                  <el-avatar :src="row.authorAvatar || defaultAvatar" :size="25" />
                  <span class="author-name">{{ row.authorName }}</span>
                </div>
              </template>
            </el-table-column>
  
            <el-table-column label="操作" width="150">
              <template #default="{ row }">
                <router-link :to="{ name: 'GuideDetail', params: { id: row.id } }">
                  <el-button size="small" type="primary" text>查看</el-button>
                </router-link>
                <el-popconfirm
                  title="确定取消点赞吗？"
                  @confirm="handleUnlike(row.id)"
                >
                  <template #reference>
                    <el-button size="small" type="danger" text :loading="unliking[row.id]">取消点赞</el-button>
                  </template>
                </el-popconfirm>
  
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-skeleton>
  
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        class="pagination"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, reactive } from 'vue';
  import { getUserLikedGuides } from '@/api/user';
  import { unlikeGuide } from '@/api/guide'; // 导入取消点赞的 API
  import { ElMessage, ElTable, ElTableColumn, ElAvatar, ElSkeleton, ElEmpty, ElPagination, ElButton, ElPopconfirm } from 'element-plus';
  import defaultAvatar from '@/assets/default_avatar.jpg'; // 导入默认头像
  import { useRouter } from 'vue-router';
  
  const guides = ref([]);
  const loading = ref(false);
  const total = ref(0);
  const currentPage = ref(1);
  const pageSize = ref(10);
  const router = useRouter();
  const unliking = reactive({}); // 使用 reactive 创建一个响应式对象
  
  onMounted(() => {
    fetchLikedHistory();
  });
  
  const fetchLikedHistory = () => {
    loading.value = true;
    getUserLikedGuides({ page: currentPage.value, pageSize: pageSize.value })
      .then(response => {
        guides.value = response.data.data.records;
        total.value = response.data.data.total;
      })
      .catch(error => {
        console.error("Error fetching liked history:", error);
        ElMessage.error("获取点赞历史失败");
      })
      .finally(() => {
        loading.value = false;
      });
  };
  
  const handleSizeChange = (val) => {
    pageSize.value = val;
    fetchLikedHistory();
  };
  
  const handleCurrentChange = (val) => {
    currentPage.value = val;
    fetchLikedHistory();
  };
  
  const handleUnlike = (guideId) => {
    unliking[guideId] = true; // 设置 loading 状态
    unlikeGuide(guideId)
      .then(() => {
        ElMessage.success('取消点赞成功');
        // 从列表中移除已取消点赞的攻略（优化体验）
        guides.value = guides.value.filter(guide => guide.id !== guideId);
        total.value -= 1; // 更新总数
  
      })
      .catch(error => {
        console.error("Error unliking guide:", error);
        ElMessage.error('取消点赞失败');
      })
      .finally(() => {
          unliking[guideId] = false;
      })
  };
  
  </script>
  
  <style scoped>
  .user-guide-history {
    padding: 20px;
  }
  
  .author-info {
    display: flex;
    align-items: center;
  }
  
  .author-name {
    margin-left: 8px;
  }
  
  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center; /* 分页居中 */
  }
  .link-style {
     text-decoration: none; /* 移除下划线 */
     color: inherit;      /* 继承父元素颜色 */
     &:hover {         /* 鼠标悬停时改变颜色 */
        color: #409EFF;
     }
  }
  </style>