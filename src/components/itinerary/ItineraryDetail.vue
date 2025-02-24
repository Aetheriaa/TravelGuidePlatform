<template>
    <div v-if="itinerary" class="itinerary-detail">
        <h2>{{ itinerary.name }}</h2>
        <p>开始日期：{{ formatDate(itinerary.startDate) }}</p>
        <p>结束日期：{{ formatDate(itinerary.endDate) }}</p>
        <p>描述：{{ itinerary.description }}</p>

        <h3>行程详情</h3>
        <!-- 使用 v-for 和计算属性按天分组显示行程详情 -->
        <div v-for="(details, day) in groupedDetails" :key="day" class="day-section">
            <h4>第 {{ day }} 天</h4>
            <el-table :data="details" style="width: 100%">
                <el-table-column prop="type" label="类型" width="120"></el-table-column>
                <el-table-column prop="itemId" label="项目ID" width="120"></el-table-column>
                <el-table-column prop="startTime" label="开始时间"></el-table-column>
                <el-table-column prop="endTime" label="结束时间"></el-table-column>
                <el-table-column prop="notes" label="备注"></el-table-column>
            </el-table>
        </div>
        <router-link :to="{ name: 'ItineraryUpdate', params: { id: itinerary.id } }">
            <el-button type="primary">编辑</el-button>
        </router-link>
    </div>
    <div v-else>
        Loading...
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { getItinerary } from '@/api/itinerary';
import { useRoute } from 'vue-router';
import { formatDate } from '@/utils/date';

const route = useRoute();
const itinerary = ref(null);

onMounted(() => {
    fetchItineraryDetail();
});

const fetchItineraryDetail = () => {
    getItinerary(route.params.id)
        .then(response => {
            itinerary.value = response.data.data;
            console.log(itinerary.value);
        })
        .catch(error => {
            console.error("Error fetching itinerary detail:", error);
        });
};

// 计算属性：按天分组行程详情
const groupedDetails = computed(() => {
    if (!itinerary.value || !itinerary.value.details) {
        return {};
    }
    const grouped = {};
    itinerary.value.details.forEach(detail => {
        if (!grouped[detail.day]) {
            grouped[detail.day] = [];
        }
        grouped[detail.day].push(detail);
    });
    return grouped;
});
</script>

<style scoped>
.itinerary-detail {
    padding: 20px;
}

.day-section {
    margin-bottom: 20px;
}
</style>