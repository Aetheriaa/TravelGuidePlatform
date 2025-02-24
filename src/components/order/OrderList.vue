<template>
    <div class="order-list">
        <h2>我的订单</h2>

        <!-- 搜索表单 (可选) -->
        <el-form :inline="true" :model="listQuery" class="search-form">
            <el-form-item label="订单号">
                <el-input v-model="listQuery.keyword" placeholder="输入订单号搜索" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="fetchOrders">搜索</el-button>
            </el-form-item>
        </el-form>

        <!-- 订单列表 -->
        <el-table :data="orders" style="width: 100%" v-loading="loading" row-key="id">
            <el-table-column prop="id" label="订单号" width="120" sortable></el-table-column>
            <el-table-column prop="orderTime" label="下单时间" width="180" sortable>
                <template #default="scope">
                    {{ formatDate(scope.row.orderTime) }}
                </template>
            </el-table-column>
            <el-table-column prop="productName" label="产品名称"></el-table-column>
            <el-table-column prop="quantity" label="数量" width="100"></el-table-column>
            <el-table-column prop="totalPrice" label="总价" width="120" sortable></el-table-column>
            <el-table-column prop="status" label="状态" width="100">
                <template #default="scope">
                    {{ formatStatus(scope.row.status) }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template #default="scope">
                    <router-link :to="{ name: 'OrderDetail', params: { id: scope.row.id } }">
                        <el-button size="small" type="primary" text>查看详情</el-button>
                    </router-link>
                    <el-popconfirm v-if="scope.row.status === 0" title="确定要取消该订单吗？"
                        @confirm="handleCancel(scope.row.id)">
                        <template #reference>
                            <el-button size="small" type="danger" text>取消订单</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination v-model:current-page="listQuery.page" v-model:page-size="listQuery.pageSize"
            :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" :total="total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { getOrderList, cancelOrder } from '@/api/order';
import { ElMessage, ElMessageBox } from 'element-plus';
import { formatDate } from '@/utils/date'; // 导入日期格式化函数
import { useRouter } from 'vue-router';

const router = useRouter();
const orders = ref([]);
const loading = ref(false);
const total = ref(0);

// 查询参数
const listQuery = reactive({
    page: 1,
    pageSize: 10,
    keyword: null, // 搜索关键词
    // status: null, // 订单状态 (可选)
    // startTime: null, // 下单开始时间 (可选)
    // endTime: null,   // 下单结束时间 (可选)
});

onMounted(() => {
    fetchOrders();
});

// 获取订单列表
const fetchOrders = () => {
    loading.value = true;
    getOrderList(listQuery)
        .then(response => {
            console.log(response.data.data);
            orders.value = response.data.data.records;
            total.value = response.data.data.total;

        })
        .catch(error => {
            console.error("Error fetching orders:", error);
            ElMessage.error('获取订单列表失败');
        })
        .finally(() => {
            loading.value = false;
        });
};

// 取消订单
const handleCancel = (orderId) => {
    ElMessageBox.confirm(
        '确定要取消该订单吗？',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    )
        .then(() => {
            cancelOrder(orderId)
                .then(() => {
                    ElMessage.success('订单已取消');
                    fetchOrders(); // 刷新列表
                })
                .catch(error => {
                    console.error("Error canceling order:", error);
                    ElMessage.error('取消订单失败');
                });
        })
        .catch(() => {
            // 用户点击了取消按钮，什么也不做
        });
};

// 格式化订单状态
const formatStatus = (status) => {
    switch (status) {
        case 0:
            return '待支付';
        case 1:
            return '已支付';
        case 2:
            return '已取消';
        case 3:
            return '已完成';
        default:
            return '未知状态';
    }
};

// 分页
const handleSizeChange = (val) => {
    listQuery.pageSize = val;
    fetchOrders()
};
const handleCurrentChange = (val) => {
    listQuery.page = val
    fetchOrders()
};
</script>

<style scoped>
.order-list {
    padding: 20px;
}

.search-form {
    margin-bottom: 20px;
}
</style>