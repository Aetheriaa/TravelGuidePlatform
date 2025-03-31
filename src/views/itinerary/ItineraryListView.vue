<template>
    <!-- 1. 使用 page-container 作为 Flex 容器 -->
    <div class="page-container">
        <Header />

        <!-- 2. 将 ItineraryList 包裹在 main-content 中 -->
        <main class="main-content">
            <div>
                <ItineraryList></ItineraryList>
            </div>
        </main>

        <Footer />
    </div>
</template>

<script setup>
// 只导入需要的组件
import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';
import ItineraryList from '@/components/itinerary/ItineraryList.vue'; // 导入 ItineraryList 组件

</script>

<style scoped>
/* 3. 添加粘性页脚的 CSS */
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex-grow: 1;
  /* 可以根据需要给列表区域添加内边距 */
  /* padding: 20px 0; */
}

/* 如果你之前使用了 .home-container 并有其他样式，需要相应调整 */
/* 例如，可以将 .home-container 的样式合并到 .page-container */
/* .page-container { ...其他 home-container 的样式... } */

</style>