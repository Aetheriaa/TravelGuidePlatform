import axios from 'axios';

const baseURL = '/api/v1/users';

// 注册
export function register(data) {
    return axios.post(`${baseURL}/register`, data);
}

// 登录
export function login(data) {
    return axios.post(`${baseURL}/login`, data);
}

// 获取用户信息
export function getUserInfo() {
    return axios.get(`${baseURL}/info`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
}

// 更新用户信息
export function updateUserInfo(data) {
    return axios.put(`${baseURL}/update`, data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
}