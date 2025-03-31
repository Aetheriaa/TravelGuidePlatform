<template>
    <!-- 1. 使用 page-container 作为 Flex 容器 -->
    <div class="page-container product-list-page"> <!-- 保留了原有的 product-list-page 类，以防有其他样式依赖 -->
        <Header />

        <!-- 2. 将主要内容（包含 .product-view 的 div）包裹在 main.main-content 中 -->
        <main class="main-content">
            <div class="product-view">
                <h2>创建新产品</h2>
                <ProductForm @submit="handleSubmit" @cancel="handleCancel"></ProductForm>
            </div>
        </main>

        <Footer />
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import ProductForm from '@/components/product/ProductForm.vue';
import { createProduct } from '@/api/product'; // 确认 API 路径正确
import { ElMessage } from 'element-plus';
import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';

const router = useRouter();

const handleSubmit = (productData) => {
    console.log("Submitting product data:", productData); // 方便调试
    createProduct(productData)
        .then(() => {
            ElMessage.success('产品发布成功');
            router.push({ name: 'ProductList' }); // 确认路由名称 'ProductList' 正确
        })
        .catch(error => {
            console.error("Error creating product:", error);
            ElMessage.error("发布失败，请检查信息或稍后重试"); // 给出更具体的错误提示
        });
};

const handleCancel = () => {
    router.push({ name: 'ProductList' }); // 确认路由名称 'ProductList' 正确
};
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
}

/* 保留你原有的 .product-view 样式 */
.product-view {
    padding: 20px;
    /* 可以添加 max-width 和 margin: auto 来让表单居中并限制宽度 */
    max-width: 800px; /* 例如，最大宽度 800px */
    margin-left: auto;
    margin-right: auto;
}

/* 如果 .product-list-page 还有其他特定样式，也保留在这里 */
.product-list-page {
    /* ... 其他样式 ... */
}
</style>