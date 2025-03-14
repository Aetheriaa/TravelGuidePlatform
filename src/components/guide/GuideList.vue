<template>
    <div class="guide-list-page">

        <div class="guide-list-container">
            <GuideSearch @search="handleSearch" @filter="handleFilter" @sort="handleSort" />

            <el-row :gutter="20" class="guide-list">
                <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="guide in guides" :key="guide.id">
                    <GuideCard :guide="guide" />

                </el-col>
            </el-row>
            <div class="pagination-wrapper" v-if="total > pageSize">
                <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
                    :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" :total="total"
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
import { ElMessage } from 'element-plus';


const guides = ref([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(24);
const route = useRoute();
const router = useRouter();

const listParams = reactive({
    keyword: null,
    tags: [], // 初始值为空数组
    sortBy: 'createTime',
    sortOrder: 'desc',
    page: 1,
    pageSize: 10
});

onMounted(() => {
    // 从路由参数中恢复搜索和筛选条件
    listParams.keyword = route.query.keyword || null;
    // 确保 tags 是一个数组
    if (route.query.tag) {
        listParams.tags = Array.isArray(route.query.tag) ? route.query.tag : [route.query.tag];
    } else {
        listParams.tags = []; // 如果没有 tag 参数，则设置为空数组
    }
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
        // 确保 tags 是一个数组
        if (newQuery.tag) {
            // 如果 newQuery.tag 是一个字符串，则将其转换为数组
            listParams.tags = typeof newQuery.tag === 'string' ? [newQuery.tag] : newQuery.tag;
        } else {
            listParams.tags = []; // 如果没有 tag 参数，则设置为空数组
        }
        listParams.sortBy = newQuery.sortBy || 'createTime';
        listParams.sortOrder = newQuery.sortOrder || 'desc';
        currentPage.value = parseInt(newQuery.page) || 1;
        pageSize.value = parseInt(newQuery.pageSize) || 10;
        fetchGuides();
    },
    { deep: true }
);

const fetchGuides = () => {
    listParams.page = currentPage.value
    listParams.pageSize = pageSize.value
    getGuideList(listParams)
        .then(response => {
            guides.value = response.data.data.records;
            total.value = response.data.data.total;
        })
        .catch(error => {
            console.error("Error fetching guides:", error);
            ElMessage.error("获取数据失败");
        });
};

const handleSearch = (keyword) => {
    listParams.keyword = keyword;
    updateRoute();
};

const handleFilter = (tag) => {
    // 如果传递了 tag 参数，则将其添加到 tags 数组中
    if (tag) {
        listParams.tags = [tag]; // 只保留当前点击的标签
    } else {
        listParams.tags = []; // 清空标签
    }
    updateRoute();
};

// 排序 (如果需要)
const handleSortChange = (sort) => {
    //   listParams.sortBy = sort.sortBy;
    //   listParams.sortOrder = sort.sortOrder;
    //   updateRoute();
};

// 更新路由参数
const updateRoute = () => {
    router.push({
        query: {
            ...route.query,
            keyword: listParams.keyword,
            tag: listParams.tags, // 将 tags 数组传递给后端
            sortBy: listParams.sortBy,
            sortOrder: listParams.sortOrder,
            page: currentPage.value,
            pageSize: pageSize.value
        }
    });
};

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