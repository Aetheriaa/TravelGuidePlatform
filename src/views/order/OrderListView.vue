<template>

    <div class="home-container">
        <Header />
        <Banner v-if="showBanner" :banners="banners" />
        <div>
            <order-list></order-list>
        </div>
        <Footer />
    </div>
</template>

<script setup>
import OrderList from '@/components/order/OrderList.vue'
import Header from '@/components/layout/Header.vue';
import Banner from '@/components/layout/Banner.vue';
import Footer from '@/components/layout/Footer.vue';
</script>

<style scoped></style>