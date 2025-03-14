import axios from 'axios';

const baseURL = '/api/v1/topics';

// 获取主题列表
export function getTopicList(params) {
    return axios.get(`${baseURL}`, { params });
}

// 获取主题详情
export function getTopicDetail(id) {
    return axios.get(`${baseURL}/${id}`);
}

// 创建主题
export function createTopic(data) {
    return axios.post(`${baseURL}`, data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
}

// 更新主题
export function updateTopic(data) {
    return axios.put(`${baseURL}`, data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
}

// 删除主题
export function deleteTopic(id) {
    return axios.delete(`${baseURL}/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
}