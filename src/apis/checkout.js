
import request from '@/utils/http'

// 核实订单信息
export const getCheckInfoAPI = () => {
    return request({
        url: '/member/order/pre'
    })
}

// 新增收货地址
export const createAddressAPI = (data) => {
    return request({
        url: '/member/address',
        method: 'post',
        data
    })
}

// 删除收货地址
export const deleteAddressAPI = (id) => {
    return request({
        url: `/member/address/${id}`,
        method: 'delete'
    })
}

// 创建订单
export const createOrderAPI = (data) => {
    return request({
        url: '/member/order',
        method: 'post',
        data
    })
}
