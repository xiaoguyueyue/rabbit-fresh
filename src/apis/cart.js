import request from '@/utils/http'

// 加入购物车
export const insertCartAPI = ({skuId, count})=> {
    return request({
        url: '/member/cart',
        method: 'post',
        data:{
            skuId,
            count
        }
    })
}

// 获取购物车列表
export const getCartListAPI = () => {
    return request({
        url: '/member/cart'
    })
}


// 删除购物车列表
export const delCartListAPI = (ids) => {
    return request({
        url: '/member/cart',
        method: 'delete',
        data: {
            ids
        }
    })
}

// 合并购物车列表
export const mergeCartListAPI = (data) => {
    return request({
        url: '/member/cart/merge',
        method: 'post',
        data
    })
}