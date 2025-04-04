<template>
    <!-- 1. 添加 page-container 作为 Flex 容器 -->
    <div class="page-container">
        <Header />

        <!-- 2. 将 order-pay-view 包裹在 main.main-content 中 -->
        <main class="main-content">
            <div class="order-pay-view">
                <h2>支付订单</h2>
                <!-- loading 状态处理 -->
                <div v-if="loading" class="loading-state">
                    <p>加载订单信息中...</p>
                    <!-- 可以放一个 el-skeleton 或其他加载指示器 -->
                </div>
                <!-- 订单信息加载完成且存在 -->
                <div v-else-if="order" class="order-info">
                    <p><strong>订单号：</strong>{{ order.id }}</p>
                    <p><strong>产品名称：</strong>{{ order.productName }}</p>
                    <p><strong>数量：</strong>{{ order.quantity }}</p>
                    <p><strong>总价：</strong><span class="price">￥{{ order.totalPrice.toFixed(2) }}</span></p> <!-- 保证两位小数 -->

                    <el-form label-width="100px" style="margin-top: 20px;"> <!-- 调整label宽度和上边距 -->
                        <el-form-item label="支付方式">
                            <el-radio-group v-model="paymentMethod">
                                <el-radio label="alipay" disabled>支付宝 (暂不可用)</el-radio>
                                <el-radio label="wechat" disabled>微信支付 (暂不可用)</el-radio>
                                <el-radio label="mock">模拟支付</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="handlePay" :loading="paying">确认支付</el-button>
                            <el-button @click="handleBack" :disabled="paying">返回</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <!-- 订单信息加载失败或不存在 -->
                <div v-else class="error-state">
                    <p>未能加载订单信息，请稍后再试或联系客服。</p>
                    <el-button @click="fetchOrderDetail">重试</el-button>
                     <el-button @click="handleBack">返回订单列表</el-button>
                </div>
            </div>
        </main>

        <Footer />

        <!-- 支付结果对话框 (移到 Footer 之后，虽然在DOM结构中靠后，但视觉上会覆盖) -->
        <el-dialog v-model="dialogVisible" :title="dialogTitle" width="300px" center>
            <span>{{ dialogMessage }}</span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="handleDialogConfirm">
                        {{ dialogConfirmText }}
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';

import { ref, onMounted, computed } from 'vue';
import { getOrderDetail, payOrder } from '@/api/order'; // 确认 API 路径
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElDialog, ElForm, ElFormItem, ElRadioGroup, ElRadio, ElButton } from 'element-plus'; // 引入所需 Element Plus 组件

const route = useRoute();
const router = useRouter();
const order = ref(null);
const loading = ref(true); // 添加加载状态
const paying = ref(false); // 添加支付中状态
const paymentMethod = ref('mock'); // 默认支付方式
const dialogVisible = ref(false);
const dialogTitle = ref('');
const dialogMessage = ref('');
const dialogConfirmText = ref('确认');
const isPaymentSuccess = ref(false); // 标记支付是否成功

// 从路由参数获取订单ID
const orderId = computed(() => route.params.id);
// 从路由参数获取产品ID（如果需要跳转回去）
// 注意：支付页面可能没有 productId 参数，需要确认来源
// 如果是从订单列表跳转过来，可能没有 productId
// const productId = computed(() => route.params.productId);

onMounted(() => {
    if (orderId.value) {
        fetchOrderDetail();
    } else {
        ElMessage.error('无效的订单ID');
        loading.value = false;
        // 可以选择跳转回列表页
        // router.replace({ name: 'OrderList' });
    }
});

const fetchOrderDetail = () => {
    loading.value = true;
    order.value = null; // 重置订单信息
    getOrderDetail(orderId.value)
        .then(res => {
            if (res.data && res.data.data) {
                order.value = res.data.data;
            } else {
                // 处理后端返回数据结构不符合预期的情况
                throw new Error('订单数据格式错误');
            }
        })
        .catch(err => {
            console.error("Error fetching order detail:", err);
            ElMessage.error('加载订单信息失败');
            order.value = null; // 确保加载失败时 order 为 null
        })
        .finally(() => {
            loading.value = false;
        });
};

const handlePay = () => {
    if (paying.value) return; // 防止重复点击

    if (paymentMethod.value === 'mock') {
        handleMockPayment();
    } else {
        ElMessage.warning('暂不支持该支付方式，请选择模拟支付');
    }
};

const handleMockPayment = async () => {
    if (!order.value || !order.value.id) {
        ElMessage.error('订单信息无效，无法支付');
        return;
    }
    paying.value = true;
    isPaymentSuccess.value = false; // 重置状态

    try {
        // 调用后端 API 更新订单状态
        await payOrder(order.value.id);
        // 支付成功
        isPaymentSuccess.value = true;
        dialogTitle.value = '支付成功';
        dialogMessage.value = '您的订单已支付成功！';
        dialogConfirmText.value = '查看订单'; // 或 "返回首页" 等
        dialogVisible.value = true;

    } catch (error) {
        // 支付失败
        console.error("Error processing payment:", error);
        isPaymentSuccess.value = false;
        dialogTitle.value = '支付失败';
        dialogMessage.value = `支付处理失败，请稍后重试。(${error.message || '未知错误'})`;
        dialogConfirmText.value = '确认';
        dialogVisible.value = true;
    } finally {
        paying.value = false;
    }
};

// 处理对话框确认按钮点击
const handleDialogConfirm = () => {
    dialogVisible.value = false;
    if (isPaymentSuccess.value) {
        // 支付成功后跳转到订单详情页或订单列表页
        router.push({ name: 'OrderDetail', params: { id: orderId.value } }); // 假设有订单详情页
        // 或者跳转回订单列表
        // router.push({ name: 'OrderList' });
    } else {
        // 支付失败，用户点击确认后留在当前页面或提供其他操作
    }
};


const handleBack = () => {
    // 可以根据来源决定返回哪里，例如订单列表
    router.push({ name: 'OrderList' });
    // 或者使用 router.go(-1) 返回上一页，但可能不准确
    // router.go(-1);
};
</script>

<style scoped>
/* 3. 添加粘性页脚基础样式 */
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex-grow: 1;
}

/* 保留原有样式并优化 */
.order-pay-view {
  padding: 20px;
  max-width: 800px; /* 限制最大宽度 */
  margin: 20px auto; /* 上下边距和左右自动居中 */
  background-color: #fff; /* 添加白色背景 */
  border-radius: 8px; /* 添加圆角 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 添加轻微阴影 */
}

h2 {
    text-align: center;
    margin-bottom: 25px;
    color: #333;
}

.loading-state, .error-state {
    text-align: center;
    padding: 40px 20px;
    color: #666;
}

.order-info {
  border: 1px solid #e0e0e0; /* 边框颜色调整 */
  padding: 25px;
  margin-bottom: 25px;
  border-radius: 6px; /* 内部信息区也加圆角 */
  background-color: #f9f9f9; /* 轻微背景色区分 */
}
.order-info p {
    margin-bottom: 12px; /* 调整行间距 */
    font-size: 15px;
    color: #555;
}
.order-info p strong {
    display: inline-block;
    width: 90px; /* 标签宽度对齐 */
    color: #333;
}
.price {
    font-size: 1.1em;
    font-weight: bold;
    color: #e44d26; /* 价格颜色 */
}

.el-form {
    margin-top: 30px; /* 表单与订单信息间距 */
}

.el-form-item {
    margin-bottom: 20px; /* 表单项间距 */
}

/* 可以给按钮组加点间距 */
.el-form-item .el-button + .el-button {
    margin-left: 15px;
}
</style>