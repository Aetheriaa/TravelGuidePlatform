<template>
    <div class="form-container">
      <el-card class="form-card">
        <template #header>
          <div class="card-header">
            <span>{{ isEdit ? '编辑主题' : '发布新主题' }}</span>
          </div>
        </template>
  
        <el-form :model="topic" :rules="rules" ref="formRef" label-width="120px" class="topic-form">
          <el-form-item label="主题标题" prop="title">
            <el-input v-model="topic.title" placeholder="请输入主题标题" clearable />
          </el-form-item>
          <el-form-item label="主题内容" prop="content">
            <el-input v-model="topic.content" type="textarea" :rows="10" placeholder="请输入主题内容" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">{{ isEdit ? '保存修改' : '发布主题' }}</el-button>
            <el-button @click="cancelForm">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, defineProps, defineEmits, onMounted } from 'vue';
  import { ElMessage } from 'element-plus';
  
  const props = defineProps({
    isEdit: {
      type: Boolean,
      default: false,
    },
    topicData: {
      // 初始数据，在编辑模式下使用
      type: Object,
      default: () => ({}),
    },
  });
  
  const emit = defineEmits(['submit', 'cancel']);
  const formRef = ref(null); // Use null as initial value
  const topic = reactive({
    title: '',
    content: '',
  });
  
  onMounted(() => {
    if (props.isEdit) {
      Object.assign(topic, props.topicData);
    }
  });
  
  const rules = reactive({
    title: [{ required: true, message: '请输入主题标题', trigger: 'blur' }],
    content: [{ required: true, message: '请输入主题内容', trigger: 'blur' }],
  });
  
  const submitForm = () => {
    formRef.value?.validate(valid => {
      if (valid) {
        emit('submit', topic);
      }
    });
  };
  
  const cancelForm = () => {
    emit('cancel');
  };
  </script>
  
  <style scoped>
  .form-container {
    padding: 20px;
    min-height: calc(100vh - 120px); /* Adjust for Header/Footer heights */
    display: flex;
    justify-content: center;
    align-items: flex-start; /* Align card to the top */
    background-color: #f5f7fa; /* Light background */
  }
  
  .form-card {
    width: 100%;
    max-width: 800px; /* Limit maximum width */
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  .card-header {
      font-size: 1.25rem;
      font-weight: bold;
  }
  
  .topic-form {
    padding: 20px;
  }
  
  .el-form-item {
    margin-bottom: 20px;
  }
  </style>