<template>
    <div>
        <h2>编辑行程</h2>
        <ItineraryForm :isEdit="true" :itineraryData="itinerary" @submit="handleSubmit" @cancel="handleCancel">
        </ItineraryForm>
    </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import ItineraryForm from '@/components/itinerary/ItineraryForm.vue'
import { updateItinerary, getItinerary } from '@/api/itinerary';
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';

const router = useRouter();
const route = useRoute()
const itinerary = ref({})

onMounted(() => {
    getItinerary(route.params.id).then(res => {
        itinerary.value = res.data.data
        //转换时间
        itinerary.value.startDate = formatDate(itinerary.value.startDate)
        itinerary.value.endDate = formatDate(itinerary.value.endDate)
        // console.log(itinerary.value);
    }).catch(err => {
        console.log(err);
    })
})
const handleSubmit = (itineraryData) => {
    itineraryData.id = parseInt(route.params.id)
    updateItinerary(itineraryData).then(res => {
        ElMessage.success("修改成功")
        router.push({ name: 'ItineraryList' })
    }).catch(err => {
        console.log(err);
    })
}
const handleCancel = () => {
    router.push({ name: 'ItineraryList' })
}
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}
</script>

<style scoped></style>