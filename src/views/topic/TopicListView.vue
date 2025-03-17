<template>
    <Header />
    <TopicList></TopicList>
    <Footer />
</template>

<script setup>
  import Header from '@/components/layout/Header.vue';
  import Footer from '@/components/layout/Footer.vue';
import { ref, onMounted, reactive } from 'vue';
import { getTopicList } from '@/api/topic';
import { formatDate } from '@/utils/date'; // 导入日期格式化函数
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import TopicList from '@/components/topic/TopicList.vue';
const router = useRouter()
const topics = ref([]);
const loading = ref(false);
const total = ref(0);
// const currentPage = ref(1);  // 移动到了 listQuery
// const pageSize = ref(10);
const listQuery = reactive({
    page: 1,
    pageSize: 10,
    keyword: null, //搜索关键词
    sortBy: 'createTime',
    sortOrder: 'desc'
    // status: null, // 状态 (可选)
    // startTime: null, // 开始时间 (可选)
    // endTime: null,   // 结束时间 (可选)
})
onMounted(() => {
    fetchTopics();
});

const fetchTopics = () => {
    loading.value = true;
    getTopicList(listQuery).then(res => {
        topics.value = res.data.data.records
        total.value = res.data.data.total;
    }).catch(err => {
        console.log(err);
        ElMessage.error("获取数据失败")
    }).finally(() => {
        loading.value = false;
    })
};

// 分页
const handleSizeChange = (val) => {
    listQuery.pageSize = val;
    fetchTopics();
};
const handleCurrentChange = (val) => {
    listQuery.page = val;
    fetchTopics();
};
</script>

<style scoped>
.topic-list-view {
    padding: 20px;
}

/* 可以添加更多样式，例如卡片样式、列表项样式等 */
</style>