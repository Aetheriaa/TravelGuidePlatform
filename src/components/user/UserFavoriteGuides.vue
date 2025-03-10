<template>
    <div class="user-guide-history">
      <h2>我的收藏</h2>
  
      <el-skeleton :loading="loading" :rows="8" animated>
        <template #default>
          <el-empty v-if="guides.length === 0" description="暂无收藏" />
  
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
                  title="确定取消收藏吗？"
                  @confirm="handleUnfavorite(row.id)"
                >
                  <template #reference>
                    <el-button size="small" type="danger" text :loading="unfavoriting[row.id]">取消收藏</el-button>
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
  import { getUserFavoriteGuides } from '@/api/user';
  import { unfavoriteGuide } from '@/api/guide'; // 导入取消收藏的 API
  import { ElMessage, ElTable, ElTableColumn, ElAvatar, ElSkeleton, ElEmpty, ElPagination, ElButton, ElPopconfirm } from 'element-plus';
  import defaultAvatar from '@/assets/default_avatar.jpg'; // 导入默认头像
  import { useRouter } from 'vue-router';
  
  const guides = ref([]);
  const loading = ref(false);
  const total = ref(0);
  const currentPage = ref(1);
  const pageSize = ref(10);
  const router = useRouter();
  const unfavoriting = reactive({}); // 使用 reactive 创建一个响应式对象
  
  onMounted(() => {
    fetchFavoriteHistory();
  });
  
  const fetchFavoriteHistory = () => {
    loading.value = true;
    getUserFavoriteGuides({ page: currentPage.value, pageSize: pageSize.value })
      .then(response => {
        guides.value = response.data.data.records;
        // 确保后端返回的数据包含 authorAvatar 和 authorName
        // 例如：
        // response.data.data.records = [
        //   { id: 1, title: '攻略1', authorAvatar: '...', authorName: '作者1' },
        //   ...
        // ];
        total.value = response.data.data.total;
      })
      .catch(error => {
        console.error("Error fetching favorite history:", error);
        ElMessage.error("获取收藏历史失败");
      })
      .finally(() => {
        loading.value = false;
      });
  };
  
  const handleSizeChange = (val) => {
    pageSize.value = val;
    fetchFavoriteHistory();
  };
  
  const handleCurrentChange = (val) => {
    currentPage.value = val;
    fetchFavoriteHistory();
  };
  
  const handleUnfavorite = (guideId) => {
    unfavoriting[guideId] = true; // 设置 loading 状态
    unfavoriteGuide(guideId)
      .then(() => {
        ElMessage.success('取消收藏成功');
        // 从列表中移除已取消收藏的攻略（优化体验）
        guides.value = guides.value.filter(guide => guide.id !== guideId);
        total.value -= 1;
  
      })
      .catch(error => {
        console.error("Error unfavoriting guide:", error);
        ElMessage.error('取消收藏失败');
      })
        .finally(()=>{
            unfavoriting[guideId] = false;
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