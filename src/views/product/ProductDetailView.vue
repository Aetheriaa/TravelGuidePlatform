<template>
    <div class="product-list-page">
        <Header />
        <div>
            <ProductDetail :id="$route.params.id"></ProductDetail>
        </div>
        <Footer />
    </div>
</template>

<script setup>
import ProductDetail from '@/components/product/ProductDetail.vue';
import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';
</script>