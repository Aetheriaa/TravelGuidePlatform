<template>
    <div class="category-navigation">
        <el-menu mode="horizontal" :default-active="activeIndex" @select="handleSelect" class="category-menu">
            <!-- <el-menu-item index="all">全部</el-menu-item> -->
            <el-menu-item v-for="category in categories" :key="category.value" :index="category.value">
                {{ category.name }}
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script setup>
import { ref, defineProps, watch } from 'vue';
import { useRoute } from 'vue-router'
const props = defineProps({
    categories: {
        type: Array,
        required: true
    },
    // 初始选中的分类，可选
    defaultCategory: {
        type: String,
        default: 'guide'
    }
});

const activeIndex = ref(props.defaultCategory);
const route = useRoute()

// 监听路由变化（兼容直接修改url）
watch(() => route.query.category, (newCategory) => {
    activeIndex.value = newCategory
}, { immediate: true })
const emit = defineEmits(['category-change']);

const handleSelect = (index) => {
    activeIndex.value = index;
    emit('category-change', index); // 将选中的分类值传递给父组件
};
</script>

<style scoped>
.category-navigation {
    margin-bottom: 20px;
    background-color: #fff;
    /* 添加背景颜色 */
    border-bottom: 1px solid #eee;
    /* 添加底部边框 */
}

.category-menu {
    /* 使用 flex 布局，让菜单项水平排列 */
    display: flex;
    justify-content: center;
    /* 水平居中 */
}

/* 可以根据需要自定义菜单项的样式 */
</style>