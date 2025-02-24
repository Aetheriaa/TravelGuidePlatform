<template>
    <div class="guide-form-page">
        <div class="guide-form-container">
            <el-card class="guide-form-card" shadow="hover">
                <h2 class="guide-form-title">
                    {{ isEdit ? '编辑攻略' : '发布攻略' }}
                    <el-tag size="small" type="info" effect="plain" v-if="isEdit">
                        编辑模式
                    </el-tag>
                </h2>

                <el-form :model="guide" :rules="rules" ref="guideFormRef" label-width="80px" class="guide-form"
                    @submit.prevent>
                    <el-form-item label="标题" prop="title" class="form-item">
                        <el-input v-model="guide.title" placeholder="请输入攻略标题（最多 255 个字符）" clearable></el-input>
                    </el-form-item>

                    <el-form-item label="封面" prop="coverImage" class="form-item">
                        <div class="cover-image-upload">
                            <el-upload class="avatar-uploader" action="/api/guide/upload-cover-image"
                                :show-file-list="false" :on-success="handleCoverImageSuccess"
                                :before-upload="beforeCoverImageUpload" :headers="getHeaders"
                                :on-error="handleCoverImageError">
                                <img v-if="guide.coverImage" :src="guide.coverImage" class="cover-image" />
                                <el-icon v-else class="avatar-uploader-icon">
                                    <Plus />
                                </el-icon>
                            </el-upload>
                            <div class="upload-tip">
                                支持 jpg, png 格式，大小不超过 2MB, 建议尺寸: 宽750px, 高420px
                            </div>
                        </div>
                    </el-form-item>

                    <el-form-item label="内容" prop="content" class="form-item">
                        <!-- 使用 v-html 显示解析后的 Markdown 内容 -->
                        <el-input type="textarea" v-model="guide.content" placeholder="请输入攻略内容" rows="6"
                            clearable></el-input>
                        <!-- <div class="preview" v-html="parsedContent"></div> -->
                    </el-form-item>

                    <el-form-item label="标签" prop="tags" class="form-item">
                        <el-select v-model="guide.tags" multiple placeholder="选择标签" clearable filterable allow-create
                            default-first-option @change="handleTagChange">
                            <el-option v-for="item in tagOptions" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>

                    <el-form-item class="form-item">
                        <div class="button-group">
                            <el-button type="primary" @click="submitForm" :disabled="loading">
                                {{ isEdit ? '保存修改' : '发布攻略' }}
                            </el-button>
                            <el-button @click="cancel">取消</el-button>
                        </div>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>

    </div>
</template>

<script setup>
import { reactive, ref, defineProps, defineEmits, onMounted, computed } from 'vue';
import { ElMessage, ElLoading } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
// import { marked } from 'marked'; // 引入 marked 库
// import DOMPurify from 'dompurify'; //引入dompurify
// import hljs from 'highlight.js'; // 引入 highlight.js
// import 'highlight.js/styles/atom-one-dark.css'; // 引入样式, 可以选择其他样式

const guideFormRef = ref(null);
const loading = ref(false);

const props = defineProps({
    isEdit: {
        type: Boolean,
        default: false,
    },
    guideData: {
        type: Object,
        default: () => ({}),
    },
});

const emit = defineEmits(['submit', 'cancel', 'update:guideData']);

const guide = reactive({
    title: '',
    content: '',
    coverImage: '',
    tags: [], // 直接使用 guide.tags 存储标签数组
});

// 标签选项, 可根据需要修改
const tagOptions = ref([
    { value: '美食', label: '美食' },
    { value: '景点', label: '景点' },
    { value: '住宿', label: '住宿' },
    { value: '购物', label: '购物' },
    { value: '历史', label: '历史' },
    { value: '文化', label: '文化' },
    { value: '自然', label: '自然' }
]);

onMounted(() => {
    if (props.isEdit) {
        const guideDataCopy = JSON.parse(JSON.stringify(props.guideData));
        Object.assign(guide, guideDataCopy);
        // 如果 tags 是字符串，则分割为数组
        if (typeof guide.tags === 'string') {
            guide.tags = guide.tags.split(',');
        }
    }
});

const rules = reactive({
    title: [
        { required: true, message: '请输入攻略标题', trigger: 'blur' },
        { max: 255, message: '攻略标题长度不能超过 255 个字符', trigger: 'blur' }
    ],
    content: [{ required: true, message: '请输入攻略内容', trigger: 'blur' }],
    coverImage: [{ required: true, message: '请上传封面图片', trigger: 'blur' }],
    tags: [ // 添加对 tags 的校验
        { type: 'array', required: true, message: '请至少选择一个标签', trigger: 'change' },
    ],
});

const submitForm = () => {
    // guide.tags = guide.selectedTags.join(','); // 不需要了
    guideFormRef.value?.validate((valid) => {
        if (valid) {
            // 在向后端发送之前，将标签数组转换为逗号分隔的字符串
            const guideData = { ...guide, tags: guide.tags.join(',') };
            emit('submit', guideData); // 现在 tags 是字符串
        }
    });
};

const cancel = () => {
    emit('cancel');
};

// 上传封面图片相关
const handleCoverImageSuccess = (response, file) => {
    guide.coverImage = response.data.url; //假设后端返回的是{data: {url: 'xxx'}}
    loading.value = false;
    ElMessage.success('封面图片上传成功!')
};
// 添加错误处理
const handleCoverImageError = (err) => {
    loading.value = false;
    ElMessage.error('封面图片上传失败!');
    console.error("Upload error:", err);
};

const beforeCoverImageUpload = (file) => {
    const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isJPG) {
        ElMessage.error('上传封面图片只能是 JPG/PNG 格式!');
    }
    if (!isLt2M) {
        ElMessage.error('上传封面图片大小不能超过 2MB!');
    }
    loading.value = true;
    return isJPG && isLt2M;
};
// 添加请求头，用于传递token
const getHeaders = computed(() => {
    const token = localStorage.getItem('token'); // 从 localStorage 获取 token
    return {
        Authorization: token ? `Bearer ${token}` : '',
    };
})

//处理标签选中
const handleTagChange = (value) => {
    // guide.selectedTags = value; // 更新选中的标签
    guide.tags = value;
}

// Markdown 解析 + 代码高亮, 不需要可以删除
// marked.setOptions({
//     renderer: new marked.Renderer(),
//     highlight: function (code, lang) {
//         const language = hljs.getLanguage(lang) ? lang : 'plaintext';
//         return hljs.highlight(code, { language }).value;
//     },
//     langPrefix: 'hljs language-', // 让高亮的语言添加 'hljs language-' 类
//     breaks: true, // 启用换行符解析
// });

// const parsedContent = computed(() => {
//     const dirty = marked(guide.content);
//     return DOMPurify.sanitize(dirty);
// });

</script>

<style scoped>
.guide-form-page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f5f7fa;
}

.guide-form-container {
    flex-grow: 1;
    padding: 40px;
    display: flex;
    justify-content: center;
}

.guide-form-card {
    width: 100%;
    max-width: 800px;
    border-radius: 8px;
    padding: 40px;
}

.guide-form-title {
    text-align: center;
    margin-bottom: 40px;
    color: #333;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

/* 表单项 */
.guide-form .el-form-item {
    margin-bottom: 25px;
}

.form-item .el-form-item__label {
    color: #606266;
    font-weight: bold;
}

/* 封面图片上传 */
.cover-image-upload {
    display: flex;
    align-items: flex-start;
    gap: 20px;
}

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 178px;
    height: 178px;
    flex-shrink: 0;
}

.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
}

.cover-image {
    width: 178px;
    height: 178px;
    display: block;
}

.upload-tip {
    color: #999;
    line-height: 1.6;
    max-width: 500px;
}

/* 按钮组 */
.button-group {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

/* Markdown 编辑器和预览 */

</style>