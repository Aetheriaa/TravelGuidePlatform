<template>
    <div v-if="topic" class="topic-detail-view">
        <h2>{{ topic.title }}</h2>
        <p>作者：{{ topic.username }}</p>
        <p>发布时间：{{ formatDate(topic.createTime) }}</p>
        <p>浏览量：{{ topic.viewCount }}</p>
        <p>回复数：{{ topic.replyCount }}</p>
        <el-divider></el-divider>
        <div class="topic-content" v-html="topic.content"></div>
        <!-- 添加回复表单, 这里的 parentReplyId 始终为 null，因为是针对主题的回复，而不是针对某条回复的回复 -->
        <ReplyForm :topic-id="topic.id" @reply-created="fetchReplies" />
        <!-- 监听 reply-created 事件，并在事件处理函数中重新获取回复列表 -->
        <ReplyList :topic-id="topic.id" :replies="replies" @reply-created="fetchReplies"></ReplyList>
    </div>
    <div v-else>Loading...</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { getTopicDetail } from '@/api/topic'; // 导入 API
import { useRoute } from 'vue-router';
import { formatDate } from '@/utils/date';
import ReplyList from '@/components/topic/ReplyList.vue'; // 导入回复列表组件
import { useUserStore } from '@/stores/user';
import ReplyForm from '@/components/topic/ReplyForm.vue'; // 导入回复表单组件
import { getRepliesByTopicId } from '@/api/reply';

const route = useRoute();
const topic = ref(null);
const replies = ref([]); // 添加 replies 变量
const userStore = useUserStore()
onMounted(() => {
    fetchTopicDetail();
});

const fetchTopicDetail = () => {
    getTopicDetail(route.params.id)
        .then(response => {
            topic.value = response.data.data; // 根据你的后端返回数据结构调整
            console.log(topic.value);
            // 在获取到主题详情后，获取回复列表
            fetchReplies();
        })
        .catch(error => {
            console.error("Error fetching topic detail:", error);
        });
};
// 获取回复列表
const fetchReplies = () => {
    getRepliesByTopicId(route.params.id)
        .then(response => {
            // 将获取到的回复数据赋值给 replies
            replies.value = response.data.data;
        })
        .catch(error => {
            console.error("Error fetching replies:", error);
        });
};
</script>

<style scoped>
/* 添加样式 */
.topic-detail-view {
    padding: 20px;
}

.topic-content {
    margin-top: 10px;
}

.author-info {
    display: flex;
    align-items: center;
    margin-bottom: 1em;
    font-size: 14px;
    color: #888;
}

.avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-left: 10px;
}

.topic-info {
    margin-bottom: 10px;
    font-size: 0.9em;
    color: #888;
}
</style>