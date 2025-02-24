<template>
    <el-card class="search-card" shadow="never">
        <el-form :inline="true" :model="listQuery" class="search-form" @submit.prevent="onSubmit">
            <el-row :gutter="20">
                <el-col :xs="24" :sm="12" :md="8">
                    <el-form-item>
                        <el-input v-model="listQuery.keyword" placeholder="搜索产品" clearable prefix-icon="Search"
                            @keyup.enter="onSubmit" class="search-input" />
                    </el-form-item>
                </el-col>

                <el-col :xs="24" :sm="12" :md="16" class="filter-group">
                    <el-form-item>
                        <span style="margin-right: 10px">筛选:</span>
                        <el-select v-model="listQuery.type" placeholder="选择类型" clearable class="filter-select"
                            @change="fetchProducts">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="交通票据" value="flight"></el-option>
                            <el-option label="住宿酒店" value="hotel"></el-option>
                            <el-option label="景点门票" value="ticket"></el-option>
                            <el-option label="美食套餐" value="package"></el-option>
                        </el-select>
                        <el-select v-model="listQuery.status" placeholder="选择状态" clearable class="filter-select"
                            @change="fetchProducts">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="上架中" :value="1"></el-option>
                            <el-option label="已下架" :value="0"></el-option>
                        </el-select>
                        <el-select v-model="listQuery.sortBy" placeholder="排序方式" clearable
                            class="filter-select sort-select" @change="handleSortChange">
                            <el-option label="创建时间" value="createTime"></el-option>
                            <el-option label="价格" value="price"></el-option>
                            <el-option label="库存" value="stock"></el-option>
                        </el-select>
                        <el-select v-model="listQuery.sortOrder" placeholder="排序" clearable v-if="listQuery.sortBy"
                            class="filter-select sort-select" @change="handleSortChange">
                            <el-option label="升序" value="asc"></el-option>
                            <el-option label="降序" value="desc"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :xs="24" :sm="24" :md="24">
                    <el-form-item>
                        <div class="button-group">
                            <el-button type="primary" @click="onSubmit" :icon="Search">搜索</el-button>
                            <el-button @click="resetFilters" :icon="Refresh">重置</el-button>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </el-card>
</template>

<script setup>
import { reactive, defineEmits, defineProps } from 'vue';
import { Search, Refresh } from '@element-plus/icons-vue';

const props = defineProps({
    fetchProducts: {  //接收父组件的fetchProducts
        type: Function,
        required: true
    }
});

const listQuery = reactive({
    keyword: null,
    type: null,
    status: '',
    sortBy: 'createTime',
    sortOrder: 'desc',
    page: 1,  // 假设你有分页
    pageSize: 10, // 假设你有分页
});


// 修改：使用 onSubmit 处理搜索，包括关键词搜索和直接点击搜索按钮
const onSubmit = () => {
    props.fetchProducts(); // 调用父组件的方法
};

// 排序 (这里简化了，直接调用 fetchProducts)
const handleSortChange = () => {
    props.fetchProducts();
};

const resetFilters = () => {
    listQuery.keyword = null;
    listQuery.type = null;
    listQuery.status = '';
    listQuery.sortBy = 'createTime';
    listQuery.sortOrder = 'desc';
    // listQuery.page = 1;  // 如果需要重置分页，取消注释
    props.fetchProducts();
};
</script>

<style scoped>
.search-card {
    margin-bottom: 20px;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.search-form {
    padding: 20px;
}

.search-form .el-form-item {
    margin-bottom: 0;
}

/* 搜索框 */
.search-input {
    min-width: 150px;
}

/* 筛选框 */
.filter-select {
    min-width: 100px;
    /*  */
    width: auto;
    /* 让选择框自动调整宽度 */
    margin-right: 10px;
    /* 选择框之间的间距 */
}

/* 排序选择框 */
.sort-select {
    min-width: 100px;
}

.sort-select:first-child {
    margin-right: 10px;
}

/* 按钮组 */
.button-group {
    display: flex;
    gap: 10px;
}

.filter-group .el-form-item__content {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
}
</style>