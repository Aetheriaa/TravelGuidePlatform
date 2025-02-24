import axios from 'axios';

const baseURL = '/api/v1/products';

// 获取产品列表
export function getProductList(params) {
    return axios.get(`${baseURL}`, { params });
}

// 获取产品详情
export function getProductDetail(id) {
    return axios.get(`${baseURL}/${id}`);
}

// 创建产品
export function createProduct(data) {
    return axios.post(`${baseURL}`, data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
}

// 更新产品
export function updateProduct(data) {
    return axios.put(`${baseURL}`, data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
}
//更新产品状态
export function updateProductStatus(id, status) {
    return axios.put(`${baseURL}/${id}/${status}`, null, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
}

// 删除产品
export function deleteProduct(id) {
    return axios.delete(`${baseURL}/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
}

// 搜索产品
export function searchProducts(params) {
    return axios.get(`${baseURL}`, { params });
}