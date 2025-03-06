<template>
    <div class="user-guide-history">
        <h2>我的浏览历史</h2>

        <el-table :data="guides" style="width: 100%" v-loading="loading">
            <!-- 显示攻略的标题、封面图、发布时间等信息 -->
            <el-table-column prop="title" label="攻略标题"></el-table-column>
            <!-- <el-table-column prop="viewTime" label="浏览时间">
                <template #default="scope">
                    {{ formatDate(scope.row.viewTime) }}
                </template>
            </el-table-column> -->
            <!-- 其他你想要显示的列 -->
            <el-table-column label="操作">
                <template #default="scope">
                    <router-link :to="{ name: 'GuideDetail', params: { id: scope.row.id } }">
                        <el-button size="small" type="primary" text>查看</el-button>
                    </router-link>
                </template>
            </el-table-column>
            <!-- ... -->
        </el-table>

        <!-- 分页 -->
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
            @current-change="handleCurrentChange"></el-pagination>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { getUserGuideHistory } from '@/api/user'; // 导入 API 请求函数
import { ElMessage } from 'element-plus';
import { formatDate } from '@/utils/date';

const guides = ref([]);
const loading = ref(false);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);

onMounted(() => {
    fetchGuideHistory();
});

const fetchGuideHistory = () => {
    loading.value = true;
    getUserGuideHistory({ page: currentPage.value, pageSize: pageSize.value })
        .then(response => {
            guides.value = response.data.data.records; // 根据你的后端返回数据结构调整
            total.value = response.data.data.total;
            console.log(response.data.data.records)
        })
        .catch(error => {
            console.error("Error fetching guide history:", error);
            ElMessage.error("获取数据失败");
        })
        .finally(() => {
            loading.value = false;
        });
};
//分页
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
/* 添加样式 */
</style>