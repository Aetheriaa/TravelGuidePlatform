<template>
    <div class="login-page">
        <Header />
        <div class="login-container">
            <el-card class="login-card" shadow="hover">
                <h2 class="login-title">登录</h2>
                <el-form :model="user" :rules="rules" ref="loginFormRef" label-width="0" class="login-form">
                    <el-form-item prop="usernameOrEmail">
                        <el-input v-model="user.usernameOrEmail" placeholder="用户名或邮箱" prefix-icon="el-icon-user"
                            clearable></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input v-model="user.password" type="password" placeholder="密码" prefix-icon="el-icon-lock"
                            show-password @keyup.enter="submitForm"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <div class="button-group">
                            <el-button type="primary" @click="submitForm" class="login-button">
                                登录
                            </el-button>
                            <router-link to="/register">
                                <el-button class="register-button">注册</el-button>
                            </router-link>
                        </div>
                    </el-form-item>
                </el-form>
                <div class="forgot-password">
                    <router-link to="/forgot-password">忘记密码？</router-link>
                </div>
            </el-card>
        </div>
        <Footer />
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';

const router = useRouter();
const userStore = useUserStore();
const loginFormRef = ref(null);

const user = reactive({
    usernameOrEmail: '',
    password: '',
});

const rules = reactive({
    usernameOrEmail: [
        { required: true, message: '请输入用户名或邮箱', trigger: 'blur' },
        {
            min: 3,
            max: 50,
            message: '用户名或邮箱长度在 3 到 50 个字符',
            trigger: 'blur',
        },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能少于 6 个字符', trigger: 'blur' },
    ],
});

const submitForm = () => {
    loginFormRef.value?.validate(async (valid) => {
        if (valid) {
            try {
                await userStore.login(user);
                ElMessage.success('登录成功！');
                router.push('/'); // 登录成功，跳转到首页
            } catch (error) {
                // 登录失败的错误处理已经在 userStore.login 中处理了
                // 这里不需要重复处理
                console.log(error);
            }
        }
    });
};
</script>

<style scoped>
.login-page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f0f2f5;
    /* 浅灰色背景 */
}

.login-container {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 20px;
    /* 增加一些内边距 */
}

.login-card {
    width: 100%;
    max-width: 400px;
    /* 最大宽度 */
    border-radius: 8px;
    /* 圆角 */
    padding: 30px;
    /* 增加内边距 */
}

.login-title {
    text-align: center;
    margin-bottom: 30px;
    color: #333;
}

.login-form {
    /* 移除 label-width */
}

.login-form .el-form-item {
    margin-bottom: 20px;
    /* 表单项间距 */
}

.login-form .el-input {
    width: 100%;
}

.button-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.login-button {
    width: 48%;
    /* 登录按钮宽度 */
}

.register-button {
    width: 48%;
    /* 注册按钮宽度 */
}

.forgot-password {
    text-align: right;
    margin-top: 10px;
}

.forgot-password a {
    color: #409EFF;
    text-decoration: none;
}

.forgot-password a:hover {
    text-decoration: underline;
}
</style>