import { ref } from 'vue'
import { defineStore } from 'pinia'
import { loginAPI } from '@/apis/user';

export const useUserStore = defineStore('user', () => {
    const userInfo = ref({})

    const getUserInfo = async ({ account, password }) => {
        const res = await loginAPI({ account, password });
        userInfo.value = res.result;
        return res;
    }

    const clearUserInfo = () => {
        userInfo.value = {};
    }

    const isLogin = () => {
        return userInfo.value.token && userInfo.value.token.length > 0;
    }

    return {
        userInfo,
        getUserInfo,
        clearUserInfo,
        isLogin
    }
},
{
  persist: true,
},)
  