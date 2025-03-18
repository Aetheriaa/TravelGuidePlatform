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
                            <!-- 修改 action 属性 -->
                            <el-upload class="avatar-uploader" action="/api/v1/guides/upload-cover-image"
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
                        <el-input type="textarea" v-model="guide.content" placeholder="请输入攻略内容" rows="6"
                            clearable></el-input>
                        <!-- <div class="preview" v-html="parsedContent"></div> -->
                    </el-form-item>

                    <el-form-item label="标签" prop="tags" class="form-item">
                        <el-select v-model="guide.tags" multiple placeholder="选择标签" clearable filterable allow-create
                            default-first-option ref="tagSelect" @change="handleTagChange">
                            <el-option v-for="item in tagOptions" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                        <el-button type="primary" size="small" @click="generateTags">
                            自动生成标签
                        </el-button>
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
import { extractTags } from "@/api/guide";

const guideFormRef = ref(null);
const loading = ref(false);
const tagSelect = ref(null);
const props = defineProps({
    isEdit: {
        type: Boolean,
        default: false,
    },
    guideData: { // 用于编辑模式下传递初始数据
        type: Object,
        default: () => ({}),
    },
});

const emit = defineEmits(['submit', 'cancel', 'update:guideData']);

const guide = reactive({
    title: '',
    content: '',
    coverImage: '',
    tags: [], //直接用这个来存储
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

const handleTagChange = (newValue, oldValue) => {
    // 判断是否新增了标签 (newValue 的长度大于 oldValue 的长度)
    if (newValue && oldValue && newValue.length > oldValue.length) {
        // 获取 el-select 组件的输入框元素
        const inputElement = tagSelect.value?.input;
        if (inputElement) {
            inputElement.value = ''; // 清空输入框的值 (原生 DOM 属性)
        }
    } else if (newValue && oldValue === undefined && newValue.length === 1) {
        // 处理初始添加第一个自定义标签的情况
        const inputElement = tagSelect.value?.input;
        if (inputElement) {
            inputElement.value = '';
        }
    }
};

onMounted(() => {
    if (props.isEdit) {
        // 将传入的 guideData 复制到响应式对象 guide 中
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
    coverImage: [{ required: false, message: '请上传封面图片', trigger: 'blur' }],
    tags: [ // 添加对 tags 的校验
        { type: 'array', required: true, message: '请至少选择一个标签', trigger: 'change' },
    ],
});

const submitForm = () => {
    guideFormRef.value?.validate((valid) => {
        if (valid) {
            emit('submit', guide); // 直接发送 guide 对象
        }
    });
};

const cancel = () => {
    emit('cancel');
};

// 上传封面图片相关
const handleCoverImageSuccess = (response, file) => {
    guide.coverImage = response.data.url;//假设后端返回的是{data: {url: 'xxx'}}
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
    loading.value = true; // 开始上传时显示加载状态
    return isJPG && isLt2M;
};
// 添加请求头，用于传递token
const getHeaders = computed(() => {
    const token = localStorage.getItem('token'); // 从 localStorage 获取 token
    return {
        Authorization: token ? `Bearer ${token}` : '',
    };
})

//自动生成标签
const generateTags = async () => {
    try {
        const response = await extractTags({ content: guide.content });
        if (response.data && response.data.data) {
            // 使用 Set 去重，并保留原有标签
            const newTags = new Set([...guide.tags, ...response.data.data]);
            guide.tags = Array.from(newTags); // 更新标签
            ElMessage.success("标签提取成功！");
        }
    } catch (error) {
        console.error("Error extracting tags:", error);
        ElMessage.error("标签提取失败");
    }
};

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

</style>