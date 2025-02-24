<template>
    <div class="order-pay-view">
        <h2>支付订单</h2>
        <div v-if="order" class="order-info">
            <p>订单号：{{ order.id }}</p>
            <p>产品名称：{{ order.productName }}</p>
            <p>数量：{{ order.quantity }}</p>
            <p>总价：￥{{ order.totalPrice }}</p>

            <el-form label-width="120px">
                <el-form-item label="支付方式">
                    <el-radio-group v-model="paymentMethod">
                        <el-radio label="alipay">支付宝 (模拟)</el-radio>
                        <el-radio label="wechat">微信支付 (模拟)</el-radio>
                        <el-radio label="mock">模拟支付</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handlePay">确认支付</el-button>
                    <el-button @click="handleBack">返回</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div v-else>
            <p>加载中...</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getOrderDetail, payOrder } from '@/api/order'; // 导入获取订单详情的 API
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElDialog } from 'element-plus'

const route = useRoute();
const router = useRouter();
const order = ref(null);
const paymentMethod = ref('mock'); // 默认支付方式
const dialogVisible = ref(false)
const dialogTitle = ref('')
const dialogMessage = ref('')

const productId = route.params.productId;

onMounted(() => {
    fetchOrderDetail();
});

const fetchOrderDetail = () => {
    getOrderDetail(route.params.id)
        .then(res => {
            order.value = res.data.data;
        })
        .catch(err => {
            console.error(err);
            ElMessage.error('加载订单信息失败');
        });
};

const handlePay = () => {
    if (paymentMethod.value === 'mock') {
        handleMockPayment();
    } else {
        ElMessage.warning('暂不支持该支付方式，请选择模拟支付');
    }
};

const handleMockPayment = async () => {
    // 模拟支付成功
    dialogTitle.value = '支付结果'
    dialogMessage.value = '模拟支付成功！'
    // 模拟支付成功，调用后端 API 更新订单状态
    try {
        await payOrder(order.value.id); // 确保这里正确地传入了 order.value.id
        dialogVisible.value = true
        router.push({ name: 'ProductDetail', params: { id: productId } });
    } catch (error) {
        dialogTitle.value = '支付结果'
        dialogMessage.value = '支付失败'
        dialogVisible.value = true
        console.error("Error updating order status:", error);
    }
};

const handleBack = () => {
    router.push({ name: 'OrderList' });
};
</script>

<style scoped>
.order-pay-view {
    padding: 20px;
}

.order-info {
    border: 1px solid #eee;
    padding: 20px;
    margin-bottom: 20px;
}
</style>