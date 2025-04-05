<template>
    <div class="analysis-view">
        <h2>数据分析</h2>

        <!-- 时间范围选择 -->
        <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期" @change="fetchData" value-format="YYYY-MM-DD">
        </el-date-picker>

        <el-row :gutter="20">
            <el-col :span="24">
                <el-card shadow="hover" class="chart-card">
                    <div ref="userGrowthChart" style="width: 100%; height: 400px;"></div>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="hover" class="chart-card">
                    <div ref="guidePublishChart" style="width: 100%; height: 400px;"></div>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="hover" class="chart-card">
                    <div ref="itineraryCreateChart" style="width: 100%; height: 400px;"></div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { getUserGrowth, getGuidePublish, getItineraryCreate } from '@/api/analysis'; // 导入 API
import * as echarts from 'echarts';

const dateRange = ref([]);
const userGrowthChart = ref(null);
const guidePublishChart = ref(null);
const itineraryCreateChart = ref(null);

let userGrowthChartInstance = null;
let guidePublishChartInstance = null;
let itineraryCreateChartInstance = null;

onMounted(() => {
    fetchData();
});

// 监听日期范围变化
watch(dateRange, () => {
    fetchData();
}, { deep: true });

const fetchData = async () => {
    const params = {};
    if (dateRange.value && dateRange.value.length === 2) {
        params.startDate = dateRange.value[0];
        params.endDate = dateRange.value[1];
    }

    try {
        const [userGrowthRes, guidePublishRes, itineraryCreateRes] = await Promise.all([
            getUserGrowth(params),
            getGuidePublish(params),
            getItineraryCreate(params)
        ]);

        renderUserGrowthChart(userGrowthRes.data.data);
        renderGuidePublishChart(guidePublishRes.data.data);
        renderItineraryCreateChart(itineraryCreateRes.data.data);

    } catch (error) {
        console.error("Error fetching analysis data:", error);
    }
};

// 渲染用户增长趋势图表
const renderUserGrowthChart = (data) => {
    if (!userGrowthChart.value) return;
    if (userGrowthChartInstance) userGrowthChartInstance.dispose();
    userGrowthChartInstance = echarts.init(userGrowthChart.value);

    const option = {
        title: { text: '用户增长趋势' },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: data.map(item => item.date) },
        yAxis: { type: 'value' },
        series: [{ data: data.map(item => item.new_users), type: 'line' }]
    };
    userGrowthChartInstance.setOption(option);
};
// 渲染攻略发布趋势图表
const renderGuidePublishChart = (data) => {
    if (!guidePublishChart.value) return;
    if (guidePublishChartInstance) guidePublishChartInstance.dispose();
    guidePublishChartInstance = echarts.init(guidePublishChart.value);

    const option = {
        title: { text: '攻略发布趋势' },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: data.map(item => item.date) },
        yAxis: { type: 'value' },
        series: [{ name: '新增攻略数', data: data.map(item => item.new_guides), type: 'bar' }]
    };
    guidePublishChartInstance.setOption(option);
};
// 渲染行程创建趋势图表
const renderItineraryCreateChart = (data) => {
    if (!itineraryCreateChart.value) return;
    if (itineraryCreateChartInstance) itineraryCreateChartInstance.dispose();
    itineraryCreateChartInstance = echarts.init(itineraryCreateChart.value);

    const option = {
        title: { text: '行程创建趋势' },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: data.map(item => item.date) },
        yAxis: { type: 'value' },
        series: [{ name: '新增行程数', data: data.map(item => item.new_itineraries), type: 'line', smooth: true }]
    };
    itineraryCreateChartInstance.setOption(option);
};

// 监听窗口大小变化，调整图表大小
window.addEventListener('resize', () => {
    if (userGrowthChartInstance) userGrowthChartInstance.resize();
    if (guidePublishChartInstance) guidePublishChartInstance.resize();
    if (itineraryCreateChartInstance) itineraryCreateChartInstance.resize();
});
</script>

<style scoped>
.analysis-view {
    padding: 20px;
}

.chart-card {
    margin-top: 20px;
}
</style>