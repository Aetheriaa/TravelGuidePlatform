<template>
    <Header />
    <div class="popular-tags-page">
      <el-card class="tags-card">
        <template #header>
          <div class="card-header">
            <h2><i class="el-icon-price-tag" /> 热门标签</h2>
          </div>
        </template>
  
        <div v-if="loading" class="loading-container">
          <el-skeleton :rows="5" animated />
        </div>
        <div v-else-if="popularTags.length > 0" class="tags-container">
          <el-tag
            v-for="tag in popularTags"
            :key="tag.id"
            @click="goToGuides(tag.name)"
            class="tag-item"
            :effect="tag.name === currentTag ? 'dark' : 'plain'"
            size="large"
            hit
            round
          >
            {{ tag.name }}
            <span v-if="tag.popularity != null" class="tag-popularity">
              ({{ tag.popularity }})
            </span>
          </el-tag>
        </div>
        <el-empty v-else description="暂无热门标签" />
      </el-card>
    </div>
    <Footer/>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { getPopularTags } from '@/api/guide';
  import { useRouter } from 'vue-router';
  import Header from '@/components/layout/Header.vue'
  import Footer from '@/components/layout/Footer.vue'
  
  const popularTags = ref([]);
  const loading = ref(true);
  const router = useRouter();
  const currentTag = ref(null);
  
  onMounted(() => {
    fetchPopularTags();
  });
  
  const fetchPopularTags = () => {
    getPopularTags()
      .then(response => {
        popularTags.value = response.data.data;
        console.log(popularTags.value);
      })
      .catch(error => {
        console.error('Error fetching popular tags:', error);
      })
      .finally(() => {
        loading.value = false;
      });
  };
  
  const goToGuides = tag => {
    currentTag.value = tag;
    router.push({ name: 'GuideList', query: { tag: tag } });
  };
  
  </script>
  
  <style scoped>
  .popular-tags-page {
    padding: 20px;
    min-height: calc(100vh - 80px); /* Adjust based on Header/Footer height */
    display: flex;
    justify-content: center;
    background-color: #f5f7fa;
  }
  
  .tags-card {
    width: 100%;
    max-width: 800px; /* Or any desired max-width */
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  
  .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 1.25rem;
      font-weight: bold;
      color: #303133;
  }
  .loading-container {
    padding: 20px;
  }
  
  .tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 12px; /* Increased gap for better spacing */
    padding: 20px;
  }
  
  .tag-item {
    cursor: pointer;
    transition: all 0.3s ease; /* Smooth transition for hover effects */
    font-size: 16px;       /* Larger font size */
  
  }
  
  .tag-item:hover {
    transform: translateY(-2px); /* Slight lift on hover */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* More pronounced shadow on hover */
  }
  
  .tag-popularity {
    margin-left: 4px;
    color: #606266;
  }
  </style>