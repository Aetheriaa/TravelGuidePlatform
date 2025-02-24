import axios from 'axios';

const baseURL = '/api/v1/comments';

// 发表评论
export function createComment(data) {
    return axios.post(`${baseURL}`, data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
}

// 获取评论列表
export function getCommentsByGuideId(guideId) {
    return axios.get(`${baseURL}/${guideId}`);
}

//更新评论
// export function updateComment(data) {
//     return axios.put(`${baseURL}`, data, {
//         headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//         }
//     })
// }
export function updateComment(commentId, data) {
    return axios.put(`${baseURL}/${commentId}`, data, { // 使用模板字面量和正确的参数顺序
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
}
// 删除评论
export function deleteComment(commentId) {
    return axios.delete(`${baseURL}/${commentId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
}