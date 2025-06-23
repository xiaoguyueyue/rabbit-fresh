import { ref } from 'vue'
import { defineStore } from 'pinia'
import { loginAPI } from '@/apis/user';
import { useCarStore } from './carStore'
import { mergeCartListAPI } from '@/apis/cart'


export const useUserStore = defineStore('user', () => {
    const userInfo = ref({})
    const carStore = useCarStore();

    const getUserInfo = async ({ account, password }) => {
        const res = await loginAPI({ account, password });
        userInfo.value = res.result;
        mergeCartListAPI(carStore.cartList.map(item => {
            return {
                skuId: item.skuId,
                selected: item.selected,
                count: item.count
            }
        }));
        carStore.updateCartList()
        return res
    }

    const clearUserInfo = () => {
        userInfo.value = {};
        carStore.clearCar(); // 清空购物车
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
  