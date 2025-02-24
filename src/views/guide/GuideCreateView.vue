<template>
    <div class="guide-list-page">
        <Header />
        <div>
            <h1>发布攻略</h1>
            <GuideForm @submit="handleSubmit" @cancel="handleCancel"></GuideForm>
        </div>
        <Footer />
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import GuideForm from '@/components/guide/GuideForm.vue';
import { createGuide } from '@/api/guide';
import { ElMessage } from 'element-plus';
import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';

const router = useRouter();
const handleSubmit = (guideData) => {
    createGuide(guideData).then(() => {
        ElMessage.success('发布成功')
        router.push('/guides')
    }).catch(error => {
        ElMessage.error(error.response.data.msg)
    })
}
const handleCancel = () => {
    router.push('/guides') // 取消发布，回到列表页
}
</script>