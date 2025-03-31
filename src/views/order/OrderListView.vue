<template>
    <!-- 1. 使用 page-container 作为 Flex 容器 -->
    <div class="page-container">
        <Header />

        <!-- 2. main-content 包裹主要内容区域 -->
        <main class="main-content">
            <!-- 这里只保留你的 OrderList 组件 -->
            <div>
                <order-list></order-list>
            </div>
        </main>

        <Footer />
    </div>
</template>

<script setup>
// 只导入这个视图实际需要的组件
import OrderList from '@/components/order/OrderList.vue'
import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';

// Banner 相关的导入和变量已移除
</script>

<style scoped>
/* 3. 应用粘性页脚的 CSS */
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex-grow: 1;
  /* 如果需要，可以给订单列表区域加点上下内边距 */
  /* padding-top: 20px; */
  /* padding-bottom: 20px; */
}

/* 移除 .home-container 相关样式（如果你之前用的是这个类名且不再需要） */
/* 或者保留 .home-container 的其他特定样式 */

</style>