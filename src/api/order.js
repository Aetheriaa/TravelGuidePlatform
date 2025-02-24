import axios from 'axios';

const baseURL = '/api/v1/orders';

// 获取订单列表
export function getOrderList(params) {
    return axios.get(`${baseURL}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        params // 添加查询参数，如分页、排序、搜索等
    });
}

// 获取订单详情
export function getOrderDetail(orderId) {
    return axios.get(`${baseURL}/${orderId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
}

// 创建订单
export function createOrder(data) {
    return axios.post(`${baseURL}`, data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
}
// 取消订单
export function cancelOrder(orderId) {
    return axios.put(`${baseURL}/${orderId}/cancel`, null, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
}

export function payOrder(orderId) {
    return axios.put(`${baseURL}/${orderId}/pay`, null, { //  put请求, 传入 orderId
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
}

// 支付订单 (可选，根据你的实际需求实现)
// export function payOrder(orderId, paymentMethod) {
//   return axios.post(`${baseURL}/${orderId}/pay`, { paymentMethod });
// }
