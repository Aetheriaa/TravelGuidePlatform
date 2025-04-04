<template>
    <div class="itinerary-list">
        <h2>我的行程</h2>
        <el-button type="primary" @click="gotoCreate">创建行程</el-button>

        <el-input v-model="listQuery.keyword" placeholder="搜索行程名称或描述" clearable @keyup.enter="fetchItineraries"
            style="margin-top: 10px; width: 300px;" />

        <el-table :data="itineraries" style="width: 100%" v-loading="loading">
            <el-table-column prop="name" label="行程名称" width="200"></el-table-column>
            <el-table-column prop="startDate" label="开始日期" width="150"></el-table-column>
            <el-table-column prop="endDate" label="结束日期" width="150"></el-table-column>
            <el-table-column prop="description" label="描述"></el-table-column>
            <el-table-column label="操作" width="160"> 
                <template #default="scope">
                    <el-button size="small" type="primary" text @click="gotoDetail(scope.row.id)">查看</el-button>
                    <el-button size="small" type="primary" text @click="gotoUpdate(scope.row.id)">编辑</el-button>
                    <el-popconfirm title="确定删除此行程吗？" @confirm="handleDelete(scope.row)">
                        <template #reference>
                            <el-button size="small" type="danger" text>删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination v-model:current-page="listQuery.page" v-model:page-size="listQuery.pageSize"
            :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" :total="total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 10px;">
        </el-pagination>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { getItineraries, deleteItinerary } from '@/api/itinerary';
// ElMessageBox 不再需要用于 handleDelete 的二次确认，但可能用于其他地方，暂时保留 import
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';

const router = useRouter();
const itineraries = ref([]);
const loading = ref(false);
const total = ref(0);
const listQuery = reactive({
    page: 1,
    pageSize: 10,
    keyword: null,
});

onMounted(() => {
    fetchItineraries();
});

const fetchItineraries = () => {
    loading.value = true;
    getItineraries(listQuery)
        .then(response => {
            // 假设接口返回的数据结构是 { code: xxx, message: xxx, data: { records: [], total: number } }
            // 请根据你的实际接口返回调整这里的路径
            if (response.data && response.data.data) {
                 itineraries.value = response.data.data.records || []; // 添加空值检查
                 total.value = response.data.data.total || 0;         // 添加空值检查
            } else {
                 itineraries.value = [];
                 total.value = 0;
                 ElMessage.warning('获取到的行程数据格式不正确');
                 console.warn("Unexpected response structure:", response.data);
            }
        })
        .catch(error => {
            console.error("Error fetching itineraries:", error);
            ElMessage.error("获取行程列表失败");
        })
        .finally(() => {
            loading.value = false;
        });
};

// 修改点：移除 handleDelete 中的 ElMessageBox.confirm，因为 el-popconfirm 已处理确认
const handleDelete = (row) => {
    // el-popconfirm 已经确认过了，直接调用删除接口
    deleteItinerary(row.id)
        .then(() => {
            ElMessage.success('行程删除成功');
            // 删除成功后重新获取列表，以刷新页面数据
            fetchItineraries();
        })
        .catch(error => {
            console.error("Error deleting itinerary:", error);
            // 根据错误信息给出更具体的提示，如果可能的话
            const errMsg = error.response?.data?.message || '删除行程失败';
            ElMessage.error(errMsg);
        });
    // 不需要 .catch(() => { ElMessage.info('已取消删除'); }) 了，因为取消操作由 el-popconfirm 处理
};

const gotoCreate = () => {
    router.push({ name: 'ItineraryCreate' });
};

const gotoDetail = (id) => {
    router.push({ name: 'ItineraryDetail', params: { id } });
};

const gotoUpdate = (id) => {
    router.push({ name: 'ItineraryUpdate', params: { id } });
};

const handleSizeChange = (val) => {
    listQuery.pageSize = val;
    listQuery.page = 1; // 页大小改变时，通常重置到第一页
    fetchItineraries();
};

const handleCurrentChange = (val) => {
    listQuery.page = val;
    fetchItineraries();
};
</script>

<style scoped>
.itinerary-list {
    padding: 20px;
}

/* 可以适当给操作按钮之间增加一点间距，如果需要的话 */
.el-table-column .el-button+.el-button {
    margin-left: 8px;
}
</style>