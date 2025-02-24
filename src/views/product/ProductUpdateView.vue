<template>
    <div class="product-view">
        <h2>编辑产品信息</h2>
        <ProductForm v-if="product && product.id" :isEdit="true" :productData="product" @submit="handleSubmit"
            @cancel="handleCancel"></ProductForm>
        <div v-else>
            加载产品信息中...
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import ProductForm from '@/components/product/ProductForm.vue';
import { updateProduct, getProductDetail } from '@/api/product';
import { ElMessage } from 'element-plus';

const router = useRouter();
const route = useRoute();
const product = ref({});

onMounted(() => {
    fetchProductDetail();
});

const fetchProductDetail = () => {
    getProductDetail(route.params.id)
        .then(response => {
            product.value = response.data.data;
        })
        .catch(error => {
            console.error("Error fetching product detail:", error);
            ElMessage.error("获取详情失败");
        });
};

const handleSubmit = (productData) => {
    productData.id = parseInt(route.params.id)
    updateProduct(productData)
        .then(() => {
            ElMessage.success('产品更新成功');
            router.push({ name: 'ProductList' });
        })
        .catch(error => {
            console.error("Error updating product:", error);
            ElMessage.error("更新失败");
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