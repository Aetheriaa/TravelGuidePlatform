<template>
    <div v-if="product" class="product-detail">
        <el-row :gutter="20">
            <el-col :span="8">
                <div class="image-wrapper">
                    <img v-if="product.image" :src="product.image" alt="产品图片" class="product-image">
                    <div v-else class="no-image">暂无图片</div>
                </div>
            </el-col>
            <el-col :span="16">
                <el-descriptions title="产品详情" :column="1" border>
                    <el-descriptions-item label="产品名称">{{ product.name }}</el-descriptions-item>
                    <el-descriptions-item label="类型">{{ product.type }}</el-descriptions-item>
                    <el-descriptions-item label="价格">￥{{ product.price }}</el-descriptions-item>
                    <el-descriptions-item label="库存">{{ product.stock }}</el-descriptions-item>
                    <el-descriptions-item label="供应商">{{ product.supplier }}</el-descriptions-item>
                    <el-descriptions-item label="创建时间">{{ formatDate(product.createTime) }}</el-descriptions-item>
                    <el-descriptions-item label="状态">{{ product.status === 1 ? '上架' : '下架' }}</el-descriptions-item>
                    <el-descriptions-item label="描述">
                        <div class="product-description">{{ product.description }}</div>
                    </el-descriptions-item>
                </el-descriptions>

                <!-- 购买数量 -->
                <el-form :inline="true" :model="order" class="buy-form">
                    <el-form-item label="购买数量">
                        <el-input-number v-model="order.quantity" :min="1" :max="product.stock"></el-input-number>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleBuy" :disabled="product.stock <= 0 || !isLoggedIn">
                            {{ product.stock <= 0 ? '已售罄' : '立即购买' }} </el-button>
                    </el-form-item>
                </el-form>
                <!-- 管理员 -->
                <div class="actions" v-if="isAdmin">
                    <router-link :to="{ name: 'ProductUpdate', params: { id: product.id } }">
                        <el-button type="primary">编辑</el-button>
                    </router-link>
                </div>
            </el-col>
        </el-row>
    </div>
    <div v-else>
        Loading...
    </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue';
import { getProductDetail } from '@/api/product';
import { createOrder } from '@/api/order'; // 导入创建订单的 API
import { useRoute, useRouter } from 'vue-router';
import { formatDate } from '@/utils/date';
import { useUserStore } from '@/stores/user';
import { ElMessage } from 'element-plus';

const route = useRoute();
const router = useRouter();
const product = ref(null);
const userStore = useUserStore();

// 计算属性：判断当前用户是否是管理员
const isAdmin = computed(() => {
    return userStore.isLoggedIn && userStore.currentUser && userStore.currentUser.role === 'admin';
});
//是否登录
const isLoggedIn = computed(() => userStore.isLoggedIn)
// 订单数据
const order = reactive({
    productId: null,
    quantity: 1, // 默认购买数量为 1
});

onMounted(() => {
    fetchProductDetail();
});

const fetchProductDetail = () => {
    getProductDetail(route.params.id)
        .then(response => {
            product.value = response.data.data;
            // 将产品ID赋值
            order.productId = product.value.id
        })
        .catch(error => {
            console.error("Error fetching product detail:", error);
            ElMessage.error('获取数据失败')
        });
};

// 购买按钮点击事件
const handleBuy = async () => {
    if (!userStore.isLoggedIn) {
        ElMessage.warning('请先登录');
        router.push('/login'); // 跳转到登录页
        return;
    }
    // 创建订单
    try {
        const response = await createOrder(order); //  await
        const orderId = response.data.data.id; //  获取订单 ID
        ElMessage.success('订单创建成功');
        router.push({ name: 'OrderPay', params: { id: orderId, productId: product.value.id } });
        // router.push({ name: 'OrderPay', params: { id: orderId } }); // 跳转到支付页面，并传递订单 ID
    } catch (error) {
        console.error("Error creating order:", error);
        if (error.response && error.response.data && error.response.data.msg) {
            ElMessage.error(error.response.data.msg);
        } else {
            ElMessage.error('创建订单失败');
        }
    }
};
</script>

<style scoped>
.product-detail {
    padding: 20px;
}

/* 添加图片样式 */
.image-wrapper {
    width: 100%;
    height: 300px;
    /* 或者你希望的高度 */
    margin-bottom: 20px;
}

.product-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.no-image {
    width: 100%;
    height: 300px;
    background-color: #f0f0f0;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #999;
}

.product-description {
    white-space: pre-line;
    /* 保留换行和空格 */
}

.actions {
    margin-top: 20px;
}

/* 购买表单样式 */
.buy-form {
    margin-top: 20px;
}
</style>