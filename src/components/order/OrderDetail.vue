<template>
    <div v-if="order" class="order-detail">
        <h2>订单详情</h2>
        <el-descriptions :column="1" border>
            <el-descriptions-item label="订单号">{{ order.id }}</el-descriptions-item>
            <el-descriptions-item label="下单时间">{{ formatDate(order.orderTime) }}</el-descriptions-item>
            <el-descriptions-item label="产品名称">
                <router-link :to="{ name: 'ProductDetail', params: { id: order.productId } }">
                    {{ order.productName }}
                </router-link>
            </el-descriptions-item>
            <el-descriptions-item label="数量">{{ order.quantity }}</el-descriptions-item>
            <el-descriptions-item label="总价">￥{{ order.totalPrice }}</el-descriptions-item>
            <el-descriptions-item label="状态">{{ formatStatus(order.status) }}</el-descriptions-item>
            <el-descriptions-item label="支付方式">{{ order.paymentMethod }}</el-descriptions-item>
            <el-descriptions-item label="支付时间">{{ formatDate(order.paymentTime) }}</el-descriptions-item>
        </el-descriptions>
        <el-button type="primary" @click="handlePay" v-if="order.status === 0">立即支付</el-button>
        <el-button type="danger" @click="handleCancel" v-if="order.status === 0">取消订单</el-button>
        <router-link :to="{ name: 'OrderList' }">
            <el-button>返回</el-button>
        </router-link>
    </div>
    <div v-else>
        Loading...
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getOrderDetail, cancelOrder } from '@/api/order';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { formatDate } from '@/utils/date';

const route = useRoute();
const router = useRouter()
const order = ref(null);

onMounted(() => {
    fetchOrderDetail();
});

const fetchOrderDetail = () => {
    getOrderDetail(route.params.id)
        .then(response => {
            order.value = response.data.data;
        })
        .catch(error => {
            console.error("Error fetching order detail:", error);
            ElMessage.error('获取订单详情失败');
        });
};

// 立即支付
const handlePay = () => {
    // 跳转到支付页面，并传递订单 ID
    router.push({ name: 'OrderPay', params: { id: order.value.id, productId: order.value.productId } });
};

// 取消订单
const handleCancel = () => {
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
            cancelOrder(order.value.id)
                .then(() => {
                    ElMessage.success('订单已取消');
                    router.push({ name: 'OrderList' }) // 取消后返回到列表页
                })
                .catch(error => {
                    ElMessage.error('取消失败');
                });
        })
        .catch(() => {
            // 用户点击了取消按钮，什么也不做
        });
};

// 格式化订单状态 (与 OrderList.vue 中相同)
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
</script>

<style scoped>
.order-detail {
    padding: 20px;
    /* 添加更多样式 */
}
</style>