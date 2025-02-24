import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { useUserStore } from './stores/user';

const app = createApp(App);
app.use(createPinia());
const userStore = useUserStore(); //  获取 userStore 实例
userStore.loadUserFromStorage(); //  在应用挂载前调用 loadUserFromStorage
app.use(router);
app.use(ElementPlus);

app.mount('#app');
