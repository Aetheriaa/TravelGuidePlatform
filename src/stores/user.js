import { defineStore } from 'pinia';
import { login, getUserInfo } from '@/api/user';
import { ElMessage } from 'element-plus';

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null,
        token: localStorage.getItem('token') || null,
    }),
    getters: {
        isLoggedIn: (state) => !!state.token,
        currentUser: (state) => state.user,
    },
    actions: {
        async login(userData) {
            try {
                const response = await login(userData);
                const token = response.data.data.token;
                this.token = token;
                localStorage.setItem('token', token);
                // 获取用户信息
                await this.fetchUserInfo();
                return response.data.data;
            } catch (error) {
                ElMessage.error(error.response.data.msg);
                throw error; // 抛出错误，以便在组件中处理
            }
        },
        async fetchUserInfo() {
            try {
                const response = await getUserInfo();
                this.user = response.data.data;
                localStorage.setItem('user', JSON.stringify(response.data.data)); // 持久化 user 信息到 localStorage
            } catch (error) {
                this.logout();
                throw error;
            }
        },
        logout() {
            this.user = null;
            this.token = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
        loadUserFromStorage() { // loadUserFromStorage action
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    this.user = JSON.parse(storedUser);
                    this.token = localStorage.getItem('token') || null; // 也要恢复 token，虽然 state 中已经初始化了，但为了严谨
                    if (this.user && this.token) {
                        console.log('User info loaded from storage:', this.user);
                    }
                } catch (error) {
                    console.error('Failed to load user from storage:', error);
                    localStorage.removeItem('user'); // 清除可能损坏的 user 数据
                }
            }
        },
    },
});