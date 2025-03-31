<template>
    <!-- 1. 添加 page-container 作为 Flex 容器 -->
    <div class="page-container">
        <Header />

        <!-- 2. 将 UserGuideHistory 包裹在 main.main-content 中 -->
        <main class="main-content">
            <div>
                <UserGuideHistory></UserGuideHistory>
            </div>
        </main>

        <Footer />
    </div>
</template>

<script>
// 导入所需组件
import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';
import UserGuideHistory from '@/components/user/UserGuideHistory.vue';

// 使用 Options API 导出组件定义
export default {
    name: 'UserGuideHistoryView', // 建议给视图组件一个明确的名称
    components: {
        Header,
        Footer,
        UserGuideHistory
    }
    // 这里可以添加 data, methods, computed, mounted 等选项
}
</script>

<style scoped>
/* 3. 添加粘性页脚所需的 CSS */
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex-grow: 1;
  /* 可以根据需要为内容区域添加内边距 */
  /* padding: 20px 0; */
}
</style>