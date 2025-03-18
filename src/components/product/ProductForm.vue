<template>
    <el-form :model="product" :rules="rules" ref="productFormRef" label-width="120px" class="product-form">
        <el-form-item label="产品类型" prop="type">
            <el-select v-model="product.type" placeholder="请选择产品类型">
                <el-option label="交通票据" value="flight"></el-option>
                <el-option label="住宿酒店" value="hotel"></el-option>
                <el-option label="景点门票" value="ticket"></el-option>
                <el-option label="美食套餐" value="package"></el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="产品名称" prop="name">
            <el-input v-model="product.name" placeholder="请输入产品名称" clearable></el-input>
        </el-form-item>

        <el-form-item label="产品描述" prop="description">
            <el-input v-model="product.description" type="textarea" :rows="4" placeholder="请输入产品描述"
                clearable></el-input>
        </el-form-item>

        <el-form-item label="产品价格" prop="price">
            <el-input-number v-model="product.price" :min="0" placeholder="请输入产品价格"
                controls-position="right"></el-input-number>
        </el-form-item>

        <el-form-item label="供应商" prop="supplier">
            <el-input v-model="product.supplier" placeholder="请输入供应商" clearable></el-input>
        </el-form-item>

        <el-form-item label="库存" prop="stock">
            <el-input-number v-model="product.stock" :min="0" placeholder="请输入库存"
                controls-position="right"></el-input-number>
        </el-form-item>

        <el-form-item label="产品图片" prop="image">
            <!-- <el-upload class="upload-demo" action="#" :http-request="uploadImage" list-type="picture-card" :limit="1"
                :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :file-list="fileList">
                <el-icon>
                    <Plus />
                </el-icon>
                <template #file="{ file }">
                    <img class="el-upload-list-cover-content" :src="file.url" alt="" />
                </template>
            </el-upload> -->
            <el-upload class="upload-demo" action="/api/v1/guides/upload-cover-image"
                :on-success="handleCoverImageSuccess" :on-error="handleCoverImageError"
                :before-upload="beforeCoverImageUpload" :headers="getHeaders" :limit="1" v-model:file-list="fileList"
                list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
                <el-icon>
                    <Plus />
                </el-icon> <!--这里可以根据你的需要进行修改-->
                <template #file="{ file }">
                    <img class="el-upload-list-cover-content" :src="file.url" alt="" />
                </template>
            </el-upload>
            <el-dialog v-model="dialogVisible">
                <img w-full :src="dialogImageUrl" alt="Preview Image" />
            </el-dialog>
        </el-form-item>

        <el-form-item>
            <el-button type="primary" @click="submitForm">{{ isEdit ? '保存修改' : '发布产品' }}</el-button>
            <el-button @click="cancelForm">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script setup>
import { ref, reactive, defineProps, defineEmits, onMounted, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
const props = defineProps({
    isEdit: {
        type: Boolean,
        default: false
    },
    productData: {
        type: Object,
        default: () => ({})
    }
});
const emit = defineEmits(['submit', 'cancel']);
const productFormRef = ref()
const product = reactive({
    type: '',
    name: '',
    description: '',
    price: null,
    supplier: '',
    stock: null,
    image: '', //  存储图片 URL
});

const rules = reactive({
    type: [
        { required: true, message: '请选择产品类型', trigger: 'change' }
    ],
    name: [
        { required: true, message: '请输入产品名称', trigger: 'blur' }
    ],
    price: [
        { required: true, message: '请输入产品价格', trigger: 'blur' }
    ],
    stock: [
        { required: true, message: '请输入库存', trigger: 'blur' }
    ],
    image: [
        { required: true, message: '请上传产品图片', trigger: 'change' } //  图片上传也添加必填验证
    ]
});

const submitForm = () => {
    productFormRef.value?.validate((valid) => {
        if (valid) {
            emit('submit', product);
        }
    })
};

const cancelForm = () => {
    emit('cancel');
};

onMounted(() => {
    if (props.isEdit && props.productData) {
        Object.assign(product, props.productData);
        if (props.productData.image) {
            fileList.value = [{ url: props.productData.image }]; //  编辑时初始化图片列表
            product.image = props.productData.image; // 确保 product.image 也被赋值
        }
    }
});

// //  图片上传功能
// const dialogImageUrl = ref('');
// const dialogVisible = ref(false);
// const fileList = ref([]); //  用于 el-upload 的 file-list

// 用于控制加载状态
const loading = ref(false);

// 图片上传相关的变量和方法
const dialogImageUrl = ref('');
const dialogVisible = ref(false);
const fileList = ref([]); // 用于 el-upload 的 file-list

// const handlePictureCardPreview = (file) => {
//     dialogImageUrl.value = file.url;
//     dialogVisible.value = true;
// };

// 上传成功的回调
const handleCoverImageSuccess = (response, file) => {
    // 假设你的后端返回的数据结构是 { data: { url: '...' } }
    product.image = response.data.url; // 更新 product.image
    loading.value = false;
    ElMessage.success('图片上传成功');
};

const handleRemove = (file) => {
    fileList.value = []; // 移除后清空 fileList
    product.image = ''; //  同时清空 product.image
};

// 上传之前的钩子，用于校验文件类型和大小
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
const handleCoverImageError = () => {
    loading.value = false;
    ElMessage.error('上传失败')
}
// 预览图片
const handlePictureCardPreview = (file) => {
    dialogImageUrl.value = file.url;
    dialogVisible.value = true;
};

// 添加请求头，用于传递token
const getHeaders = computed(() => {
    const token = localStorage.getItem('token'); // 从 localStorage 获取 token
    return {
        Authorization: token ? `Bearer ${token}` : '',
    };
})

const uploadImage = (param) => {
    //  TODO:  在这里实现图片上传的逻辑，你需要调用你的后端图片上传接口
    //  示例代码 (需要替换成真实的上传逻辑):
    setTimeout(() => {
        const imageUrl = 'https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png'; //  模拟上传成功返回的图片 URL
        product.image = imageUrl; //  更新 product.image 为上传后的 URL
        fileList.value = [{ url: imageUrl }]; //  更新 fileList 以显示上传的图片
        ElMessage.success('图片上传成功!');
        param.onSuccess(); //  通知 el-upload 上传成功
    }, 500); //  模拟 0.5 秒上传延迟
};


</script>

<style scoped>
.product-form {
    max-width: 700px;
    margin: 0 auto;
    padding: 20px;
}

.product-form .el-form-item {
    margin-bottom: 15px;
}

.product-form .el-form-item__label {
    font-weight: bold;
}

.product-form .el-input,
.product-form .el-textarea,
.product-form .el-select,
.product-form .el-input-number {
    width: 100%;
}

.upload-demo .el-upload--picture-card {
    width: 148px;
    height: 148px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.el-upload-list-cover-content {
    width: 100%;
    height: 100%;
    display: block;
}
</style>