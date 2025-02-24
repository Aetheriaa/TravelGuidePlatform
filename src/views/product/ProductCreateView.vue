<template>
    <div class="product-list-page">
        <Header />
        <div class="product-view">
            <h2>创建新产品</h2>
            <ProductForm @submit="handleSubmit" @cancel="handleCancel"></ProductForm>
        </div>
        <Footer />
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import ProductForm from '@/components/product/ProductForm.vue';
import { createProduct } from '@/api/product';
import { ElMessage } from 'element-plus';
import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';

const router = useRouter();

const handleSubmit = (productData) => {
    console.log(productData)
    createProduct(productData)
        .then(() => {
            ElMessage.success('产品发布成功');
            router.push({ name: 'ProductList' });
        })
        .catch(error => {
            console.error("Error creating product:", error);
            ElMessage.error("发布失败");
        });
};

const handleCancel = () => {
    router.push({ name: 'ProductList' });
};
</script>

<style scoped>
.product-view {
    padding: 20px;
}
</style>