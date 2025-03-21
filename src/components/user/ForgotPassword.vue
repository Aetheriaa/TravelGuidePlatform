<template>
    <div class="forgot-password-page">
        <Header />
        <div class="forgot-password-container">
            <el-card class="forgot-password-card" shadow="hover">
                <h2 class="form-title">
                    <i class="el-icon-lock"></i> 忘记密码
                </h2>
                <el-form :model="form" :rules="rules" ref="formRef" label-width="0" class="forgot-password-form"
                    @submit.prevent>
                    <el-form-item prop="email">
                        <el-input v-model="form.email" placeholder="请输入注册邮箱" clearable prefix-icon="Message"></el-input>
                    </el-form-item>
                    <el-form-item prop="code">
                        <div class="code-input-container">
                            <el-input v-model="form.code" placeholder="请输入验证码" clearable prefix-icon="ChatDotRound"
                                class="code-input" />
                            <el-button type="primary" :disabled="codeDisabled" @click="sendCode" class="code-button">
                                {{ codeButtonText }}
                            </el-button>
                        </div>
                    </el-form-item>
                    <el-form-item prop="newPassword">
                        <el-input v-model="form.newPassword" type="password" placeholder="请输入新密码" show-password
                            prefix-icon="Lock"></el-input>
                    </el-form-item>
                    <el-form-item prop="confirmPassword">
                        <el-input v-model="form.confirmPassword" type="password" placeholder="请再次输入新密码" show-password
                            prefix-icon="Lock"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm" class="submit-button">重置密码</el-button>
                    </el-form-item>
                </el-form>
                <div class="login-link">
                    <router-link to="/login">返回登录</router-link>
                </div>
            </el-card>
        </div>
        <Footer />
    </div>
</template>

<script setup>
import { ref, reactive, onBeforeUnmount } from 'vue';
import { sendVerificationCode, resetPassword } from '@/api/user';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';
import { Message, ChatDotRound, Lock } from '@element-plus/icons-vue';

const form = reactive({
    email: '',
    code: '',
    newPassword: '',
    confirmPassword: '',
});

const rules = reactive({
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱格式', trigger: ['blur', 'change'] },
    ],
    code: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
        { len: 6, message: '验证码格式错误', trigger: 'blur' }
    ],
    newPassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
    ],
    confirmPassword: [
        { required: true, message: '请再次输入新密码', trigger: 'blur' },
        {
            validator: (rule, value, callback) => {
                if (value !== form.newPassword) {
                    callback(new Error('两次输入的密码不一致'));
                } else {
                    callback();
                }
            },
            trigger: 'blur',
        },
    ],
});

const codeDisabled = ref(false);
const codeButtonText = ref('获取验证码');
const countdown = ref(60);
let timer = null;

const sendCode = () => {
    formRef.value?.validateField('email', (errorMessage) => { // 只验证邮箱
        if (errorMessage) {
            ElMessage.warning(errorMessage); // 显示具体的错误信息
            return;
        }

        // 调用发送验证码的 API
        sendVerificationCode(form.email)
            .then((response) => {
                ElMessage.success('验证码已发送，请注意查收');
                // 倒计时
                codeDisabled.value = true;
                codeButtonText.value = `${countdown.value}秒后重新获取`;
                timer = setInterval(() => {
                    countdown.value--;
                    codeButtonText.value = `${countdown.value}秒后重新获取`;
                    if (countdown.value <= 0) {
                        clearInterval(timer);
                        codeDisabled.value = false;
                        codeButtonText.value = '获取验证码';
                        countdown.value = 60;
                    }
                }, 1000);
            })
            .catch((error) => {
                console.error('Error sending verification code:', error);
                ElMessage.error('发送失败');
            });
    });

};

const formRef = ref(null);
const router = useRouter();

const submitForm = () => {
    formRef.value.validate((valid) => {
        if (valid) {
            // 调用重置密码的 API
            resetPassword(form)
                .then((response) => {
                    ElMessage.success('密码重置成功，请重新登录');
                    // 跳转到登录页面
                    router.push('/login');
                })
                .catch((error) => {
                    console.error('Error resetting password:', error);
                    ElMessage.error('重置失败');
                });
        } else {
            console.log('error submit!!');
            return false;
        }
    });
};
// 在组件卸载前清除定时器
onBeforeUnmount(() => {
    clearInterval(timer);
});
</script>

<style scoped>
.forgot-password-page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f0f2f5;
}

.forgot-password-container {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 20px;
}

.forgot-password-card {
    width: 100%;
    max-width: 450px;
    /* 稍微大一点 */
    border-radius: 8px;
    padding: 30px;
}

.form-title {
    text-align: center;
    margin-bottom: 30px;
    color: #333;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.forgot-password-form .el-form-item {
    margin-bottom: 20px;
}

/* 验证码输入框和按钮 */
.code-input-container {
    display: flex;
    gap: 10px;
    /* 输入框和按钮的间距 */
}

.code-input {
    flex-grow: 1;
    /* 让输入框占据剩余空间 */
}

.code-button {
    width: 120px;
    /* 给定一个宽度 */
    flex-shrink: 0;
    /*防止被压缩*/
}

.submit-button {
    width: 100%;
}

.login-link {
    text-align: right;
    margin-top: 10px;
}

.login-link a {
    color: #409EFF;
    text-decoration: none;
}

.login-link a:hover {
    text-decoration: underline;
}
</style>