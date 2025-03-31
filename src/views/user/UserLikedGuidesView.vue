<template>
    <!-- 1. 添加 page-container 作为 Flex 容器 -->
    <div class="page-container">
        <Header />

        <!-- 2. 将 UserLikedGuides 包裹在 main.main-content 中 -->
        <main class="main-content">
            <div>
                <UserLikedGuides></UserLikedGuides>
            </div>
        </main>

        <Footer />
    </div>
</template>

<script>
// 导入所需组件
import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';
import UserLikedGuides from '@/components/user/UserLikedGuides.vue';

// 使用 Options API 导出组件定义
export default {
    name: 'UserLikedGuidesView', // 建议给视图组件一个明确的名称
    components: {
        Header,
        Footer,
        UserLikedGuides
    }
    // 这里可以添加 data, methods, computed, mounted 等选项
}
</script>

<style scoped> /* 移除 lang="scss" 如果你不需要 SCSS 特定语法 */
/* 或者保留 lang="scss" scoped 如果你确实在使用 SCSS */
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