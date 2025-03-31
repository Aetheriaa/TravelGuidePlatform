<template>
    <div class="register-page">
        <Header />
        <div class="register-container">
            <el-card class="register-card" shadow="hover">
                <h2 class="register-title">
                    <!-- 同样注意图标使用方式 -->
                    <!-- <el-icon><UserFilled /></el-icon> 注册 -->
                     <i class="el-icon-user-solid"></i> 注册
                </h2>
                <el-form :model="user" :rules="rules" ref="registerFormRef" label-width="0" class="register-form">
                    <el-form-item prop="username">
                        <el-input v-model="user.username" placeholder="用户名 (4-20 个字符)" :prefix-icon="User"
                            clearable></el-input>
                    </el-form-item>
                    <el-form-item prop="email">
                        <el-input v-model="user.email" placeholder="邮箱" :prefix-icon="Message" clearable></el-input>
                    </el-form-item>
                    <el-form-item prop="code">
                        <div class="code-input-container">
                            <el-input v-model="user.code" placeholder="请输入验证码" :prefix-icon="ChatLineRound"
                                class="code-input" />
                            <el-button type="primary" :disabled="codeDisabled" @click="sendCode" class="code-button">
                                {{ codeButtonText }}
                            </el-button>
                        </div>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input v-model="user.password" type="password" placeholder="密码 (6-20 个字符)" :prefix-icon="Lock"
                            show-password @keyup.enter="submitForm"></el-input>
                    </el-form-item>
                    <el-form-item prop="confirmPassword">
                        <el-input v-model="user.confirmPassword" type="password" placeholder="确认密码" :prefix-icon="Lock"
                            show-password @keyup.enter="submitForm"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <div class="button-group">
                            <el-button type="primary" @click="submitForm" class="register-button">
                                注册
                            </el-button>
                            <!-- 给 router-link 添加类名 -->
                            <router-link to="/login" class="login-link-wrapper">
                                <!-- 内部按钮保持原类名，但CSS规则会修改 -->
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
// 假设你的 api/user.js 正确导出了 register 和 sendVerificationCode
import { register, sendVerificationCode } from '@/api/user';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';
// 引入 Element Plus Icons (确认已安装 @element-plus/icons-vue)
import { User, Message, ChatLineRound, Lock } from '@element-plus/icons-vue';
// 如果标题图标也想用新版，可以引入 UserFilled
// import { UserFilled } from '@element-plus/icons-vue';

const router = useRouter();
const registerFormRef = ref(null);

const user = reactive({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    code: '', // 邮箱验证码
});

// 自定义确认密码校验规则
const validateConfirmPassword = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请再次输入密码'));
    } else if (value !== user.password) {
        callback(new Error('两次输入密码不一致!'));
    } else {
        callback(); // 校验通过
    }
};

const rules = reactive({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 4, max: 20, message: '用户名长度需在 4 到 20 个字符之间', trigger: 'blur' },
        // 可以添加更复杂的用户名校验，例如只允许字母、数字、下划线等
        // { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线', trigger: 'blur' }
    ],
    email: [
        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
        { type: 'email', message: '请输入有效的邮箱地址', trigger: ['blur', 'change'] },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度需在 6 到 20 个字符之间', trigger: 'blur' },
        // 可以添加密码强度校验
        // { pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/, message: '密码至少包含一个字母和一个数字', trigger: 'blur' }
    ],
    confirmPassword: [
        { required: true, message: '请再次输入密码', trigger: 'blur' }, // 先加一个必填基础校验
        { validator: validateConfirmPassword, trigger: 'blur' }, // 再添加自定义校验
    ],
    code: [
        { required: true, message: '请输入邮箱验证码', trigger: 'blur' },
        // 通常验证码是6位数字，可以根据后端要求调整
        { pattern: /^\d{6}$/, message: '验证码格式为6位数字', trigger: 'blur' }
        // { len: 6, message: '验证码必须是6位', trigger: 'blur' } // len 更严格，必须刚好6位
    ],
});

// 用于显示后端返回的错误信息
const errorMessage = ref('');

const submitForm = () => {
    errorMessage.value = ''; // 先清除旧的错误信息
    registerFormRef.value?.validate((valid) => {
        if (valid) {
            // 校验通过，准备提交数据
            const registerData = {
                username: user.username,
                email: user.email,
                password: user.password,
                code: user.code,
            };
            register(registerData)
                .then(() => {
                    ElMessage.success('注册成功！');
                    router.push('/login'); // 注册成功后跳转到登录页面
                })
                .catch((error) => {
                    console.error("注册失败:", error);
                    // 尝试从 error 对象中获取后端返回的错误消息
                    let backendMsg = '注册失败，请稍后重试'; // 默认错误消息
                    if (error?.response?.data?.msg) {
                        backendMsg = error.response.data.msg;
                    } else if (error?.response?.data?.message) {
                        backendMsg = error.response.data.message;
                    } else if (error?.message) {
                        // 网络错误或其他非后端接口错误
                       // backendMsg = error.message; // 可能包含技术细节，酌情显示
                       backendMsg = "注册请求失败，请检查网络连接";
                    }
                    errorMessage.value = backendMsg; // 可以考虑是否在页面上直接显示 errorMessage
                    ElMessage.error(backendMsg);
                });
        } else {
            console.log('表单验证失败!');
            // 可以给用户一个提示，虽然具体字段错误已经显示
            ElMessage.warning('请检查表单填写是否正确');
            return false;
        }
    });
};

// 监听输入变化，清除错误信息 (可选，看是否需要在输入时清除整体错误)
// watch(user, () => {
//     errorMessage.value = '';
// });


// --- 发送邮箱验证码逻辑 ---
const codeDisabled = ref(false); // 控制按钮是否禁用
const codeButtonText = ref('获取验证码'); // 按钮文字
const countdown = ref(60); // 倒计时秒数
let timer = null; // 定时器

const sendCode = () => {
    // 1. 先单独校验邮箱字段是否有效
    registerFormRef.value?.validateField('email', (isValid, invalidFields) => {
        if (isValid) {
             // 邮箱格式正确，可以发送验证码
            codeDisabled.value = true; // 立刻禁用按钮，防止重复点击
            codeButtonText.value = '发送中...'; // 提示用户正在发送

            sendVerificationCode(user.email)
                .then(response => {
                    // 发送成功
                    ElMessage.success('验证码已发送至您的邮箱，请注意查收');
                    // 开始倒计时
                    codeButtonText.value = `${countdown.value}秒后重发`;
                    timer = setInterval(() => {
                        countdown.value--;
                        if (countdown.value <= 0) {
                            clearInterval(timer);
                            timer = null; // 清除定时器引用
                            codeDisabled.value = false;
                            codeButtonText.value = '获取验证码';
                            countdown.value = 60; // 重置倒计时
                        } else {
                            codeButtonText.value = `${countdown.value}秒后重发`;
                        }
                    }, 1000);
                })
                .catch(error => {
                    // 发送失败
                    console.error("发送验证码失败:", error);
                    let errorMsg = "验证码发送失败，请稍后重试";
                     if (error?.response?.data?.msg) {
                        errorMsg = error.response.data.msg;
                    } else if (error?.response?.data?.message) {
                        errorMsg = error.response.data.message;
                    }
                    ElMessage.error(errorMsg);
                    // 发送失败后，恢复按钮状态
                    codeDisabled.value = false;
                    codeButtonText.value = '获取验证码';
                });

        } else {
            // 邮箱格式无效，提示用户
            // invalidFields 对象包含了错误信息，但 validateField 的回调签名通常是 (isValid: boolean, invalidFields?: object)
            // Element Plus 的文档或实际测试确认 errorMessage 参数是否存在或如何获取
            // console.log('邮箱校验失败:', invalidFields);
            // ElMessage.warning('请输入有效的邮箱地址后再获取验证码'); // 通用提示
            // 或者尝试从 invalidFields 获取具体错误
            const emailError = invalidFields?.email?.[0]?.message;
            ElMessage.warning(emailError || '请输入有效的邮箱地址');

        }
    });
};

// 组件卸载前确保清除定时器，防止内存泄漏
onBeforeUnmount(() => {
    if (timer) {
        clearInterval(timer);
    }
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
    border-radius: 8px;
    padding: 30px 35px; /* 稍微增加左右内边距 */
}

.register-title {
    text-align: center;
    margin-bottom: 30px;
    color: #333;
    font-size: 20px; /* 调整标题字体大小 */
    font-weight: 600; /* 加粗一点 */
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}
/* 调整图标大小 */
.register-title .el-icon {
  font-size: 1.1em;
}


.register-form {
    /* label-width="0" 已经在 el-form 上设置，这里不需要 */
}

.register-form .el-form-item {
    margin-bottom: 22px; /* 统一表单项间距 */
}

/* 让 el-input 占满宽度 (通常默认就是这样，但明确一下无妨) */
/* .register-form .el-input {
    width: 100%;
} */

/* 验证码输入容器 */
.code-input-container {
    display: flex;
    align-items: center; /* 垂直居中对齐 */
    gap: 10px;          /* 输入框和按钮间距 */
}

.code-input {
    flex-grow: 1; /* 输入框占据剩余空间 */
}

.code-button {
    width: 110px;    /* 稍微调整宽度 */
    flex-shrink: 0; /* 防止按钮被压缩 */
    padding: 0 10px; /* 微调按钮内边距 */
    height: 38px; /* 尝试与输入框高度一致 */
    line-height: 38px; /* 确保文字垂直居中 */
}
/* 确保输入框高度一致 */
/* .code-input-container .el-input .el-input__wrapper {
    height: 38px;
} */


/* 底部按钮组 */
.button-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px; /* 与上方表单项增加一点间距 */
}

.register-button {
    width: 48%; /* 注册按钮宽度 */
}

/* 新增：设置 router-link 包裹元素的样式 */
.login-link-wrapper {
    width: 48%;      /* 让链接包裹层占据 48% 的宽度 */
    display: block;  /* 使其可以应用宽度 */
}

/* 修改：让登录按钮宽度填充其父元素（即 router-link） */
.login-button {
    width: 100%;
}
</style>