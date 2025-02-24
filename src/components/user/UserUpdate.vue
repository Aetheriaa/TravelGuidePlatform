<template>
    <div class="user-update-page">
        <Header />
        <div class="user-update-container">
            <el-card class="user-update-card" shadow="hover">
                <h2 class="user-update-title">
                    <i class="el-icon-edit"></i> 编辑个人信息
                </h2>
                <el-form :model="user" :rules="rules" ref="userUpdateFormRef" label-width="80px"
                    class="user-update-form">
                    <el-form-item label="昵称" prop="nickname" class="form-item">
                        <el-input v-model="user.nickname" placeholder="请输入昵称" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="头像" prop="avatar" class="form-item">
                        <div class="avatar-upload-container">
                            <el-upload class="avatar-uploader" action="/api/user/upload-avatar" :show-file-list="false"
                                :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload"
                                :headers="getHeaders">
                                <img v-if="user.avatar" :src="user.avatar" class="cover-image" />
                                <el-icon v-else class="avatar-uploader-icon">
                                    <Plus />
                                </el-icon>
                            </el-upload>
                            <div class="avatar-tip">
                                支持 jpg, png 格式，大小不超过 2MB, 建议尺寸: 宽750px, 高420px
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label="性别" prop="gender" class="form-item">
                        <el-radio-group v-model="user.gender">
                            <el-radio label="M">男</el-radio>
                            <el-radio label="F">女</el-radio>
                            <el-radio label="U">未知</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="生日" prop="birthday" class="form-item">
                        <el-date-picker v-model="user.birthday" type="date" placeholder="选择日期" value-format="YYYY-MM-DD"
                            clearable></el-date-picker>
                    </el-form-item>
                    <el-form-item label="电话" prop="phone_number" class="form-item">
                        <el-input v-model="user.phone_number" placeholder="请输入电话号码" clearable>
                            <template #prefix>
                                <el-select v-model="selectedAreaCode" placeholder="+86" style="width: 80px">
                                    <el-option v-for="item in areaCodes" :key="item.value" :label="item.label"
                                        :value="item.value"></el-option>
                                </el-select>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="简介" prop="bio" class="form-item">
                        <el-input v-model="user.bio" type="textarea" :rows="4" placeholder="请输入个人简介" maxlength="200"
                            show-word-limit clearable></el-input>
                    </el-form-item>
                    <el-form-item class="form-item">
                        <div class="button-group">
                            <el-button type="primary" @click="submitForm" class="save-button">
                                保存修改
                            </el-button>
                            <router-link to="/userinfo">
                                <el-button class="back-button">返回</el-button>
                            </router-link>
                        </div>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
        <Footer />
    </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue';
import { updateUserInfo } from '@/api/user';
// import { updateUserInfo, uploadAvatar } from '@/api/user'; // 假设你有这个 API

import { ElMessage, ElLoading } from 'element-plus';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';
import { Plus } from '@element-plus/icons-vue';

const router = useRouter();
const userUpdateFormRef = ref(null);
const userStore = useUserStore();
const { currentUser } = storeToRefs(userStore);

const user = reactive({
    nickname: '',
    avatar: '',
    gender: '',
    birthday: '',
    phone_number: '',
    bio: '',
});

//区号
const areaCodes = ref([
    { label: '+86', value: '+86' },
    // { label: '+1', value: '+1' },
])
const selectedAreaCode = ref('+86'); //默认

onMounted(() => {
    if (currentUser.value) {
        // 深拷贝
        const userData = JSON.parse(JSON.stringify(currentUser.value));
        // 将 userData 的属性复制到 user
        Object.assign(user, userData);
    }
    // console.log(user.avatar)
});

const rules = reactive({
    nickname: [
        { min: 2, max: 20, message: '昵称长度在 2 到 20 个字符', trigger: 'blur' },
    ],
    phone_number: [
        {
            pattern: /^1[3456789]\d{9}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur',
        },
    ],
    bio: [{ max: 200, message: '简介长度不能超过 200 个字符', trigger: 'blur' }],
});

const submitForm = () => {
    userUpdateFormRef.value?.validate((valid) => {
        if (valid) {
            // 合并区号和电话号码
            const fullPhoneNumber = selectedAreaCode.value + user.phone_number;
            const updatedUser = { ...user, phone_number: fullPhoneNumber };
            updateUserInfo(updatedUser) //将合并后的号码传给后端
                .then(() => {
                    ElMessage.success('修改成功');
                    userStore.fetchUserInfo();
                    router.push('/userinfo');
                })
                .catch((error) => {
                    ElMessage.error(error.response?.data?.msg || '修改失败');

                });
        }
    });
};

// 头像上传相关
const loading = ref(false);
const handleAvatarSuccess = (response, file) => {
    guide.coverImage = response.data.url; //假设后端返回的是{data: {url: 'xxx'}}
    loading.value = false;
    ElMessage.success('头像上传成功!')
};

const beforeCoverImageUpload = (file) => {
    const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isJPG) {
        ElMessage.error('上传头像图片只能是 JPG/PNG 格式!');
    }
    if (!isLt2M) {
        ElMessage.error('上传头像图片大小不能超过 2MB!');
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

</script>

<style scoped>
.user-update-page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f5f7fa;
}

.user-update-container {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 40px 20px;
}

.user-update-card {
    width: 100%;
    max-width: 600px;
    border-radius: 8px;
    padding: 30px;
}

.user-update-title {
    text-align: center;
    margin-bottom: 30px;
    color: #333;
}

.user-update-title i {
    margin-right: 10px;
}

/* 表单项 */
.guide-form .el-form-item {
    margin-bottom: 25px;
}

.form-item .el-form-item__label {
    color: #606266;
    font-weight: bold;
}

.avatar-upload-container {
    display: flex;
    align-items: center;
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
    /* 使用 flex 布局 */
    align-items: center;
    /* 垂直居中 */
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
    /* 限制提示文字的最大宽度 */
}

.button-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.save-button {
    width: 48%;
}

.back-button {
    width: 48%;
}
</style>