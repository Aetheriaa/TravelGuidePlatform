import axios from 'axios';

const baseURL = '/api/v1/replies';

// 获取某个主题下的所有回复
export function getRepliesByTopicId(topicId) {
    return axios.get(`${baseURL}/${topicId}`);
}

// 创建回复
export function createReply(data) {
    return axios.post(`${baseURL}`, data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
}

// 删除回复
export function deleteReply(replyId) {
    return axios.delete(`${baseURL}/${replyId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
}

// 更新回复  <-- 添加这个函数
export function updateReply(replyId, data) {
    return axios.put(`${baseURL}/${replyId}`, data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
}