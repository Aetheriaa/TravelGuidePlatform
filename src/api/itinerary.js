import axios from 'axios';

const baseURL = '/api/v1/itineraries';

// 获取行程列表
export function getItineraries(params) {
    return axios.get(`${baseURL}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        params
    });
}

// 获取行程详情
export function getItinerary(id) {
    return axios.get(`${baseURL}/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
}

// 创建行程
export function createItinerary(data) {
    return axios.post(`${baseURL}`, data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
}

// 更新行程
export function updateItinerary(data) {
    return axios.put(`${baseURL}`, data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
}

// 删除行程
export function deleteItinerary(id) {
    return axios.delete(`${baseURL}/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
}