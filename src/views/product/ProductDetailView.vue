<template>
    <!-- 1. 添加 page-container 作为 Flex 容器，并保留 product-list-page 类 -->
    <div class="page-container product-list-page">
        <Header />

        <!-- 2. 将 ProductDetail 包裹在 main.main-content 中 -->
        <main class="main-content">
            <div> <!-- 这个 div 可以保留，也可以直接放 ProductDetail -->
                <ProductDetail :id="productId"></ProductDetail>
            </div>
        </main>

        <Footer />
    </div>
</template>

<script setup>
import { computed } from 'vue'; // 引入 computed
import { useRoute } from 'vue-router'; // 引入 useRoute
import ProductDetail from '@/components/product/ProductDetail.vue';
import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';

// 使用 useRoute 获取当前路由信息
const route = useRoute();

// 使用 computed 来获取 id，确保类型正确（通常 id 是数字）
// 并且这样写更符合 Vue 3 的响应式理念
const productId = computed(() => {
    // 从路由参数中获取 id，并尝试转换为数字
    const idParam = route.params.id;
    const id = parseInt(idParam, 10); // 使用 parseInt 转换为数字，指定基数 10
    // 如果转换失败（例如 idParam 不是有效的数字字符串），返回 null 或 0，或者进行错误处理
    return isNaN(id) ? null : id;
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
  /* 可以给产品详情区域添加一些内边距 */
  /* padding: 20px 0; */
}

/* 保留 .product-list-page 的样式（如果它有特定样式） */
.product-list-page {
  /* ... 你原有的 product-list-page 样式 ... */
}

/* 如果需要，可以为包裹 ProductDetail 的 div 添加样式 */
/* .main-content > div { */
  /* max-width: 1200px; */ /* 例如，限制最大宽度 */
  /* margin: 0 auto; */    /* 居中 */
/* } */
</style>