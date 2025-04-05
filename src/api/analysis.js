import axios from 'axios';

const baseURL = '/api/v1/analysis';

// 获取用户增长趋势数据
export function getUserGrowth(params) {
    return axios.get(`${baseURL}/user-growth`, { params });
}

// 获取攻略发布趋势数据
export function getGuidePublish(params) {
    return axios.get(`${baseURL}/guide-publish`, { params });
}

// 获取行程创建趋势数据
export function getItineraryCreate(params) {
    return axios.get(`${baseURL}/itinerary-create`, { params });
}