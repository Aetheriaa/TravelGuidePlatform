<template>
  <div class="topic-list-view">
    <el-card shadow="hover" class="topic-card">
      <template #header>
        <div class="card-header">
          <span><i class="el-icon-collection-tag" /> 论坛主题列表</span>
          <router-link :to="{ name: 'TopicCreate' }">
            <el-button type="primary" size="small" style="float: right;" title="发布新主题">
              <i class="el-icon-plus" /> 发布主题
            </el-button>
          </router-link>
        </div>
      </template>

      <div class="search-bar">
        <el-input
          placeholder="搜索主题"
          v-model="listQuery.keyword"
          clearable
          @clear="fetchTopics"
          @keyup.enter="fetchTopics"
          class="search-input"
        >
          <template #append>
            <el-button type="primary" icon="el-icon-search" @click="fetchTopics">搜索</el-button>
          </template>
        </el-input>
      </div>

      <el-table
        :data="topics"
        v-loading="loading"
        style="width: 100%"
        :header-cell-style="headerCellStyle"
        :row-style="rowStyle"
        @sort-change="handleSortChange"
      >
        <el-table-column label="主题" prop="title" sortable="custom">
          <template #default="scope">
            <router-link :to="{ name: 'TopicDetail', params: { id: scope.row.id } }" class="topic-title">
              <span class="title-text">{{ scope.row.title }}</span>
              <el-tag v-if="scope.row.top" type="danger" size="mini" style="margin-left: 5px">置顶</el-tag>
            </router-link>
          </template>
        </el-table-column>

        <el-table-column prop="username" label="作者" width="150">
          <template #default="scope">
            <span class="author-name">{{ scope.row.username }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="发布时间" width="200" sortable="custom">
          <template #default="scope">
            <span class="topic-date">{{ formatDate(scope.row.createTime) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="replyCount" label="回复" width="100" align="center" sortable="custom">
          <template #default="scope">
            <el-badge :value="scope.row.replyCount" :max="99" type="primary" />
          </template>
        </el-table-column>

        <el-table-column prop="lastReplyTime" label="最后回复" width="200" sortable="custom">
          <template #default="scope">
            <span class="topic-date">{{ formatDate(scope.row.lastReplyTime) }}</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="listQuery.page"
          v-model:page-size="listQuery.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          background
        />
      </div>

      <el-empty v-if="!loading && topics.length === 0" description="暂无主题" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, watch } from 'vue';
import { getTopicList } from '@/api/topic';
import { formatDate } from '@/utils/date';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

const router = useRouter();
const topics = ref([]);
const loading = ref(false);
const total = ref(0);
const listQuery = reactive({
  page: 1,
  pageSize: 10,
  keyword: null,
  sortBy: 'createTime',
  sortOrder: 'desc',
});

onMounted(() => {
  fetchTopics();
});

const fetchTopics = () => {
  loading.value = true;
  getTopicList(listQuery)
    .then(res => {
      topics.value = res.data.data.records;
      total.value = res.data.data.total;
    })
    .catch(err => {
      console.error(err);
      ElMessage.error('获取数据失败');
    })
    .finally(() => {
      loading.value = false;
    });

    
};

const handleSizeChange = val => {
  listQuery.pageSize = val;
  fetchTopics();
};
const handleCurrentChange = val => {
  listQuery.page = val;
  fetchTopics();
};

// 表头样式
const headerCellStyle = () => {
  return {
    background: '#f5f7fa',
    color: '#333',
    fontWeight: 'bold',
    fontSize: '14px',
    // padding: '12px 0'
  };
};
// 表格行的样式
const rowStyle = () => {
    return{
        cursor: 'pointer'
    }
}

const handleSortChange = ({ column, prop, order }) => {
  if (prop) {
      listQuery.sortBy = prop;
      listQuery.sortOrder = order === 'ascending' ? 'asc' : 'desc';
      fetchTopics();
  }
};
</script>

<style scoped>
/*  Make the component a flex container and set min-height  */
.topic-list-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 20px;
  /* Center the content horizontally */
  align-items: center;  /* Keep centering */
}

/*  Set width to 100% and remove max-width  */
.topic-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  width: 100%; /*  Use full width of the parent */
  /* REMOVE max-width: 700px; */
  flex: 1; /* Allow the card to grow vertically */
  padding: 20px; /* Add padding inside the card */
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 15px; /* Add some space below the header */
}

.search-bar {
  margin-bottom: 20px;
}

/*  Adjust width for better responsiveness  */
.search-input {
  width: 100%;
  /*max-width: 300px;  Optional: keep if you want to limit input width */
}

.topic-title {
  color: #409eff;
  text-decoration: none;
  font-size: 16px;
  transition: color 0.3s ease;
  display: inline-block;
}

.topic-title:hover .title-text {
  color: #66b1ff;
  text-decoration: underline;
}

.author-name {
  color: #606266;
}

.topic-date {
  color: #909399;
  font-size: 14px;
}

.pagination-container {
  margin-top: 20px;
  text-align: center;
}
</style>

<style>
/* Ensure full-page height for SPAs */
html, body, #app {
  height: 100%;
  margin: 0;
}
</style>