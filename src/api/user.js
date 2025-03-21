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

export function getUserGuideHistory(params) {
    return axios.get(`${baseURL}/guide-history`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        params // 传递分页参数
    });
}

// 获取当前用户点赞的攻略
export function getUserLikedGuides(params) {
    return axios.get(`${baseURL}/liked-guides`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        params
    });
}

// 获取当前用户收藏的攻略
export function getUserFavoriteGuides(params) {
    return axios.get(`${baseURL}/favorite-guides`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        params
    });
}

// 关注用户
export function followUser(userId) {
    return axios.post(`${baseURL}/${userId}/follow`, null, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
}

// 取消关注用户
export function unfollowUser(userId) {
    return axios.delete(`${baseURL}/${userId}/follow`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
}
// 获取关注列表
export function getFollowing(userId) {
    return axios.get(`${baseURL}/${userId}/following`);
}

// 获取粉丝列表
export function getFollowers(userId) {
    return axios.get(`${baseURL}/${userId}/followers`);
}
// 检查是否关注
export function checkFollowing(userId) {
    return axios.get(`${baseURL}/${userId}/is-following`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
}

// 根据用户 ID 获取用户信息
export function getUserInfoById(userId) {
    return axios.get(`${baseURL}/${userId}`);
}

// 获取用户的关注数
export function getFollowingCount(userId) {
    return axios.get(`/api/v1/users/${userId}/following/count`);
}

// 获取用户的粉丝数
export function getFollowerCount(userId) {
    return axios.get(`${baseURL}/${userId}/followers/count`);
}

// 搜索用户
export function searchUsers(keyword) {
    return axios.get(`${baseURL}/search`, {
        params: {
            keyword
        }
    });
}

// 发送邮箱验证码
export function sendVerificationCode(email) {
    return axios.post('/api/v1/users/send-verification-code', {email});
}

// 重置密码
export function resetPassword(data) {
    return axios.post('/api/v1/users/reset-password', data);
}