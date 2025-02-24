<template>
    <div>
        <h1>编辑攻略</h1>
        <GuideForm :isEdit="true" :guideData="guide" @submit="handleSubmit" @cancel="handleCancel"></GuideForm>
    </div>
</template>

<script setup>
import GuideForm from '@/components/guide/GuideForm.vue'
import { updateGuide, getGuideDetail } from '@/api/guide';
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

const guide = ref({})

// 获取攻略详情
const fetchGuideDetail = () => {
    getGuideDetail(route.params.id)
        .then(response => {
            guide.value = response.data.data;
        })
        .catch(error => {
            ElMessage.error("获取攻略失败")
            console.error("Error fetching guide detail:", error);
        });
};

onMounted(() => {
    fetchGuideDetail()
})
const handleSubmit = (data) => {
    // 传入id
    data.id = parseInt(route.params.id)
    updateGuide(data).then(() => {
        ElMessage.success("更新成功")
        router.push(`/guides/${route.params.id}`)
    }).catch(error => {
        ElMessage.error(error.response.data.msg)
    })
}
const handleCancel = () => {
    router.push(`/guides/${route.params.id}`) // 取消编辑，回到详情页
}
</script>