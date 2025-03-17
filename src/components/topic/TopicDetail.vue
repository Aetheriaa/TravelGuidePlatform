<template>
    <div class="topic-detail-container">
      <el-card class="topic-detail-card" v-if="topic">
        <template #header>
          <div class="card-header">
            <h2 class="topic-title">{{ topic.title }}</h2>
            <div class="topic-meta">
              <span class="author">
                <i class="el-icon-user" /> 作者: {{ topic.username }}
              </span>
              <span class="create-time">
                <i class="el-icon-time" /> 发布时间: {{ formatDate(topic.createTime) }}
              </span>
              <span class="views">
                <i class="el-icon-view" /> 浏览量: {{ topic.viewCount }}
              </span>
              <span class="replies">
                <i class="el-icon-chat-dot-round" /> 回复数: {{ topic.replyCount }}
              </span>
              <!-- 可以添加更多元数据，例如标签等 -->
            </div>
          </div>
        </template>
  
        <div class="topic-content" v-html="topic.content"></div>
  
        <el-divider />
  
        <div class="reply-section">
          <h3 class="reply-title">回复</h3>
          <ReplyForm :topic-id="topic.id" @reply-created="fetchReplies" />
          <ReplyList :topic-id="topic.id" :replies="replies" @reply-created="fetchReplies"></ReplyList>
        </div>
      </el-card>
  
      <el-empty v-else description="加载中..." />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { getTopicDetail } from '@/api/topic';
  import { useRoute } from 'vue-router';
  import { formatDate } from '@/utils/date';
  import ReplyList from '@/components/topic/ReplyList.vue';
  import ReplyForm from '@/components/topic/ReplyForm.vue';
  import { getRepliesByTopicId } from '@/api/reply';
  
  const route = useRoute();
  const topic = ref(null);
  const replies = ref([]);
  
  onMounted(() => {
    fetchTopicDetail();
  });
  
  const fetchTopicDetail = () => {
    getTopicDetail(route.params.id)
      .then(response => {
        topic.value = response.data.data;
        fetchReplies();
      })
      .catch(error => {
        console.error('Error fetching topic detail:', error);
      });
  };
  
  const fetchReplies = () => {
    getRepliesByTopicId(route.params.id)
      .then(response => {
        replies.value = response.data.data;
      })
      .catch(error => {
        console.error('Error fetching replies:', error);
      });
  };
  </script>
  
  <style scoped>
  .topic-detail-container {
    padding: 20px;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    background-color: #f5f7fa;
  }
  
  .topic-detail-card {
    width: 100%;
    max-width: 900px;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  
  .card-header {
    padding-bottom: 0;
  }
  
  .topic-title {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 10px;
    color: #303133;
  }
  
  .topic-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    color: #606266;
    font-size: 14px;
  }
  
  .topic-meta span {
    display: flex;
    align-items: center;
  }
  
  .topic-meta i {
    margin-right: 4px;
    color: #909399;
  }
  
  .topic-content {
    margin-top: 20px;
    line-height: 1.8;
    color: #303133;
    word-wrap: break-word;
  }
  
  .reply-section {
    margin-top: 20px;
  }
  
  .reply-title {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #303133;
  }
  </style>