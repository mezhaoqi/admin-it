import axios from 'axios';

const baseURL = 'http://localhost:8888/api/private/v1/';
axios.defaults.baseURL = baseURL;

// Add a request interceptor
axios.interceptors.request.use(
    function (config) {
        // Do something before request is sent
        let token = localStorage.getItem('mytoken');
        if (token) {
            config.headers['Authorization'] = token
        }
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

// 登录
export const checkUser = params => {
    return axios.post('login', params).then(res => res.data);
}

//获取用户列表
export const getUserList = params => {
    return axios.get('users', params).then(res => res.data);
}

//修改用户状态
export const changeUserState = params => {
    return axios.put(`users/${params.uid}/state/${params.type}`).then(res => res.data);
}

//添加用户
export const addUser = params => {
    return axios.post('users', params).then(res => res.data);
}

//根据id获取用户
export const getUserById = params => {
    return axios.get(`users/${params}`).then(res => res.data);
}

//编辑用户
export const editUser = params => {
    return axios.put(`users/${params.id}`, params).then(res => res.data);
}

//删除用户
export const deleteUser = params => {
    return axios.delete(`users/${params}`).then(res => res.data);
}

//获取角色列表
export const getRoleList = () => {
    return axios.get('roles').then(res => res.data);
}

//分配用户角色
export const editUserRole = params => {
    return axios.put(`users/${params.id}/role`, { id: params.id, rid: params.rid }).then(res => res.data);
}

//获取权限列表
export const getRightList = params => {
    return axios.get(`rights/${params.type}`).then(res => res.data);
}

//删除角色权限
export const deleteRoleRight = params => {
    return axios.delete(`roles/${params.roleId}/rights/${params.rightId}`).then(res => res.data);
}

//角色授权
export const grantRoleRight = params => {
    return axios.post(`roles/${params.roleId}/rights`, { rids: params.rids }).then(res => res.data);
}

//添加角色
export const addRole = params => {
    return axios.post('roles', params).then(res => res.data);
}

//编辑角色
export const editRole = params => {
    return axios.put(`roles/${params.id}`, { roleName: params.roleName, roleDesc: params.roleDesc }).then(res => res.data);
}

//删除角色
export const deleteRole = params => {
    return axios.delete(`roles/${params.id}`).then(res => res.data);
}

//左侧菜单权限
export const getMenus = () => {
    return axios.get('menus').then(res => res.data);
}

//获取分类
export const getCategory = (params) => {
    return axios.get('categories', { params: params }).then(res => res.data);
}

//添加分类
export const addCategories = params => {
    return axios.post('categories', params).then(res => res.data);
}

//删除分类
export const deleteCategories = params => {
    return axios.delete(`categories/${params.id}`).then(res => res.data);
}

//修改分类
export const editCategories = params => {
    return axios.put(`categories/${params.id}`, { cat_name: params.cat_name }).then(res => res.data);
}

//根据id查询分类
export const getCategoryById = (params) => {
    return axios.get(`categories/${params.id}`).then(res => res.data);
}

//获取商品列表
export const getGoodsList = params => {
    return axios.get('goods', { params: params }).then(res => res.data);
}