<template>
    <div class="guide-list-page">

        <div class="guide-list-container">
            <GuideSearch @search="handleSearch" @filter="handleFilter" @sort="handleSort" />

            <el-row :gutter="20" class="guide-list">
                <!-- 在这里给 el-col 添加了 class="guide-col" -->
                <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="guide in guides" :key="guide.id" class="guide-col">
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
const pageSize = ref(24); // 初始 pageSize 可以根据需要调整，比如 12 或 24
const route = useRoute();
const router = useRouter();

const listParams = reactive({
    keyword: null,
    tags: [],
    sortBy: 'createTime',
    sortOrder: 'desc',
    page: 1,
    pageSize: 24 // 确保与 ref(pageSize) 的初始值一致
});

onMounted(() => {
    // 从路由参数中恢复搜索和筛选条件
    listParams.keyword = route.query.keyword || null;
    if (route.query.tag) {
        listParams.tags = Array.isArray(route.query.tag) ? route.query.tag : [route.query.tag];
    } else {
        listParams.tags = [];
    }
    listParams.sortBy = route.query.sortBy || 'createTime';
    listParams.sortOrder = route.query.sortOrder || 'desc';
    if (route.query.page) {
        currentPage.value = parseInt(route.query.page);
    }
    // 确保从路由读取的 pageSize 覆盖默认值
    if (route.query.pageSize) {
        pageSize.value = parseInt(route.query.pageSize);
        listParams.pageSize = pageSize.value; // 同步 listParams
    } else {
         // 如果路由没有 pageSize，则使用 ref 的默认值同步 listParams
        listParams.pageSize = pageSize.value;
    }
    fetchGuides();
});

// 监听路由变化
watch(
    () => route.query,
    (newQuery) => {
        listParams.keyword = newQuery.keyword || null;
        if (newQuery.tag) {
            listParams.tags = typeof newQuery.tag === 'string' ? [newQuery.tag] : newQuery.tag;
        } else {
            listParams.tags = [];
        }
        listParams.sortBy = newQuery.sortBy || 'createTime';
        listParams.sortOrder = newQuery.sortOrder || 'desc';
        currentPage.value = parseInt(newQuery.page) || 1;
        pageSize.value = parseInt(newQuery.pageSize) || pageSize.value; // 保留之前的 pageSize 或使用默认值
        listParams.pageSize = pageSize.value; // 同步 listParams
        fetchGuides();
    },
    { deep: true }
);

const fetchGuides = () => {
    listParams.page = currentPage.value
    listParams.pageSize = pageSize.value
    getGuideList(listParams)
        .then(response => {
            // 确保 response.data.data 存在且结构正确
            if (response?.data?.data) {
                 guides.value = response.data.data.records || []; // 如果 records 不存在，给个空数组
                 total.value = response.data.data.total || 0; // 如果 total 不存在，给 0
            } else {
                 guides.value = [];
                 total.value = 0;
                 ElMessage.warning("获取到的数据格式不正确");
            }

        })
        .catch(error => {
            console.error("Error fetching guides:", error);
            ElMessage.error("获取攻略列表失败");
             guides.value = []; // 出错时清空列表
             total.value = 0;  // 出错时重置总数
        });
};

const handleSearch = (keyword) => {
    listParams.keyword = keyword || null; // 确保空字符串转为 null
    currentPage.value = 1; // 搜索时重置到第一页
    updateRoute();
};

const handleFilter = (tag) => {
    if (tag) {
        // 如果当前标签已经被选中，则取消选中（清空标签）
        if (listParams.tags.length === 1 && listParams.tags[0] === tag) {
             listParams.tags = [];
        } else {
            listParams.tags = [tag]; // 只保留当前点击的标签
        }
    } else {
        listParams.tags = []; // 清空标签
    }
    currentPage.value = 1; // 筛选时重置到第一页
    updateRoute();
};

// 排序 (如果需要实现)
const handleSort = (sortOptions) => {
   // sortOptions 应该包含 sortBy 和 sortOrder
   if (sortOptions && sortOptions.sortBy && sortOptions.sortOrder) {
       listParams.sortBy = sortOptions.sortBy;
       listParams.sortOrder = sortOptions.sortOrder;
       currentPage.value = 1; // 排序时重置到第一页
       updateRoute();
   }
};

// 更新路由参数
const updateRoute = () => {
    const query = {
        // keyword: listParams.keyword, // 如果 keyword 为 null 或空字符串，不添加到 query 中
        // tag: listParams.tags, // 如果 tags 为空数组，不添加到 query 中
        sortBy: listParams.sortBy,
        sortOrder: listParams.sortOrder,
        page: currentPage.value,
        pageSize: pageSize.value
    };
    // 只添加非空/非默认值的参数到路由，让 URL 更简洁
    if (listParams.keyword) {
        query.keyword = listParams.keyword;
    }
    if (listParams.tags && listParams.tags.length > 0) {
        query.tag = listParams.tags;
    }
    // 可以选择是否将默认排序添加到URL
    // if (listParams.sortBy !== 'createTime' || listParams.sortOrder !== 'desc') {
    //     query.sortBy = listParams.sortBy;
    //     query.sortOrder = listParams.sortOrder;
    // }
    if (currentPage.value !== 1) {
        query.page = currentPage.value;
    }
    if (pageSize.value !== 24) { // 假设 24 是默认 pageSize
        query.pageSize = pageSize.value;
    }

    router.push({ query });
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
    margin-bottom: 20px; /* el-row 本身也可以有下边距，根据需要调整 */
}

/* 新增样式：为每个攻略卡片列添加下外边距 */
.guide-col {
  margin-bottom: 20px;
}

/* 分页 */
.pagination-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 20px; /* 确保分页与最后一行的卡片也有间距 */
}

/* 当列表为空时，调整 el-empty 的上边距，避免紧贴搜索框 */
.el-empty {
    margin-top: 40px;
}
</style>