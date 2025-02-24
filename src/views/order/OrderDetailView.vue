<template>
    <div>
        <order-detail :id="$route.params.id"></order-detail>
    </div>
</template>

<script setup>
import OrderDetail from '@/components/order/OrderDetail.vue'
</script>

<style scoped></style>