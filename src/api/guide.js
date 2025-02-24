import axios from 'axios';

const baseURL = '/api/v1/guides';

// 获取攻略列表
export function getGuideList(params) {
    return axios.get(`${baseURL}`, { params });
}

// 获取攻略详情
export function getGuideDetail(id) {
    return axios.get(`${baseURL}/${id}`);
}

// 发布攻略
export function createGuide(data) {
    return axios.post(`${baseURL}`, data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
}

// 编辑攻略
export function updateGuide(data) {
    return axios.put(`${baseURL}`, data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
}

// 删除攻略
export function deleteGuide(id) {
    return axios.delete(`${baseURL}/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
}

// 点赞攻略
export function likeGuide(guideId) {
    return axios.post(`${baseURL}/${guideId}/like`, null, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
}

// 取消点赞攻略
export function unlikeGuide(guideId) {
    return axios.delete(`${baseURL}/${guideId}/like`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
}

// 收藏攻略
export function favoriteGuide(guideId) {
    return axios.post(`${baseURL}/${guideId}/favorite`, null, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
}

// 取消收藏攻略
export function unfavoriteGuide(guideId) {
    return axios.delete(`${baseURL}/${guideId}/favorite`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
}

// 获取个性化推荐攻略
export function getRecommendedGuides(params) {
    return axios.get(`${baseURL}/recommended`, {
        params,
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` // 添加 Authorization 头
        }
    });
}

// 获取热门攻略
export function getPopularGuides(params) {
    return axios.get(`${baseURL}/popular`, { params }); // 传递分页参数
}

// 获取最新攻略
export function getLatestGuides(params) {
    return axios.get(`${baseURL}/latest`, { params }); // 传递分页参数
}

// 搜索攻略
export function searchGuides(params) {
    return axios.get(`${baseURL}`, { params });
}

// 记录攻略浏览
export function recordGuideView(userId, guideId) {
    return axios.post(`${baseURL}/${guideId}/view`, { userId }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
}