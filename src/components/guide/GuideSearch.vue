<template>
    <div class="guide-search">
        <el-form :inline="true" :model="searchForm" class="search-form" @submit.prevent="onSubmit">
            <el-form-item>
                <el-input v-model="searchForm.keyword" placeholder="搜索攻略" clearable prefix-icon="Search"
                    @keyup.enter="onSubmit">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="searchForm.tag" placeholder="按标签筛选" clearable prefix-icon="PriceTag"
                    @keyup.enter="handleFilter"></el-input>
            </el-form-item>
            <el-form-item>
                <el-select v-model="searchForm.sortBy" placeholder="排序方式" clearable @change="handleSortChange"
                    class="sort-select">
                    <el-option label="创建时间" value="createTime"></el-option>
                    <el-option label="更新时间" value="updateTime"></el-option>
                    <el-option label="浏览量" value="viewCount"></el-option>
                    <el-option label="点赞数" value="likeCount"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="searchForm.sortOrder" placeholder="排序" clearable v-if="searchForm.sortBy"
                    @change="handleSortChange" class="sort-select">
                    <el-option label="升序" value="asc"></el-option>
                    <el-option label="降序" value="desc"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit" :icon="Search">搜索</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { reactive, defineEmits } from 'vue';
import { Search, PriceTag } from '@element-plus/icons-vue';

const searchForm = reactive({
    keyword: null,
    tag: null,
    sortBy: 'createTime',
    sortOrder: 'desc',
});

const emit = defineEmits(['search', 'filter', 'sort']);

const onSubmit = () => {
    emit('search', searchForm.keyword);
};
const handleFilter = () => {
    emit('filter', searchForm.tag);
};
const handleSortChange = () => {
    emit('sort', { sortBy: searchForm.sortBy, sortOrder: searchForm.sortOrder });
};
</script>

<style scoped>
.guide-search {
    margin-bottom: 20px;
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-form .el-form-item {
    margin-bottom: 0;
    margin-right: 10px;
}

/* 增加选择框的宽度 */
.sort-select {
    width: 120px;
    /* 根据需要调整 */
}
</style>