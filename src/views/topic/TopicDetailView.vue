<template>
    <Header />
    <TopicDetail></TopicDetail>
    <Footer />
</template>

<script setup>

import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';
import TopicDetail from '@/components/topic/TopicDetail.vue';


</script>

<style scoped>
.topic-detail-view {
    padding: 20px;
}

.topic-content {
    margin-top: 20px;
    /* 可以根据需要添加更多样式 */
}
</style>