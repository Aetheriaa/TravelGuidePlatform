<template>
    <el-form :model="topic" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="主题标题" prop="title">
            <el-input v-model="topic.title" placeholder="请输入主题标题"></el-input>
        </el-form-item>
        <el-form-item label="主题内容" prop="content">
            <el-input v-model="topic.content" type="textarea" :rows="10" placeholder="请输入主题内容"></el-input>
            <!-- 可以考虑使用富文本编辑器 -->
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm">{{ isEdit ? '保存修改' : '发布主题' }}</el-button>
            <el-button @click="cancelForm">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script setup>
import { ref, reactive, defineProps, defineEmits, onMounted } from 'vue';
import { ElMessage } from 'element-plus';

const props = defineProps({
    isEdit: {
        type: Boolean,
        default: false
    },
    topicData: { // 初始数据，在编辑模式下使用
        type: Object,
        default: () => ({})
    }
});

const emit = defineEmits(['submit', 'cancel']);
const formRef = ref()
const topic = reactive({
    title: '',
    content: ''
});
onMounted(() => {
    if (props.isEdit) {
        Object.assign(topic, props.topicData)
    }
})
const rules = reactive({
    title: [
        { required: true, message: '请输入主题标题', trigger: 'blur' }
    ],
    content: [
        { required: true, message: '请输入主题内容', trigger: 'blur' }
    ]
});

const submitForm = () => {
    formRef.value?.validate((valid) => {
        if (valid) {
            emit('submit', topic);
        }
    })
};

const cancelForm = () => {
    emit('cancel');
};
</script>

<style scoped>
/* 添加样式 */
</style>