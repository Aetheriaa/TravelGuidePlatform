<template>
    <div class="guide-list-page">
        <Header />
        <div class="guide-list-content">
            <el-page-header :icon="Document" @back="goBack" title="攻略列表">
                <template #content>
                    <div class="page-header-content">
                        <el-tag size="medium" type="info" effect="plain" v-if="selectedCategory">
                            {{ selectedCategory }}
                        </el-tag>
                        <el-button type="primary" icon="Plus" @click="gotoCreateGuide">
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
import { Document, Plus } from '@element-plus/icons-vue';

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
        listParams.value.category = selectedCategory.value
        fetchGuides();
    },
    { deep: true }
);

const fetchGuides = async () => {
    try {
        const res = await getGuideList(listParams.value);
        guides.value = res.data.data.records; // 根据你的 API 返回数据结构调整
        //total.value = res.data.data.total;
    } catch (error) {
        console.error('Error fetching guide list:', error);
    }
};

const gotoCreateGuide = () => {
    router.push({ name: 'GuideCreate' });
};

const goBack = () => {
    router.back()
}
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
    justify-content: space-between;
    flex-wrap: wrap;
}
</style>