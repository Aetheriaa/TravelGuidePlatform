<template>

    <div class="topic-list-view">
        <el-row :gutter="20">
            <el-col :span="18">
                <el-card shadow="hover">
                    <div slot="header" class="clearfix">
                        <span>论坛主题列表</span>
                        <router-link :to="{ name: 'TopicCreate' }">
                            <el-button type="primary" style="float: right;">发布主题</el-button>
                        </router-link>
                    </div>

                    <!-- 搜索框 -->
                    <el-input placeholder="搜索主题" v-model="listQuery.keyword" style="width: 200px; margin-bottom: 10px"
                        clearable @clear="fetchTopics" @keyup.enter="fetchTopics">
                        <template #append>
                            <el-button @click="fetchTopics">搜索</el-button>
                        </template>
                    </el-input>

                    <!-- 主题列表 -->
                    <el-table :data="topics" v-loading="loading" style="width: 100%">
                        <el-table-column prop="title" label="主题" sortable>
                            <template #default="scope">
                                <router-link :to="{ name: 'TopicDetail', params: { id: scope.row.id } }">
                                    {{ scope.row.title }}
                                </router-link>
                            </template>
                        </el-table-column>
                        <el-table-column prop="username" label="作者" width="120"></el-table-column>
                        <el-table-column prop="createTime" label="发布时间" width="180" sortable>
                            <template #default="scope">
                                {{ formatDate(scope.row.createTime) }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="replyCount" label="回复数" width="100" sortable></el-table-column>
                        <el-table-column prop="lastReplyTime" label="最后回复时间" width="180" sortable>
                            <template #default="scope">
                                {{ formatDate(scope.row.lastReplyTime) }}
                            </template>
                        </el-table-column>
                    </el-table>

                    <!-- 分页 -->
                    <el-pagination v-model:current-page="listQuery.page" v-model:page-size="listQuery.pageSize"
                        :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" :total="total"
                        @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>

                    <!-- 空状态 -->
                    <el-empty v-if="!loading && topics.length === 0" description="暂无主题"></el-empty>
                </el-card>
            </el-col>

            <!-- 侧边栏 (可选) -->
            <el-col :span="6">
                <el-card shadow="hover">
                    <!-- 这里可以放置一些侧边栏内容，例如热门标签、热门主题、最新回复等 -->
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { getTopicList } from '@/api/topic';
import { formatDate } from '@/utils/date'; // 导入日期格式化函数
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
const router = useRouter()
const topics = ref([]);
const loading = ref(false);
const total = ref(0);
// const currentPage = ref(1);  // 移动到了 listQuery
// const pageSize = ref(10);
const listQuery = reactive({
    page: 1,
    pageSize: 10,
    keyword: null, //搜索关键词
    sortBy: 'createTime',
    sortOrder: 'desc'
    // status: null, // 状态 (可选)
    // startTime: null, // 开始时间 (可选)
    // endTime: null,   // 结束时间 (可选)
})
onMounted(() => {
    fetchTopics();
});

const fetchTopics = () => {
    loading.value = true;
    getTopicList(listQuery).then(res => {
        topics.value = res.data.data.records
        total.value = res.data.data.total;
    }).catch(err => {
        console.log(err);
        ElMessage.error("获取数据失败")
    }).finally(() => {
        loading.value = false;
    })
};

// 分页
const handleSizeChange = (val) => {
    listQuery.pageSize = val;
    fetchTopics();
};
const handleCurrentChange = (val) => {
    listQuery.page = val;
    fetchTopics();
};
</script>

<style scoped>
.topic-list-view {
    padding: 20px;
}

/* 可以添加更多样式，例如卡片样式、列表项样式等 */
</style>