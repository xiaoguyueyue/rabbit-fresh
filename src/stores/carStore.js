import {defineStore} from 'pinia';
import { ref } from 'vue';
import { useUserStore } from './user'
import { insertCartAPI, getCartListAPI,delCartListAPI } from '@/apis/cart'

export const useCarStore = defineStore('car', ()=>{
    const userStore = useUserStore();
    const cartList = ref([]);
    const updateCartList = async () => {
        const res = await getCartListAPI();
        cartList.value = res.result || [];
    }
    const addCar = async (good) => {
        if (userStore.isLogin()) {
            // 如果用户已登录，添加到云端购物车
            good.userId = userStore.userInfo.id;
            await insertCartAPI({ skuId: good.skuId, count: good.count });
            updateCartList();
        }else{
            // 如果用户未登录，添加到本地购物车
            const index = cartList.value.findIndex(item => item.skuId === good.skuId);
            if (index !== -1) {
                cartList.value[index].count += good.count;
            } else {
                good.count = 1;
                cartList.value.push(good);
            }
        }
    };
    const removeCar = async (skuId) => {
        if (userStore.isLogin()) {
            // 如果用户已登录，删除云端购物车中的商品
            await delCartListAPI([skuId]);
            updateCartList();
        }else{
            const index = cartList.value.findIndex(item => item.skuId === skuId);
            if (index !== -1) {
                cartList.value.splice(index, 1);
            }
        }
    };
    const clearCar = () => {
        cartList.value = [];
    };
    const getCarList = () => {
        return cartList;
    };

    // 单选功能
    const singleCheck = (skuId, selected) => {
        const item = cartList.value.find(item => item.skuId === skuId)
        item.selected = selected;
    }
    return {
        cartList,
        addCar,
        removeCar,
        clearCar,
        getCarList,
        singleCheck
    };
},
{
  persist: true,
});