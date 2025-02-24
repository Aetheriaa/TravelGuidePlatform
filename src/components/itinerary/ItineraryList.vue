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
            <el-table-column label="操作">
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
            itineraries.value = response.data.data.records;
            total.value = response.data.data.total;
        })
        .catch(error => {
            console.error("Error fetching itineraries:", error);
            ElMessage.error("获取行程失败");
        })
        .finally(() => {
            loading.value = false;
        });
};

const handleDelete = (row) => {
    ElMessageBox.confirm('确定删除此行程吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        deleteItinerary(row.id)
            .then(() => {
                ElMessage.success('行程删除成功');
                fetchItineraries();
            })
            .catch(error => {
                console.error("Error deleting itinerary:", error);
                ElMessage.error('Failed to delete itinerary');
            });
    }).catch(() => {
        ElMessage.info('已取消删除');
    });
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
</style>