<template>
    <!-- 1. 添加 page-container 作为 Flex 容器 -->
    <div class="page-container">
        <Header />

        <!-- 2. 将 OrderDetail 包裹在 main.main-content 中 -->
        <main class="main-content">
            <div> <!-- 这个 div 可以保留 -->
                <order-detail :id="orderId"></order-detail> <!-- 绑定计算属性 -->
            </div>
        </main>

        <Footer />
    </div>
</template>

<script setup>
import { computed } from 'vue';        // 引入 computed
import { useRoute } from 'vue-router'; // 引入 useRoute
import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';
import OrderDetail from '@/components/order/OrderDetail.vue';

// 使用 useRoute 获取当前路由信息
const route = useRoute();

// 使用 computed 获取订单 ID，确保类型正确
const orderId = computed(() => {
    const idParam = route.params.id;
    const id = parseInt(idParam, 10);
    return isNaN(id) ? null : id; // 如果不是有效数字则返回 null
});

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
  /* 可以为订单详情区域添加一些样式 */
  /* 例如，限制最大宽度并居中 */
  /* padding: 20px 0; */
}

/* 可以为 .main-content > div 添加样式 */
/* .main-content > div {
    max-width: 1000px;
    margin: 20px auto;
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
} */
</style>