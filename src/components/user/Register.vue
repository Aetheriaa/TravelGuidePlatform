<template>
    <div class="register-page">
        <Header />
        <div class="register-container">
            <el-card class="register-card" shadow="hover">
                <h2 class="register-title">注册</h2>
                <el-form :model="user" :rules="rules" ref="registerFormRef" label-width="0" class="register-form">
                    <el-form-item prop="username">
                        <el-input v-model="user.username" placeholder="用户名" prefix-icon="el-icon-user"
                            clearable></el-input>
                    </el-form-item>
                    <el-form-item prop="email">
                        <el-input v-model="user.email" placeholder="邮箱" prefix-icon="el-icon-message"
                            clearable></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input v-model="user.password" type="password" placeholder="密码" prefix-icon="el-icon-lock"
                            show-password @keyup.enter="submitForm"></el-input>
                    </el-form-item>
                    <el-form-item prop="confirmPassword">
                        <el-input v-model="user.confirmPassword" type="password" placeholder="确认密码"
                            prefix-icon="el-icon-lock" show-password @keyup.enter="submitForm"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <div class="button-group">
                            <el-button type="primary" @click="submitForm" class="register-button">
                                注册
                            </el-button>
                            <router-link to="/login">
                                <el-button class="login-button">登录</el-button>
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
import { reactive, ref, watch } from 'vue';
import { register } from '@/api/user';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';

const router = useRouter();
const registerFormRef = ref(null);

const user = reactive({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
});

const validateConfirmPassword = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请再次输入密码'));
    } else if (value !== user.password) {
        callback(new Error('两次输入密码不一致!'));
    } else {
        callback();
    }
};

const rules = reactive({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' },
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
    ],
    confirmPassword: [
        { required: true, validator: validateConfirmPassword, trigger: 'blur' }
    ]
});

//错误信息
const errorMessage = ref('');

const submitForm = () => {
    registerFormRef.value?.validate((valid) => {
        if (valid) {
            register(user)
                .then(() => {
                    ElMessage.success('注册成功');
                    router.push('/login');
                })
                .catch(error => {
                    if (error.response && error.response.data && error.response.data.msg) {
                        errorMessage.value = error.response.data.msg;
                        ElMessage.error(errorMessage.value);
                    } else {
                        ElMessage.error('注册失败，请稍后重试');
                    }
                });
        }
    });
};

// 清除错误消息
watch(() => user.username, () => {
    errorMessage.value = '';
})
watch(() => user.email, () => {
    errorMessage.value = '';
})
</script>

<style scoped>
.register-page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f0f2f5;
}

.register-container {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 20px;
}

.register-card {
    width: 100%;
    max-width: 400px;
    border-radius: 8px;
    padding: 30px;
}

.register-title {
    text-align: center;
    margin-bottom: 30px;
    color: #333;
}

.register-form {
    /* 移除 label-width */
}

.register-form .el-form-item {
    margin-bottom: 20px;
}

.register-form .el-input {
    width: 100%;
}

.button-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.register-button {
    width: 48%;
}

.login-button {
    width: 48%;
}
</style>