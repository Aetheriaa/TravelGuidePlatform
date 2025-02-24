<template>
    <div class="home-container">
        <Header />
        <Banner v-if="showBanner" :banners="banners" />
        <div>
            <ItineraryList></ItineraryList>
        </div>
        <Footer />
    </div>
</template>

<script setup>

import Header from '@/components/layout/Header.vue';
import Banner from '@/components/layout/Banner.vue';
import Footer from '@/components/layout/Footer.vue';
import ItineraryList from '@/components/itinerary/ItineraryList.vue'; // 导入 ItineraryList 组件

</script>