<template>
    <div class="user-guide-history">
      <h2>我的浏览历史</h2>
  
      <el-skeleton :loading="loading" :rows="8" animated>
        <template #default>
          <el-empty v-if="guides.length === 0" description="暂无浏览历史" />
  
          <el-table :data="guides" style="width: 100%" stripe border>
            
            <el-table-column prop="title" label="攻略标题" min-width="180">
              <template #default="{row}">
                <router-link :to="{ name: 'GuideDetail', params: { id: row.id } }" class="link-style">
                  {{ row.title }}
                </router-link>
              </template>
            </el-table-column>
  
            <el-table-column label="作者" width="150">
              <template #default="{ row }">
                <div class="author-info">
                  <el-avatar v-if="row.authorAvatar" :src="row.authorAvatar" :size="25">
                      <template #error>
                          <el-icon :size="20"><User /></el-icon>
                      </template>
                  </el-avatar>
                   <el-icon v-else :size="20"><User /></el-icon>
                  <span class="author-name">{{ row.authorName }}</span>
                </div>
              </template>
            </el-table-column>
  
            <el-table-column prop="createTime" label="浏览时间" width="180">
              <template #default="{ row }">
                {{ formatDate(row.createTime) }}
              </template>
            </el-table-column>
  
            <el-table-column label="操作" width="100">
              <template #default="{ row }">
                <router-link :to="{ name: 'GuideDetail', params: { id: row.id } }">
                  <el-button size="small" type="primary" text>查看</el-button>
                </router-link>
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
import { ref, onMounted } from 'vue';
import { getUserGuideHistory } from '@/api/user';
import { ElMessage, ElTable, ElTableColumn, ElImage, ElAvatar, ElSkeleton, ElEmpty, ElPagination, ElButton, ElIcon } from 'element-plus';
import { formatDate } from '@/utils/date';
import { useRouter } from 'vue-router';
import { Picture, User } from '@element-plus/icons-vue';

const guides = ref([]);
const loading = ref(false);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const router = useRouter();

onMounted(() => {
  fetchGuideHistory();
});

const fetchGuideHistory = () => {
  loading.value = true;
  getUserGuideHistory({ page: currentPage.value, pageSize: pageSize.value })
    .then(response => {
      // 假设后端返回的数据结构：
      // { data: { records: [ { id, title, authorAvatar, authorName, createTime }, ... ], total } }
      guides.value = response.data.data.records;
      total.value = response.data.data.total;
    })
    .catch(error => {
      console.error("Error fetching guide history:", error);
      ElMessage.error("获取浏览历史失败");
    })
    .finally(() => {
      loading.value = false;
    });
};

const handleSizeChange = (val) => {
  pageSize.value = val;
  fetchGuideHistory();
};

const handleCurrentChange = (val) => {
  currentPage.value = val;
  fetchGuideHistory();
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
  justify-content: center;
}
.link-style {
   text-decoration: none;
   color: inherit;
   &:hover {
      color: #409EFF;
   }
}
</style>