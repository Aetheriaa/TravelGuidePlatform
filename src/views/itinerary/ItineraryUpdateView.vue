<template>
    <!-- 1. 添加 page-container 作为 Flex 容器 -->
    <div class="page-container">
        <Header />

        <!-- 2. 将标题和表单包裹在 main.main-content 中 -->
        <main class="main-content">
            <div class="form-wrapper"> <!-- 添加一个 wrapper 以便控制表单区域样式 -->
                <h2>编辑行程</h2>
                <!-- 添加 v-if="itinerary.id" 确保在数据加载后再渲染表单 -->
                <ItineraryForm
                    v-if="itinerary.id"
                    :isEdit="true"
                    :itineraryData="itinerary"
                    @submit="handleSubmit"
                    @cancel="handleCancel"
                >
                </ItineraryForm>
                 <!-- 可以添加一个加载状态提示 -->
                <div v-else>
                    加载中...
                </div>
            </div>
        </main>

        <Footer />
    </div>
</template>

<script setup>
import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';
import { useRouter, useRoute } from 'vue-router';
import ItineraryForm from '@/components/itinerary/ItineraryForm.vue';
import { updateItinerary, getItinerary } from '@/api/itinerary'; // 确认 API 路径
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';

const router = useRouter();
const route = useRoute();
const itinerary = ref({}); // 初始化为空对象

// 提取日期格式化函数
const formatDate = (dateString) => {
    if (!dateString) return ''; // 处理空日期字符串
    try {
        const date = new Date(dateString);
        // 检查日期是否有效
        if (isNaN(date.getTime())) {
            console.warn("Invalid date string received:", dateString);
            return ''; // 返回空字符串或原始字符串
        }
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    } catch (error) {
        console.error("Error formatting date:", dateString, error);
        return ''; // 出错时返回空
    }
};


onMounted(() => {
    const itineraryId = route.params.id;
    if (!itineraryId) {
        ElMessage.error("无效的行程ID");
        router.push({ name: 'ItineraryList' }); // 或者跳转到错误页/列表页
        return;
    }
    getItinerary(itineraryId)
        .then(res => {
            if (res.data && res.data.data) {
                 // 确保对存在的数据进行处理
                const data = res.data.data;
                itinerary.value = {
                    ...data,
                    // 在赋值时进行日期格式化
                    startDate: formatDate(data.startDate),
                    endDate: formatDate(data.endDate)
                };
                 // 检查格式化后的值，如果为空或无效，可能需要通知用户或使用默认值
                // if (!itinerary.value.startDate || !itinerary.value.endDate) {
                //    ElMessage.warning("行程日期格式有误，请检查");
                // }
            } else {
                ElMessage.error("未能获取到行程数据");
                router.push({ name: 'ItineraryList' });
            }
        })
        .catch(err => {
            console.error("获取行程详情失败:", err);
            ElMessage.error("获取行程详情失败");
            router.push({ name: 'ItineraryList' }); // 出错也跳转走
        });
});

const handleSubmit = (itineraryData) => {
    const itineraryId = parseInt(route.params.id);
     if (isNaN(itineraryId)) {
        ElMessage.error("无效的行程ID");
        return;
    }
    // 确保提交的数据包含 ID
    const dataToUpdate = { ...itineraryData, id: itineraryId };

    // 注意：如果 ItineraryForm 返回的日期已经是 'YYYY-MM-DD' 格式，则无需再处理
    // 如果返回的是 Date 对象或其他格式，可能需要在这里转换回后端需要的格式
    // 例如： dataToUpdate.startDate = backendFormatDate(itineraryData.startDate);

    updateItinerary(dataToUpdate)
        .then(res => {
            ElMessage.success("修改成功");
            router.push({ name: 'ItineraryList' }); // 确认路由名称正确
        })
        .catch(err => {
            console.error("更新行程失败:", err);
            ElMessage.error("修改失败，请稍后重试");
        });
};

const handleCancel = () => {
    router.push({ name: 'ItineraryList' }); // 确认路由名称正确
};

</script>

<style scoped>
/* 3. 添加粘性页脚基础样式 */
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex-grow: 1;
}

/* 给表单区域添加样式 */
.form-wrapper {
    max-width: 900px; /* 限制最大宽度 */
    margin: 20px auto; /* 上下边距 20px，左右自动居中 */
    padding: 20px;    /* 内部留白 */
    background-color: #fff; /* 可选：给表单区域加个背景色 */
    border-radius: 8px;    /* 可选：加点圆角 */
    box-shadow: 0 2px 8px rgba(0,0,0,0.1); /* 可选：加点阴影 */
}

h2 {
    text-align: center; /* 标题居中 */
    margin-bottom: 25px;
}

/* 如果需要，可以在这里添加 ItineraryForm 的特定覆盖样式 */
/* :deep(.itinerary-form-class) { ... } */
</style>