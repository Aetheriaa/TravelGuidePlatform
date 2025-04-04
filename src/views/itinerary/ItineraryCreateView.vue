<template>
    <!-- 1. 添加 page-container 类作为 Flex 容器 -->
    <div class="page-container">
        <Header />
        <h2>创建行程</h2>

        <!-- 2. 使用 main 标签包裹主要内容区域 -->
        <main class="main-content">
            <!-- 将 ItineraryForm 放在 main 内部 -->
            <div>
                <ItineraryForm @submit="handleSubmit" @cancel="handleCancel"></ItineraryForm>
            </div>
        </main>

        <Footer />
    </div>
</template>

<script setup>
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import { useRouter } from 'vue-router';
import ItineraryForm from '@/components/itinerary/ItineraryForm.vue'
import { createItinerary } from '@/api/itinerary'; // 假设你的 API 调用函数路径正确
import { ElMessage } from 'element-plus';

const router = useRouter();

const handleSubmit = (itineraryData) => {
    createItinerary(itineraryData).then(res => {
        ElMessage.success("创建成功");
        // 假设 'ItineraryList' 是你的行程列表路由名称
        router.push({ name: 'ItineraryList' });
    }).catch(err => {
        console.error("创建行程失败:", err); // 使用 console.error 更合适
        ElMessage.error("创建失败，请稍后重试"); // 给用户更明确的错误提示
    });
}

const handleCancel = () => {
    // 假设 'ItineraryList' 是你的行程列表路由名称
    router.push({ name: 'ItineraryList' });
}
</script>

<style scoped>
/* 3. 添加粘性页脚所需的 CSS */
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex-grow: 1;
  /* 可以根据需要给表单区域添加一些内边距 */
  /* padding: 20px; */
}
</style>