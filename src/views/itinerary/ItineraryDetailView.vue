<template>
    <!-- 1. 添加 page-container 类作为 Flex 容器 -->
    <div class="page-container">
        <Header />

        <!-- 2. 使用 main 标签包裹主要内容区域 -->
        <main class="main-content">
            <!-- 将 ItineraryDetail 放在 main 内部 -->
            <ItineraryDetail />
        </main>

        <Footer />
    </div>
</template>

<script setup>
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import ItineraryDetail from '@/components/itinerary/ItineraryDetail.vue' // 确保这个组件路径正确
</script>

<style scoped>
/* 3. 添加与创建页面相同的粘性页脚 CSS */
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* 确保容器至少和视口一样高 */
}

.main-content {
  flex-grow: 1; /* 让主内容区域占据所有剩余空间，将 Footer 推到底部 */
  /* 可以根据需要给详情区域添加一些内边距 */
  /* padding: 20px; */
}
</style>