<template>
    <div class="product-list-page">
        <Header />
        <div class="product-list-container">
            <el-card class="header-card" shadow="never">
                <div class="header-content">
                    <h1 class="page-title">
                        <i class="el-icon-shopping-bag-2"></i> 产品列表
                    </h1>
                    <el-button type="primary" icon="Plus" @click="gotoCreate">
                        发布产品
                    </el-button>
                </div>
            </el-card>
            <ProductSearch @search="handleSearch" @filter="handleFilter" @sort="handleSortChange"
                :fetchProducts="fetchProducts" />
            <el-row :gutter="20" class="product-grid">
                <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="product in products" :key="product.id">
                    <!-- ProductCard 组件引用不变 -->
                    <ProductCard :product="product" @update="fetchProducts" />
                </el-col>
            </el-row>
            <div class="pagination-container" v-if="total > listQuery.pageSize">
                <el-pagination v-model:current-page="listQuery.page" v-model:page-size="listQuery.pageSize"
                    :page-sizes="[12, 24, 72, 144]" layout="total, sizes, prev, pager, next, jumper" :total="total"
                    @size-change="handleSizeChange" @current-change="handleCurrentChange" background />
            </div>
            <el-empty v-if="products.length === 0" description="暂无产品" />
        </div>
        <Footer />
    </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import { getProductList, deleteProduct, updateProductStatus } from '@/api/product';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';
import ProductCard from '@/components/product/ProductCard.vue';
// import defaultImage from '@/assets/default_product.jpg'; // fallbackImage 未使用，注释掉或移除
import ProductSearch from '@/components/product/ProductSearch.vue';

const router = useRouter();

const products = ref([]);
const loading = ref(false);
const total = ref(0);
const userStore = useUserStore();
//  fallback 图片 (如果 ProductCard 内部需要但外部没用到，此行可移除)
// const fallbackImage = ref(defaultImage);

const productTypeMap = {
    flight: '交通票据',
    hotel: '住宿酒店',
    ticket: '景点门票',
    package: '美食套餐',
};

// getProductTypeLabel 未在本组件使用，但 ProductCard 可能需要，保留导出或移至 ProductCard
const getProductTypeLabel = (type) => {
    return productTypeMap[type] || type || '';
};

const listQuery = reactive({
    page: 1,
    pageSize: 12,
    keyword: null,
    type: null,
    status: '', // 保持空字符串或其他表示“全部”的值
    sortBy: 'createTime',
    sortOrder: 'desc',
});

onMounted(() => {
    fetchProducts();
});

const fetchProducts = () => {
    loading.value = true;
    getProductList(listQuery)
        .then((response) => {
            // 假设后端接口返回的数据结构是 { code: ..., msg: ..., data: { records: [], total: number } }
            if (response.data && response.data.data && Array.isArray(response.data.data.records)) {
                products.value = response.data.data.records;
                total.value = response.data.data.total || 0;
            } else {
                console.error('Invalid response structure:', response);
                products.value = [];
                total.value = 0;
                ElMessage.error('获取产品列表数据格式错误');
            }
        })
        .catch((error) => {
            console.error('Error fetching products:', error);
            ElMessage.error('获取产品列表失败');
            products.value = []; // 出错时清空列表
            total.value = 0;
        })
        .finally(() => {
            loading.value = false;
        });
};


const gotoCreate = () => {
    router.push({ name: 'ProductCreate' });
};

// --- ProductSearch 组件的事件处理 ---
// 注意：确保 ProductSearch 正确地 emit 了 search, filter, sort 事件
// 并且传递了必要的参数

const handleSearch = (keyword) => {
    listQuery.keyword = keyword;
    listQuery.page = 1; // 搜索时重置到第一页
    fetchProducts();
};

const handleFilter = (filters) => {
    // 假设 filters 是一个对象，例如 { type: 'hotel', status: 1 }
    listQuery.type = filters.type || null; // 如果没有选择类型，则为 null
    listQuery.status = filters.status !== undefined ? filters.status : ''; // 允许选择“全部”（空字符串）或特定状态
    listQuery.page = 1; // 筛选时重置到第一页
    fetchProducts();
};

const handleSortChange = (sortOptions) => {
     // 假设 sortOptions 是一个对象，例如 { sortBy: 'price', sortOrder: 'asc' }
    listQuery.sortBy = sortOptions.sortBy || 'createTime';
    listQuery.sortOrder = sortOptions.sortOrder || 'desc';
    listQuery.page = 1; // 排序时重置到第一页
    fetchProducts();
};
// --- End ProductSearch event handlers ---


// 分页
const handleSizeChange = (val) => {
    listQuery.pageSize = val;
    listQuery.page = 1; // 切换 pageSize 时，重置 currentPage
    fetchProducts();
};
const handleCurrentChange = (val) => {
    listQuery.page = val;
    fetchProducts();
};

//重置筛选条件 (这个函数似乎没有被调用，如果 ProductSearch 组件内有重置按钮，应 emit 事件触发此函数或类似逻辑)
const resetFilters = () => {
    listQuery.keyword = null;
    listQuery.type = null;
    listQuery.status = '';
    listQuery.sortBy = 'createTime';
    listQuery.sortOrder = 'desc';
    listQuery.page = 1; // 重置时回到第一页
    fetchProducts(); //重新加载
}
</script>

<style scoped>
.product-list-page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f5f7fa;
}

.product-list-container {
    flex-grow: 1;
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
}

/* 头部卡片 */
.header-card {
    margin-bottom: 20px;
    border-radius: 8px;
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0; /* 可以根据视觉调整 */
}

.page-title {
    font-size: 24px;
    font-weight: bold; /* 加粗可能更好看 */
    color: #333;
    display: flex;
    align-items: center;
    gap: 10px; /* 图标和文字间距 */
}

/* 搜索组件（如果它也是 Card）的间距 */
/* 假设 ProductSearch 根元素有特定类或就是 el-card */
:deep(.el-card), /* 如果 ProductSearch 是 Card */
.product-search-component-wrapper { /* 或者给 ProductSearch 包裹一个 div */
    margin-bottom: 20px; /* 确保搜索区和产品列表间也有间距 */
}


.product-grid {
    /* margin-bottom: 20px; */ /* 行容器本身的下边距可以移除，由内部列的边距控制 */
}

/* --- 新增：为产品网格中的列添加下边距 --- */
.product-grid .el-col {
    margin-bottom: 20px; /* 控制卡片之间的垂直间距 */
}

/* 分页 */
.pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 20px; /* 分页器与上方内容的间距 */
    padding-bottom: 20px; /* 页面底部留白 */
}

/* 响应式调整 (ProductSearch 内部的样式移至其组件内更佳) */

</style>