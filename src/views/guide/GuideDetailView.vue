<template>
    <div class="home-container">
        <Header />
        <div>
            <GuideDetail :id="route.params.id"></GuideDetail>
        </div>
        <Footer />
    </div>
</template>

<script setup>
import GuideDetail from '@/components/guide/GuideDetail.vue'
import { useRoute } from 'vue-router';
import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';
const route = useRoute();
</script>