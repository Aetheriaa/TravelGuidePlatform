<template>
    <div class="guide-list-page">
        <Header />
        <div class="guide-list-content">
            <!--
                修改说明：
                el-page-header 的 icon prop 直接绑定导入的图标组件 Document
            -->
            <el-page-header :icon="Document" @back="goBack" title="攻略列表">
                <template #content>
                    <div class="page-header-content">
                        <el-tag size="medium" type="info" effect="plain" v-if="selectedCategory">
                            {{ selectedCategory }}
                        </el-tag>
                        <!--
                            修改说明：
                            el-button 的 icon prop 直接绑定导入的图标组件 Plus
                            之前使用的是 icon="Plus" (字符串)，需要改成 :icon="Plus" (绑定组件变量)
                        -->
                        <el-button type="primary" :icon="Plus" @click="gotoCreateGuide">
                            发布攻略
                        </el-button>
                    </div>
                </template>
            </el-page-header>

            <GuideList :guides="guides" />

        </div>
        <Footer />
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';
import GuideList from '@/components/guide/GuideList.vue';
import { useRouter, useRoute } from 'vue-router';
import { getGuideList } from '@/api/guide';
// 导入需要使用的图标组件
import { Document, Plus } from '@element-plus/icons-vue'; // 确保导入路径正确

const router = useRouter();
const route = useRoute();

const guides = ref([]);
const selectedCategory = ref(route.query.category || null);
const listParams = ref({
    page: 1,
    pageSize: 24,
    category: selectedCategory.value,
});

onMounted(async () => {
    await fetchGuides();
});

// 监听路由参数变化
watch(
    () => route.query,
    (newQuery) => {
        selectedCategory.value = newQuery.category || null;
        listParams.value.category = selectedCategory.value; // 更新请求参数中的 category
        fetchGuides(); // 重新获取攻略列表
    },
    { deep: true } // 使用 deep: true 以监听 query 对象内部的变化
);

const fetchGuides = async () => {
    try {
        console.log('Fetching guides with params:', listParams.value); // 添加日志方便调试
        const res = await getGuideList(listParams.value);
        // 确保访问的是正确的路径以获取攻略列表数组
        if (res && res.data && res.data.data && Array.isArray(res.data.data.records)) {
            guides.value = res.data.data.records;
            // 如果需要分页信息，也在这里处理
            // total.value = res.data.data.total;
        } else {
            console.warn('Received unexpected data structure:', res);
            guides.value = []; // 清空或设置默认值
        }
    } catch (error) {
        console.error('获取攻略列表时出错:', error);
        guides.value = []; // 出错时清空列表
    }
};

const gotoCreateGuide = () => {
    router.push({ name: 'GuideCreate' }); // 确保路由名称 'GuideCreate' 正确
};

const goBack = () => {
    router.back(); // 返回上一页
};
</script>

<style scoped>
.guide-list-page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f5f7fa;
}

.guide-list-content {
    flex-grow: 1;
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
}

.page-header-content {
    display: flex;
    align-items: center;
    justify-content: space-between; /* 确保标签和按钮分布在两侧 */
    flex-wrap: wrap; /* 在空间不足时允许换行 */
    width: 100%; /* 确保内容区占满可用宽度 */
}

/* 可能需要为 el-tag 添加一些右边距，以防它和按钮贴得太近 */
.page-header-content .el-tag {
    margin-right: 10px;
}
</style>