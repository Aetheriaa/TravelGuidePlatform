<template>
    <div class="register-page">
        <Header />
        <div class="register-container">
            <el-card class="register-card" shadow="hover">
                <h2 class="register-title">
                    <i class="el-icon-user-solid"></i> 注册
                </h2>
                <el-form :model="user" :rules="rules" ref="registerFormRef" label-width="0" class="register-form">
                    <el-form-item prop="username">
                        <el-input v-model="user.username" placeholder="用户名 (4-20 个字符)" prefix-icon="User"
                            clearable></el-input>
                    </el-form-item>
                    <el-form-item prop="email">
                        <el-input v-model="user.email" placeholder="邮箱" prefix-icon="Message" clearable></el-input>
                    </el-form-item>
                    <el-form-item prop="code">
                        <div class="code-input-container">
                            <el-input v-model="user.code" placeholder="请输入验证码" prefix-icon="ChatLineRound"
                                class="code-input" />
                            <el-button type="primary" :disabled="codeDisabled" @click="sendCode" class="code-button">
                                {{ codeButtonText }}
                            </el-button>
                        </div>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input v-model="user.password" type="password" placeholder="密码 (6-20 个字符)" prefix-icon="Lock"
                            show-password @keyup.enter="submitForm"></el-input>
                    </el-form-item>
                    <el-form-item prop="confirmPassword">
                        <el-input v-model="user.confirmPassword" type="password" placeholder="确认密码" prefix-icon="Lock"
                            show-password @keyup.enter="submitForm"></el-input>
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
import { reactive, ref, watch, onBeforeUnmount } from 'vue';
import { register, sendVerificationCode } from '@/api/user';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';
import { User, Message, ChatLineRound, Lock } from '@element-plus/icons-vue';

const router = useRouter();
const registerFormRef = ref(null);

const user = reactive({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    code: '',
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
        { required: true, validator: validateConfirmPassword, trigger: 'blur' },
    ],
    code: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
        { len: 6, message: '验证码格式错误', trigger: 'blur' }
    ],
});

//错误信息
const errorMessage = ref('');

const submitForm = () => {
    registerFormRef.value?.validate((valid) => {
        if (valid) {
            // 调用注册 API
            register(user)
                .then(() => {
                    ElMessage.success('注册成功');
                    router.push('/login'); // 注册成功后跳转到登录页面
                })
                .catch((error) => {
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
watch(
    () => user.username,
    () => {
        errorMessage.value = '';
    }
);
watch(
    () => user.email,
    () => {
        errorMessage.value = '';
    }
);
//添加发送验证码
const codeDisabled = ref(false);
const codeButtonText = ref('获取验证码');
const countdown = ref(60);
let timer = null;
const sendCode = () => {
    // 验证邮箱
    registerFormRef.value?.validateField('email', (errorMessage) => { // 只验证邮箱
        if (errorMessage) {
            ElMessage.warning(errorMessage); // 显示具体的错误信息
            return;
        }
        // 调用发送验证码的 API
        sendVerificationCode(user.email)
            .then(response => {
                ElMessage.success('验证码已发送，请注意查收');
                // 倒计时
                codeDisabled.value = true; // 禁用按钮
                codeButtonText.value = `${countdown.value}秒后重新获取`;
                timer = setInterval(() => {
                    countdown.value--;
                    codeButtonText.value = `${countdown.value}秒后重新获取`;
                    if (countdown.value <= 0) {
                        clearInterval(timer);
                        codeDisabled.value = false;
                        codeButtonText.value = '获取验证码';
                        countdown.value = 60; // 重置计时器
                    }
                }, 1000);
            })
            .catch(error => {
                console.error("Error sending verification code:", error);
                ElMessage.error("发送失败");
            });
    });
};

// 在组件卸载前清除定时器, 避免内存泄露
onBeforeUnmount(() => {
    clearInterval(timer);
});
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
    max-width: 450px;
    /* 稍微大一点 */
    border-radius: 8px;
    padding: 30px;
}

.register-title {
    text-align: center;
    margin-bottom: 30px;
    color: #333;
    display: flex;
    /* 使用 Flexbox */
    align-items: center;
    /* 垂直居中 */
    justify-content: center;
    /* 水平居中 */
    gap: 10px;
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

/* 验证码输入框和按钮 */
.code-input-container {
    display: flex;
    gap: 10px;
}

.code-input {
    flex-grow: 1;
}

.code-button {
    width: 120px;
    /* 给定一个宽度 */
    flex-shrink: 0;
    /*防止被压缩*/
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