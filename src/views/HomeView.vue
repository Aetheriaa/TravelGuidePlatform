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
                        <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="guide in recommendedGuides"
                            :key="'r' + guide.id">
                            <GuideCard :guide="guide" />
                        </el-col>
                    </el-row>
                    <div class="pagination-container" v-if="totalRecommended > pageSize">
                        <el-pagination small background layout="prev, pager, next" :total="totalRecommended"
                            v-model:current-page="recommendedPage" @current-change="getGuides" />
                    </div>
                </div>

                <!--热门-->
                <div class="guide-subsection">
                    <h3 class="subsection-title">热门攻略</h3>
                    <el-row :gutter="20">
                        <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="guide in popularGuides" :key="'p' + guide.id">
                            <GuideCard :guide="guide" />
                        </el-col>
                    </el-row>
                    <div class="pagination-container" v-if="totalPopular > pageSize">
                        <!-- <el-pagination small background layout="prev, pager, next" :total="totalPopular"
                            v-model:current-page="popularPage" @current-change="getGuides" /> -->
                        <el-pagination small background layout="prev, pager, next" :total="totalPopular"
                            v-model:current-page="popularPage" @current-change="getPopularGuidesData" />
                    </div>
                </div>

                <!--最新-->
                <div class="guide-subsection">
                    <h3 class="subsection-title">最新攻略</h3>
                    <el-row :gutter="20">
                        <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="guide in latestGuides" :key="'l' + guide.id">
                            <GuideCard :guide="guide" />
                        </el-col>
                    </el-row>
                    <div class="pagination-container" v-if="totalLatest > pageSize">
                        <el-pagination small background layout="prev, pager, next" :total="totalLatest"
                            v-model:current-page="latestPage" @current-change="getGuides" />
                    </div>
                </div>
            </section>
        </div>
        
        <Footer />
    </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import Header from '@/components/layout/Header.vue';
import Banner from '@/components/layout/Banner.vue';
import GuideCard from '@/components/guide/GuideCard.vue';
import CategoryNavigation from '@/components/layout/CategoryNavigation.vue';
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
    {
        id: 1,
        imageUrl:
            'http://n1-q.mafengwo.net/s14/M00/5B/7A/wKgE2l0mItCAE365AAuLG5abbz409.jpeg?imageMogr2%2Fstrip',
        title: 'Banner 1',
        link: '#',
    },
    {
        id: 2,
        imageUrl:
            'http://b1-q.mafengwo.net/s13/M00/2E/0A/wKgEaVxyA5yAM79lAAZDIjG7KD868.jpeg?imageMogr2%2Fstrip',
        title: 'Banner 2',
        link: '#',
    },
    {
        id: 3,
        imageUrl:
            'http://b1-q.mafengwo.net/s12/M00/1A/F8/wKgED1w60eeAT9tVAAY8Gi_EFPo67.jpeg?imageMogr2%2Fstrip',
        title: 'Banner 3',
        link: '#',
    },
    {
        id: 4,
        imageUrl:
            'http://p1-q.mafengwo.net/s9/M00/26/92/wKgBs1g5MnOAbycOAAY5LnZP8RE98.jpeg?imageMogr2%2Fstrip',
        title: 'Banner 4',
        link: '#',
    },
]);

// 分页参数
const recommendedPage = ref(1);
const popularPage = ref(1);
const latestPage = ref(1);
const pageSize = ref(8); // 每页显示的条数, 可以提取到.env文件
const totalRecommended = ref(0); // 推荐攻略总数
const totalPopular = ref(0); // 热门攻略总数
const totalLatest = ref(0); // 最新攻略总数

const recommendedGuides = ref([]);
const popularGuides = ref([]);
const latestGuides = ref([]);

const showCategories = ref(true);
const categories = ref([
    { name: '攻略', value: 'guide' },
    { name: '美食', value: 'food' },
    { name: '景点', value: 'attraction' },
    { name: '住宿', value: 'hotel' },
]);

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
// const isLoggedIn = computed(() => userStore.isLoggedIn);
// const currentUser = computed(() => userStore.currentUser);
const currentUserId = computed(() => userStore.currentUser?.id);
onMounted(async () => {
    const currentCategory = route.query.category || 'all';
    getRecommendedGuidesData()
    getPopularGuidesData()
    getLatestGuidesData()
    // getGuides();
});

// 监听路由变化
watch(
    () => route.query.category,
    () => {
        getGuides();
    }
);

const getRecommendedGuidesData = async () => {
    try {
        const res1 = await getRecommendedGuides({
            userId: currentUserId.value, // 传递 userId
            page: recommendedPage.value,
            pageSize: pageSize.value,
            category: route.query.category
        });
        recommendedGuides.value = res1.data.data.records;
        totalRecommended.value = res1.data.data.total;
    } catch (error) {
        console.error("Error fetching recommended guides:", error);
        ElMessage.error('Failed to load recommended guides');
    }
}
const getPopularGuidesData = async () => {
    try {
        const res2 = await getPopularGuides({ page: popularPage.value, pageSize: pageSize.value });
        popularGuides.value = res2.data.data.records;
        totalPopular.value = res2.data.data.total
    } catch (error) {
        console.error("Error fetching popular guides:", error);
        ElMessage.error('Failed to load popular guides');
    }
}
const getLatestGuidesData = async () => {
    try {
        const res3 = await getLatestGuides({ page: latestPage.value, pageSize: pageSize.value });
        latestGuides.value = res3.data.data.records;
        totalLatest.value = res3.data.data.total
    } catch (error) {
        console.error("Error fetching latest guides:", error);
        ElMessage.error('Failed to load latest guides');
    }
}

const getGuides = async () => {
    // 获取个性化推荐攻略
    try {
        const res1 = await getRecommendedGuides({
            page: recommendedPage.value,
            pageSize: pageSize.value,
            category: route.query.category,
        });
        recommendedGuides.value = res1.data.data.records; // 根据你的后端返回数据结构调整
        totalRecommended.value = res1.data.data.total; // 获取总数
    } catch (error) {
        console.error('Error fetching recommended guides:', error);
        ElMessage.error('获取推荐攻略失败');
    }

    // 获取热门攻略
    try {
        const res2 = await getPopularGuides({
            page: popularPage.value,
            pageSize: pageSize.value,
            category: route.query.category,
        });
        popularGuides.value = res2.data.data.records;
        totalPopular.value = res2.data.data.total;
    } catch (error) {
        console.error('Error fetching popular guides:', error);
        ElMessage.error('获取热门攻略失败');
    }

    // 获取最新攻略
    try {
        const res3 = await getLatestGuides({
            page: latestPage.value,
            pageSize: pageSize.value,
            category: route.query.category,
        });
        latestGuides.value = res3.data.data.records;
        totalLatest.value = res3.data.data.total;
    } catch (error) {
        console.error('Error fetching latest guides:', error);
        ElMessage.error('获取最新攻略失败');
    }
};

// 监听分类变化
const handleCategoryChange = (category) => {
    router.push({ query: { ...route.query, category: category } });
};

// 监听页码变化
watch(() => recommendedPage.value, () => {
    getRecommendedGuidesData();
});

watch(() => popularPage.value, () => {
    getPopularGuidesData();
});

watch(() => latestPage.value, () => {
    getLatestGuidesData();
});
</script>

<style scoped>
.home-page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f5f7fa;
    /* 浅灰色背景 */
}

.content-wrapper {
    flex-grow: 1;
    padding: 20px;
    max-width: 1200px;
    /* 最大宽度 */
    margin: 0 auto;
    /* 水平居中 */
    width: 100%;
    /* 填充父容器 */
}

.guides-section {
    margin-bottom: 30px;
}

.section-title {
    font-size: 28px;
    /* 更大的标题 */
    margin-bottom: 20px;
    color: #333;
    display: flex;
    /* 使用 Flexbox */
    align-items: center;
    /* 垂直居中 */
    border-bottom: 2px solid #409eff;
    /* 蓝色底边 */
    padding-bottom: 10px;
}

.section-title i {
    margin-right: 10px;
}

.subsection-title {
    font-size: 20px;
    margin-bottom: 15px;
    color: #555;
}

.pagination-container {
    text-align: center;
    margin-top: 15px;
}
</style>