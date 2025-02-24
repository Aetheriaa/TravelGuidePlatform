<template>
    <div class="guide-list-page">
        
        <div class="guide-list-container">
            <GuideSearch @search="handleSearch" @filter="handleFilter" />

            <el-row :gutter="20" class="guide-list">
                <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="guide in guides" :key="guide.id">
                    <GuideCard :guide="guide" />

                </el-col>
            </el-row>
            <div class="pagination-wrapper" v-if="total > pageSize">
                <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
                    :page-sizes="[24, 48, 192, 768]" layout="total, sizes, prev, pager, next, jumper" :total="total"
                    @size-change="handleSizeChange" @current-change="handleCurrentChange" background />
            </div>
            <el-empty v-if="guides.length === 0" description="没有找到相关攻略" />
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted, reactive, watch } from 'vue';
import { getGuideList } from '@/api/guide';
import GuideSearch from './GuideSearch.vue';
import { useRoute, useRouter } from 'vue-router';
import GuideCard from './GuideCard.vue';


const guides = ref([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(24);
const route = useRoute();
const router = useRouter();

const listParams = reactive({
    keyword: null,
    tag: null,
    sortBy: 'createTime',
    sortOrder: 'desc',
    page: 1,
    pageSize: 9,
});

onMounted(() => {
    // 从路由参数中恢复搜索和筛选条件
    listParams.keyword = route.query.keyword || null;
    listParams.tag = route.query.tag || null;
    listParams.sortBy = route.query.sortBy || 'createTime';
    listParams.sortOrder = route.query.sortOrder || 'desc';
    if (route.query.page) {
        currentPage.value = parseInt(route.query.page);
    }
    if (route.query.pageSize) {
        pageSize.value = parseInt(route.query.pageSize);
    }

    fetchGuides();
});

// 监听路由变化
watch(
    () => route.query,
    (newQuery) => {
        listParams.keyword = newQuery.keyword || null;
        listParams.tag = newQuery.tag || null;
        listParams.sortBy = newQuery.sortBy || 'createTime';
        listParams.sortOrder = newQuery.sortOrder || 'desc';
        currentPage.value = parseInt(newQuery.page) || 1;
        pageSize.value = parseInt(newQuery.pageSize) || 9;
        fetchGuides();

    },
    { deep: true }
);

const fetchGuides = () => {
    listParams.page = currentPage.value;
    listParams.pageSize = pageSize.value;
    getGuideList(listParams)
        .then((response) => {
            guides.value = response.data.data.records;
            total.value = response.data.data.total;
        })
        .catch((error) => {
            console.error('Error fetching guides:', error);
        });
};

const handleSearch = (keyword) => {
    listParams.keyword = keyword;
    updateRoute();
};

const handleFilter = (tag) => {
    listParams.tag = tag;
    updateRoute();
};
const updateRoute = () => {
    router.push({
        query: {
            ...route.query,
            keyword: listParams.keyword,
            tag: listParams.tag,
            sortBy: listParams.sortBy,
            sortOrder: listParams.sortOrder,
            page: currentPage.value,
            pageSize: pageSize.value
        },
    });
}

const handleSizeChange = (val) => {
    pageSize.value = val;
    currentPage.value = 1; // 切换 pageSize 时，重置 currentPage
    updateRoute()
};
const handleCurrentChange = (val) => {
    currentPage.value = val;
    updateRoute()
};
</script>

<style scoped>
.guide-list-page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f5f7fa;
}

.guide-list-container {
    flex-grow: 1;
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
}

.guide-list {
    margin-bottom: 20px;
}

/* 分页 */
.pagination-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
</style>