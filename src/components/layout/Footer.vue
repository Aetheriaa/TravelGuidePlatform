<template>
    <footer class="custom-footer">
        <div class="footer-content">
            <div class="footer-links">
                <!-- <router-link :to="{ name: 'About' }" class="footer-link">关于我们</router-link>
                <span class="separator">|</span>
                <router-link :to="{ name: 'Contact' }" class="footer-link">联系我们</router-link>
                <span class="separator">|</span>
                <router-link :to="{ name: 'Terms' }" class="footer-link">用户协议</router-link>
                <span class="separator">|</span>
                <router-link :to="{ name: 'Privacy' }" class="footer-link">隐私政策</router-link> -->
                <router-link :to="{ name: 'HomeView' }" class="footer-link">关于我们</router-link>
                <span class="separator">|</span>
                <router-link :to="{ name: 'HomeView' }" class="footer-link">联系我们</router-link>
                <span class="separator">|</span>
                <router-link :to="{ name: 'HomeView' }" class="footer-link">用户协议</router-link>
                <span class="separator">|</span>
                <router-link :to="{ name: 'HomeView' }" class="footer-link">隐私政策</router-link>
            </div>
            <p class="copyright">
                © {{ new Date().getFullYear() }} 旅游攻略分享平台. All rights reserved.
                <a href="https://beian.miit.gov.cn/" target="_blank" class="beian-link">
                    <!-- 您的备案号 -->
                </a>
            </p>
            <div class="social-links">
                
                <a href="https://aetheria.top/" class="social-icon"><i class="el-icon-wechat"></i></a>
                <a href="#" class="social-icon"><i class="el-icon-weibo"></i></a>
                <a href="#" class="social-icon"><i class="el-icon-qq"></i></a>
            </div>
        </div>
    </footer>
</template>

<script setup>


</script>

<style scoped>
.custom-footer {
    background-color: #fff;
    /* 与 Header 相同的白色背景 */
    color: #555;
    /* 较深的文字颜色，与 Header 协调 */
    padding: 30px 0;
    /* 调整内边距 */
    text-align: center;
    border-top: 1px solid #e0e0e0;
    /* 与 Header 类似的细边框 */
    font-size: 14px;
}

.footer-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    /* 使用 Flexbox 布局 */
    flex-direction: column;
    /* 垂直排列 */
    align-items: center;
    /* 水平居中 */
}

.footer-links {
    margin-bottom: 15px;
    /* 调整间距 */
    display: flex;
    /* 使用flex布局 */
    flex-wrap: wrap;
    /* 允许换行 */
    justify-content: center;
    /* 水平居中 */
}

.footer-link {
    color: #666;
    /* 链接颜色 */
    text-decoration: none;
    margin: 5px 15px;
    /* 调整链接间距 */
    transition: color 0.3s ease;
}

.footer-link:hover {
    color: #409EFF;
    /* 鼠标悬停时，与 Header 强调色一致 */
}

.separator {
    color: #999;
    /* 分隔符颜色 */
}

.copyright {
    margin-bottom: 15px;
    color: #777;
    /* 版权信息颜色 */
    line-height: 1.6;
    /*增加行高 */
}

.beian-link {
    color: #777;
    text-decoration: none;
    margin-left: 5px;
    transition: color 0.3s ease;
}

.beian-link:hover {
    color: #409EFF;
    text-decoration: underline;
}

.social-links {
    display: flex;
    /* 使用flex布局 */
    justify-content: center;
    /* 水平居中 */
}

.social-icon {
    color: #777;
    margin: 0 10px;
    font-size: 20px;
    text-decoration: none;
    transition: color .3s;
}

.social-icon:hover {
    color: #409EFF;
}
</style>