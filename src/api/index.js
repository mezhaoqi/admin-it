import axios from 'axios';

const baseURL = 'http://localhost:8888/api/private/v1/';
axios.defaults.baseURL = baseURL;

// Add a request interceptor
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    let token = localStorage.getItem('mytoken');
    if (token) {
        config.headers['Authorization'] = token
    }
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// 登录
export const checkUser = params => {
    return axios.post('login', params).then(res => res.data);
}

//获取用户列表
export const getUserList = params => {
    return axios.get('users', params).then(res => res.data);
}