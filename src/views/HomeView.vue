<template>
    <div class="home-page">
        <Header />
        <Banner v-if="showBanner" :banners="banners" />

        <div class="content-wrapper">
            <!-- <CategoryNavigation v-if="showCategories" :categories="categories"
                @category-change="handleCategoryChange" /> -->

            <section class="guides-section">
                <h2 class="section-title">
                    <i class="el-icon-document"></i> 攻略
                </h2>

                <!--推荐-->
                <div class="guide-subsection">
                    <h3 class="subsection-title">个性化推荐</h3>
                    <el-row :gutter="20">
                        <el-col
                            :xs="24" :sm="12" :md="8" :lg="6"
                            v-for="guide in recommendedGuides"
                            :key="'r' + guide.id"
                            class="guide-col" 
                        >
                            <GuideCard :guide="guide" />
                        </el-col>
                    </el-row>
                    <div class="pagination-container" v-if="totalRecommended > pageSize">
                        <el-pagination small background layout="prev, pager, next" :total="totalRecommended"
                            v-model:current-page="recommendedPage" @current-change="getRecommendedGuidesData" />
                    </div>
                </div>

                <!--热门-->
                <div class="guide-subsection">
                    <h3 class="subsection-title">热门攻略</h3>
                    <el-row :gutter="20">
                        <el-col
                            :xs="24" :sm="12" :md="8" :lg="6"
                            v-for="guide in popularGuides"
                            :key="'p' + guide.id"
                            class="guide-col" 
                        >
                            <GuideCard :guide="guide" />
                        </el-col>
                    </el-row>
                    <div class="pagination-container" v-if="totalPopular > pageSize">
                        <el-pagination small background layout="prev, pager, next" :total="totalPopular"
                            v-model:current-page="popularPage" @current-change="getPopularGuidesData" />
                    </div>
                </div>

                <!--最新-->
                <div class="guide-subsection">
                    <h3 class="subsection-title">最新攻略</h3>
                    <el-row :gutter="20">
                        <el-col
                            :xs="24" :sm="12" :md="8" :lg="6"
                            v-for="guide in latestGuides"
                            :key="'l' + guide.id"
                            class="guide-col" 
                        >
                            <GuideCard :guide="guide" />
                        </el-col>
                    </el-row>
                    <div class="pagination-container" v-if="totalLatest > pageSize">
                        <el-pagination small background layout="prev, pager, next" :total="totalLatest"
                            v-model:current-page="latestPage" @current-change="getLatestGuidesData" />
                    </div>
                </div>
            </section>
        </div>

        <Footer />
    </div>
</template>

<!-- <script> 和 <style> 部分保持不变 -->
<script setup>
// ... (脚本部分不变) ...
import { ref, onMounted, watch, computed } from 'vue';
import Header from '@/components/layout/Header.vue';
import Banner from '@/components/layout/Banner.vue';
import GuideCard from '@/components/guide/GuideCard.vue';
import Footer from '@/components/layout/Footer.vue';
import {
    getRecommendedGuides,
    getPopularGuides,
    getLatestGuides,
} from '@/api/guide';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/stores/user';

const showBanner = ref(true);
const banners = ref([
    // Banner 数据保持不变...
    { id: 1, imageUrl: 'http://n1-q.mafengwo.net/s14/M00/5B/7A/wKgE2l0mItCAE365AAuLG5abbz409.jpeg?imageMogr2%2Fstrip', title: 'Banner 1', link: '#' },
    { id: 2, imageUrl: 'http://b1-q.mafengwo.net/s13/M00/2E/0A/wKgEaVxyA5yAM79lAAZDIjG7KD868.jpeg?imageMogr2%2Fstrip', title: 'Banner 2', link: '#' },
    { id: 3, imageUrl: 'http://b1-q.mafengwo.net/s12/M00/1A/F8/wKgED1w60eeAT9tVAAY8Gi_EFPo67.jpeg?imageMogr2%2Fstrip', title: 'Banner 3', link: '#' },
    { id: 4, imageUrl: 'http://p1-q.mafengwo.net/s9/M00/26/92/wKgBs1g5MnOAbycOAAY5LnZP8RE98.jpeg?imageMogr2%2Fstrip', title: 'Banner 4', link: '#' },
]);

// 分页参数
const recommendedPage = ref(1);
const popularPage = ref(1);
const latestPage = ref(1);
const pageSize = ref(8);
const totalRecommended = ref(0);
const totalPopular = ref(0);
const totalLatest = ref(0);

const recommendedGuides = ref([]);
const popularGuides = ref([]);
const latestGuides = ref([]);

// 分类相关代码已注释，保持不变
// const showCategories = ref(true);
// const categories = ref([...]);

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const currentUserId = computed(() => userStore.currentUser?.id);

onMounted(() => {
    // 页面加载时获取初始数据
    getRecommendedGuidesData();
    getPopularGuidesData();
    getLatestGuidesData();
});

// 监听用户 ID 变化，如果变化则重新获取推荐数据
watch(currentUserId, (newUserId, oldUserId) => {
    if (newUserId !== oldUserId) {
        recommendedPage.value = 1; // 用户变化时重置推荐页码
        getRecommendedGuidesData();
    }
});

// 获取个性化推荐攻略数据
const getRecommendedGuidesData = async () => {
    try {
        const params = {
            page: recommendedPage.value,
            pageSize: pageSize.value,
            category: route.query.category // 如果需要分类过滤，保留此参数
        };
        // 仅在用户登录时传递 userId
        if (currentUserId.value) {
            params.userId = currentUserId.value;
        }
        const res = await getRecommendedGuides(params);
        recommendedGuides.value = res.data.data.records || [];
        totalRecommended.value = res.data.data.total || 0;
    } catch (error) {
        console.error("获取推荐攻略时出错:", error);
        ElMessage.error('加载推荐攻略失败');
        recommendedGuides.value = []; // 出错时清空
        totalRecommended.value = 0;
    }
}

// 获取热门攻略数据
const getPopularGuidesData = async () => {
    try {
        const res = await getPopularGuides({
            page: popularPage.value,
            pageSize: pageSize.value,
            category: route.query.category // 如果需要分类过滤，保留此参数
        });
        popularGuides.value = res.data.data.records || [];
        totalPopular.value = res.data.data.total || 0;
    } catch (error) {
        console.error("获取热门攻略时出错:", error);
        ElMessage.error('加载热门攻略失败');
        popularGuides.value = []; // 出错时清空
        totalPopular.value = 0;
    }
}

// 获取最新攻略数据
const getLatestGuidesData = async () => {
    try {
        const res = await getLatestGuides({
            page: latestPage.value,
            pageSize: pageSize.value,
            category: route.query.category // 如果需要分类过滤，保留此参数
        });
        latestGuides.value = res.data.data.records || [];
        totalLatest.value = res.data.data.total || 0;
    } catch (error) {
        console.error("获取最新攻略时出错:", error);
        ElMessage.error('加载最新攻略失败');
        latestGuides.value = []; // 出错时清空
        totalLatest.value = 0;
    }
}

</script>

<style scoped>
/* ... (样式部分不变) ... */
.home-page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f5f7fa;
}

.content-wrapper {
    flex-grow: 1;
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
}

.guides-section {
    margin-bottom: 30px;
}

.section-title {
    font-size: 28px;
    margin-bottom: 20px;
    color: #333;
    display: flex;
    align-items: center;
    border-bottom: 2px solid #409eff;
    padding-bottom: 10px;
}

.section-title i {
    margin-right: 10px;
}

.guide-subsection {
    margin-bottom: 30px; /* 子区域之间的底部间距 */
}

.subsection-title {
    font-size: 20px;
    margin-bottom: 15px;
    color: #555;
}

.guide-col {
    margin-bottom: 20px; /* 为每个卡片列添加底部外边距，实现垂直间距 */
}

.pagination-container {
    text-align: center;
    margin-top: 15px;
}
</style>