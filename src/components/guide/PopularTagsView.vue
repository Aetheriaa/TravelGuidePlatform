<template>
    <div class="popular-tags-page">
        <h2>热门标签</h2>
        <div v-if="loading">加载中...</div>
        <div v-else-if="popularTags.length > 0" class="tags-container">
            <el-tag v-for="tag in popularTags" :key="tag.id" @click="goToGuides(tag.name)" class="tag-item" type="info"
                :effect="tag.name === currentTag ? 'dark' : 'plain'">
                {{ tag.name }}
                <template v-if="tag.popularity != null">
                    ({{ tag.popularity }})
                </template>
            </el-tag>
        </div>
        <div v-else>暂无热门标签</div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getPopularTags } from '@/api/guide';
import { useRouter } from 'vue-router';

const popularTags = ref([]);
const loading = ref(true);
const router = useRouter();
const currentTag = ref(null)
onMounted(() => {
    fetchPopularTags();
});

const fetchPopularTags = () => {
    getPopularTags()
        .then(response => {
            popularTags.value = response.data.data; // 根据你的后端返回数据结构调整
            console.log(popularTags.value);
        })
        .catch(error => {
            console.error("Error fetching popular tags:", error);
        })
        .finally(() => {
            loading.value = false;
        });
};

// 点击标签，跳转到攻略列表页，并带上标签参数
const goToGuides = (tag) => {
    currentTag.value = tag
    router.push({ name: 'GuideList', query: { tag: tag } });
};
</script>

<style scoped>
.popular-tags-page {
    padding: 20px;
}

.tags-container {
    display: flex;
    flex-wrap: wrap;
    /* 允许换行 */
    gap: 10px;
    /* 标签之间的间距 */
}

.tag-item {
    margin-right: 8px;
    margin-bottom: 8px;
    cursor: pointer;
}
</style>