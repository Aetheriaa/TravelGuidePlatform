import axios from 'axios';

const baseURL = '/api/v1/messages';

// 发送私信
export function sendMessage(data) {
    return axios.post(`${baseURL}`, data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
}

// 获取与某个用户的私信对话
export function getConversation(userId) {
    return axios.get(`${baseURL}/${userId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
}

// 获取私信列表 (最近联系人)
export function getRecentContacts() {
    return axios.get(`${baseURL}/recent`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
}

// 删除私信
export function deleteMessage(messageId) {
    return axios.delete(`${baseURL}/${messageId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
}

// 标记私信为已读 (可选)
export function markAsRead(messageId) {
    return axios.put(`${baseURL}/${messageId}/read`, null, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
}