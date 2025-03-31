<template>
    <!-- 1. 添加 page-container 作为 Flex 容器 -->
    <div class="page-container">
        <Header />

        <!-- 2. 将 UserFavoriteGuides 包裹在 main.main-content 中 -->
        <main class="main-content">
            <div>
                <UserFavoriteGuides></UserFavoriteGuides>
            </div>
        </main>

        <Footer />
    </div>
</template>

<script>
// 导入所需组件
import Header from '@/components/layout/Header.vue';        // 导入 Header
import Footer from '@/components/layout/Footer.vue';        // 导入 Footer
import UserFavoriteGuides from '@/components/user/UserFavoriteGuides.vue'; // 导入主要内容组件

// 使用 Options API 导出组件定义
export default {
    name: 'UserFavoriteGuidesView', // 建议给视图组件一个明确的名称
    components: {
        Header,                 // 注册 Header 组件
        Footer,                 // 注册 Footer 组件
        UserFavoriteGuides      // 注册 UserFavoriteGuides 组件
    }
    // 这里可以根据需要添加 data, methods, computed, mounted 等选项
}
</script>

<style scoped> /* 可以保留 lang="scss" 如果需要 SCSS 特性 */
/* 3. 添加粘性页脚所需的 CSS */
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* 确保容器至少和视口一样高 */
}

.main-content {
  flex-grow: 1; /* 让主内容区域伸展以填满剩余空间 */
  /* 可以根据需要为内容区域添加内边距 */
  /* padding: 20px 0; */
}
</style>