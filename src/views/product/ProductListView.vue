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
import defaultImage from '@/assets/default_product.jpg';
import ProductSearch from '@/components/product/ProductSearch.vue'

const router = useRouter();

const products = ref([]);
const loading = ref(false);
const total = ref(0);
const userStore = useUserStore();
//  fallback 图片
const fallbackImage = ref(defaultImage)

const productTypeMap = {
    flight: '交通票据',
    hotel: '住宿酒店',
    ticket: '景点门票',
    package: '美食套餐',
};

const getProductTypeLabel = (type) => {
    return productTypeMap[type] || type || '';
};

const listQuery = reactive({
    page: 1,
    pageSize: 12,
    keyword: null,
    type: null,
    status: '',
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
            products.value = response.data.data.records;
            total.value = response.data.data.total;
        })
        .catch((error) => {
            console.error('Error fetching products:', error);
            ElMessage.error('获取产品列表失败');
        })
        .finally(() => {
            loading.value = false;
        });
};


const gotoCreate = () => {
    router.push({ name: 'ProductCreate' });
};


// 排序
const handleSortChange = () => {
    fetchProducts();
};

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

//重置筛选条件
const resetFilters = () => {
    listQuery.keyword = null;
    listQuery.type = null;
    listQuery.status = '';
    listQuery.sortBy = 'createTime';
    listQuery.sortOrder = 'desc';
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
    padding: 10px 0;
}

.page-title {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    display: flex;
    align-items: center;
    gap: 10px;
}

/* 搜索卡片 */
.search-card {
    margin-bottom: 20px;
    border-radius: 8px;
}

.search-form {
    padding: 20px;
}

.search-form .el-form-item {
    margin-bottom: 0;
}

/* 调整选择框宽度 */
.filter-select {
    width: 100%;
}

.sort-select {
    margin-top: 10px;
}

@media (min-width: 768px) {

    /* 针对中等及以上屏幕 */
    .sort-select {
        width: 48%;
        margin-top: 0;
    }

    .sort-select:nth-child(2) {
        margin-left: 4%;
        /* 两个选择框之间的间距 */
    }
}

.product-grid {
    margin-bottom: 20px;
}

/* 分页 */
.pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
</style>