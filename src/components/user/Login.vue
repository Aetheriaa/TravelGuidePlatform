<template>
    <div class="login-page">
        <Header />
        <div class="login-container">
            <el-card class="login-card" shadow="hover">
                <h2 class="login-title">
                    <!-- 注意：旧版的 el-icon-user 可能需要替换为 Element Plus Icons -->
                    <!-- 如果使用 Element Plus Icons, 应该像下面这样引入 -->
                    <!-- <el-icon><User /></el-icon> 登录 -->
                    <i class="el-icon-user"></i> 登录
                </h2>
                <el-form :model="user" :rules="rules" ref="loginFormRef" label-width="0" class="login-form"
                    @submit.prevent>
                    <el-form-item prop="usernameOrEmail">
                        <!-- 使用 Element Plus Icons 组件 -->
                        <el-input v-model="user.usernameOrEmail" placeholder="用户名或邮箱" :prefix-icon="User"
                            clearable></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                         <!-- 使用 Element Plus Icons 组件 -->
                        <el-input v-model="user.password" type="password" placeholder="密码" :prefix-icon="Lock"
                            show-password @keyup.enter="submitForm"></el-input>
                    </el-form-item>
                    <el-form-item prop="captcha">
                        <div class="captcha-container">
                             <!-- 使用 Element Plus Icons 组件 -->
                            <el-input v-model="user.captcha" placeholder="请输入验证码" :prefix-icon="Picture"
                                class="captcha-input" @keyup.enter="submitForm"></el-input>
                            <img :src="captchaImage" alt="验证码" @click="refreshCaptcha" class="captcha-image" />
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <div class="button-group">
                            <el-button type="primary" @click="submitForm" class="login-button">
                                登录
                            </el-button>
                            <!-- 给 router-link 添加类名 -->
                            <router-link to="/register" class="register-link-wrapper">
                                <!-- 内部按钮保持原类名，但CSS规则会修改 -->
                                <el-button class="register-button">注册</el-button>
                            </router-link>
                        </div>
                    </el-form-item>
                    <div class="forgot-password">
                        <router-link to="/forgot-password">忘记密码？</router-link>
                    </div>
                </el-form>
            </el-card>
        </div>
        <Footer />
    </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
// 假设你的 api/user.js 正确导出了 login 和 getCaptcha
import { login, getCaptcha } from '@/api/user';
import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';
// 引入 Element Plus Icons
import { User, Lock, Picture } from '@element-plus/icons-vue';

const router = useRouter();
const userStore = useUserStore();
const loginFormRef = ref(null);

const user = reactive({
    usernameOrEmail: '',
    password: '',
    captcha: '',
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
    captcha: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
    ],
});

const captchaImage = ref(''); // 存储验证码图片的 Base64 数据

const fetchCaptcha = async () => {
    try {
        // 注意：实际的 API 调用取决于你的 getCaptcha 函数实现
        // 假设它返回 { data: { data: { img: 'base64...' } } } 结构
        const response = await getCaptcha();
        // 根据你的实际API返回结构调整这里
        if (response && response.data && response.data.data && response.data.data.img) {
           captchaImage.value = response.data.data.img;
        } else {
            console.error('Unexpected captcha response structure:', response);
            ElMessage.error('获取验证码失败: 响应格式不正确');
            captchaImage.value = ''; // 清空或设置默认失败图片
        }
    } catch (error) {
        console.error('获取验证码时出错:', error);
        ElMessage.error('获取验证码失败，请稍后重试');
        captchaImage.value = ''; // 清空或设置默认失败图片
    }
};

const refreshCaptcha = () => {
    fetchCaptcha();
};

onMounted(() => {
    fetchCaptcha(); // 组件挂载后立即获取验证码
});

const submitForm = () => {
    loginFormRef.value?.validate(async (valid) => {
        if (valid) {
            try {
                // 假设 userStore.login 处理了请求和状态更新
                await userStore.login(user);
                ElMessage.success('登录成功！');
                // 登录成功，尝试跳转到来源页或首页
                const redirect = router.currentRoute.value.query.redirect || '/';
                router.push(redirect);
            } catch (error) {
                // 错误消息应由 userStore.login 或 API 拦截器处理并可能通过 ElMessage 显示
                // 此处可以再次刷新验证码作为用户反馈
                console.error('登录失败:', error); // 在控制台记录详细错误
                // 如果 store 或 API 调用没有显示错误消息，可以在这里添加一个通用的
                ElMessage.error('登录失败，请检查您的凭据和验证码');
                fetchCaptcha(); // 登录失败后刷新验证码
            }
        } else {
            console.log('表单验证失败!');
            return false;
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
}

.login-container {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 20px;
}

.login-card {
    width: 100%;
    max-width: 400px;
    border-radius: 8px;
    padding: 30px;
}

.login-title {
    text-align: center;
    margin-bottom: 30px;
    color: #333;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px; /* 图标和文字间距 */
}

/* 如果使用 Element Plus Icons, 可以调整图标大小 */
.login-title .el-icon {
  font-size: 1.2em; /* 稍微放大图标 */
}


.login-form .el-form-item {
    margin-bottom: 22px; /* 调整表单项间距 */
}

.login-form .el-input {
    width: 100%;
}

.captcha-container {
    display: flex;
    align-items: center; /* 垂直居中对齐输入框和图片 */
    gap: 10px;
}

.captcha-input {
    flex-grow: 1;
}

.captcha-image {
    width: 120px;
    height: 38px; /* 尝试与 Element Plus 输入框默认高度接近 */
    flex-shrink: 0;
    object-fit: cover;
    border-radius: 4px;
    border: 1px solid #dcdfe6; /* 使用 Element Plus 的边框颜色 */
    cursor: pointer;
    display: block; /* 防止图片底部出现额外空间 */
}
/* 微调输入框高度以匹配图片（如果需要） */
/* .captcha-container .el-input .el-input__wrapper {
    height: 38px;
} */


.button-group {
    display: flex;
    justify-content: space-between;
    align-items: center; /* 保持按钮垂直居中 */
}

.login-button {
    width: 48%; /* 登录按钮宽度 */
}

/* 新增：设置 router-link 包裹元素的样式 */
.register-link-wrapper {
    width: 48%;      /* 让链接包裹层占据 48% 的宽度 */
    display: block;  /* 使其可以应用宽度 */
}

/* 修改：让注册按钮宽度填充其父元素（即 router-link） */
.register-button {
    width: 100%;
}

.forgot-password {
    text-align: right;
    margin-top: 10px;
    font-size: 14px; /* 稍微调整字体大小 */
}

.forgot-password a {
    color: #409EFF;
    text-decoration: none;
}

.forgot-password a:hover {
    text-decoration: underline;
}
</style>