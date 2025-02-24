<template>
    <div>
        <h2>创建行程</h2>
        <ItineraryForm @submit="handleSubmit" @cancel="handleCancel"></ItineraryForm>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import ItineraryForm from '@/components/itinerary/ItineraryForm.vue'
import { createItinerary } from '@/api/itinerary';
import { ElMessage } from 'element-plus';
const router = useRouter();

const handleSubmit = (itineraryData) => {
    createItinerary(itineraryData).then(res => {
        ElMessage.success("创建成功")
        router.push({ name: 'ItineraryList' })
    }).catch(err => {
        console.log(err);
    })
}
const handleCancel = () => {
    router.push({ name: 'ItineraryList' })
}
</script>

<style scoped></style>