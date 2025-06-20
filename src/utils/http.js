// axios基础封装
import axios from "axios";
import { ElMessage } from 'element-plus';  
import 'element-plus/theme-chalk/el-message.css';
import { useUserStore } from '@/stores/user';
import router from '@/router';

const httpInstance = axios.create({
    baseURL:'http://pcapi-xiaotuxian-front-devtest.itheima.net',
    timeout: 5000
})

// axios 请求拦截器
httpInstance.interceptors.request.use(config => {
    const userStore = useUserStore();
    if (userStore.userInfo?.token) {
        config.headers['Authorization'] = `Bearer ${userStore.userInfo.token}`;
    }
    return config
}, e => Promise.reject(e))

// axios 响应拦截器
httpInstance.interceptors.response.use(res => res.data, e => {
    // 处理错误
    ElMessage({type: 'warning', message: e.response?.data?.message || '请求失败，请稍后再试'});
    if (e.response?.status === 401) {
        // 清除用户信息
        const userStore = useUserStore();
        userStore.clearUserInfo();
        // 跳转到登录页
        router.push('/login');
    }
    return Promise.reject(e);
})

export default httpInstance