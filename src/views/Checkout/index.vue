<script setup>
import { onMounted, ref } from 'vue'
import { getCheckInfoAPI, createOrderAPI, createAddressAPI, deleteAddressAPI } from '@/apis/checkout'
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useCarStore } from '@/stores/carStore';import {
  regionData,
} from "element-china-area-data";

const optionsnative_place = regionData
const router = useRouter()
const carStore = useCarStore();
const checkInfo = ref({})  // 订单对象
const curAddress = ref({})  // 地址对象
const toggAddress = ref({})
const toggleFlag = ref(false)
const regionCode = ref([])

const createAddressData = ref({
    receiver: "",
    contact: "",
    provinceCode: "",
    cityCode: "",
    countyCode: "",
    address: "",
    isDefault: 0
})
const addFlag = ref(false)

const getCheckInfo = async () => {
  const res = await getCheckInfoAPI()
  checkInfo.value = res.result
  curAddress.value = res.result.userAddresses.find(i => i.isDefault) || {}
  toggAddress.value = curAddress.value
}

onMounted(()=>{
    getCheckInfo()
})

const switchAddress = () => {
  curAddress.value = toggAddress.value
  toggleFlag.value = false
}

const cancleAddress = () => {
    toggAddress.value = curAddress.value
    toggleFlag.value = false
    addFlag.value = false
}

const submitOrder = async () => {
  if (!curAddress.value.id) {
    ElMessage({ type: 'warning', message: '请先选择收货地址' });
    return
  }
  const res = await createOrderAPI({
    deliveryTimeType:1,
    payType:1,
    payChannel:1,
    buyerMessage: '',
    goods:checkInfo.value.goods.map(item => {
      return {
        skuId:item.skuId,
        count:item.count,
      }
    }),
    addressId: curAddress.value.id
  })

  router.push({
    path:'pay',
    query:{
      id:res.result.id
    }
  })
  // 更新购物车
  carStore.updateCartList()

}

const createAddress = async () => {
  createAddressData.value.provinceCode = regionCode.value[0]
  createAddressData.value.cityCode = regionCode.value[1]
  createAddressData.value.countyCode = regionCode.value[2]
  if (!createAddressData.value.receiver || !createAddressData.value.contact || !createAddressData.value.address) {
    ElMessage({ type: 'warning', message: '请填写完整的收货地址信息' });
    return
  }
  const res = await createAddressAPI(createAddressData.value)
  if (res.code === "1") {
    ElMessage({ type: 'success', message: '地址添加成功' });
    getCheckInfo()
  } else {
    ElMessage({ type: 'warning', message: '地址添加失败，请稍后再试' });
  }
  getCheckInfo()
  addFlag.value = false
}

const deleteAddress = async (id) => {
  if (!id) return
  await deleteAddressAPI(id)
  getCheckInfo()
}


</script>

<template>
  <div class="xtx-pay-checkout-page">
    <div class="container">
      <div class="wrapper">
        <!-- 收货地址 -->
        <h3 class="box-title">收货地址</h3>
        <div class="box-body">
          <div class="address">
            <div class="text">
              <div class="none" v-if="!curAddress">您需要先添加收货地址才可提交订单。</div>
              <ul v-else>
                <li><span>收<i />货<i />人：</span>{{ curAddress.receiver }}</li>
                <li><span>联系方式：</span>{{ curAddress.contact }}</li>
                <li><span>收货地址：</span>{{ curAddress.fullLocation }} {{ curAddress.address }}</li>
              </ul>
            </div>
            <div class="action">
              <el-button size="large" @click="toggleFlag = true">切换地址</el-button>
              <el-button size="large" @click="addFlag = true">添加地址</el-button>
            </div>
          </div>
        </div>
        <!-- 商品信息 -->
        <h3 class="box-title">商品信息</h3>
        <div class="box-body">
          <table class="goods">
            <thead>
              <tr>
                <th width="520">商品信息</th>
                <th width="170">单价</th>
                <th width="170">数量</th>
                <th width="170">小计</th>
                <th width="170">实付</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="i in checkInfo.goods" :key="i.id">
                <td>
                  <a href="javascript:;" class="info">
                    <img :src="i.picture" alt="">
                    <div class="right">
                      <p>{{ i.name }}</p>
                      <p>{{ i.attrsText }}</p>
                    </div>
                  </a>
                </td>
                <td>&yen;{{ i.price }}</td>
                <td>{{ i.price }}</td>
                <td>&yen;{{ i.totalPrice }}</td>
                <td>&yen;{{ i.totalPayPrice }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- 配送时间 -->
        <h3 class="box-title">配送时间</h3>
        <div class="box-body">
          <a class="my-btn active" href="javascript:;">不限送货时间：周一至周日</a>
          <a class="my-btn" href="javascript:;">工作日送货：周一至周五</a>
          <a class="my-btn" href="javascript:;">双休日、假日送货：周六至周日</a>
        </div>
        <!-- 支付方式 -->
        <h3 class="box-title">支付方式</h3>
        <div class="box-body">
          <a class="my-btn " href="javascript:;">在线支付</a>
          <a class="my-btn" href="javascript:;">货到付款</a>
          <span style="color:#999">货到付款需付5元手续费</span>
        </div>
        <!-- 金额明细 -->
        <h3 class="box-title">金额明细</h3>
        <div class="box-body">
          <div class="total">
            <dl>
              <dt>商品件数：</dt>
              <dd>{{ checkInfo.summary?.goodsCount }}件</dd>
            </dl>
            <dl>
              <dt>商品总价：</dt>
              <dd>¥{{ checkInfo.summary?.totalPrice.toFixed(2) }}</dd>
            </dl>
            <dl>
              <dt>运<i></i>费：</dt>
              <dd>¥{{ checkInfo.summary?.postFee.toFixed(2) }}</dd>
            </dl>
            <dl>
              <dt>应付总额：</dt>
              <dd class="price">{{ checkInfo.summary?.totalPayPrice.toFixed(2) }}</dd>
            </dl>
          </div>
        </div>
        <!-- 提交订单 -->
        <div class="submit">
          <el-button type="primary" size="large" @click="submitOrder">提交订单</el-button>
        </div>
      </div>
    </div>
  </div>
  <!-- 切换地址 -->
  <el-dialog
    v-model="toggleFlag"
    title="切换地址"
    width="30%"
  >
        <div class="addressWrapper">
          <div
            class="text item"
            :class="{ active: toggAddress.id === address.id }"
            @click="toggAddress = address"
             v-for="address in checkInfo.userAddresses" :key="address.id"
          >
            <ul>
              <li><span>收<i />货<i />人：</span>{{ address.receiver }}</li>
              <li><span>联系方式：</span>{{ address.contact }}</li>
              <li><span>收货地址：</span>{{ address.fullLocation }} {{ address.address }}</li>
            </ul>
            <div class="addressDelete">
              <el-popconfirm
                confirm-button-text="确定"
                cancel-button-text="取消"
                width="0"
                title="确认删除?"
                @confirm="deleteAddress(address.id)"
              >
                <template #reference>
                  <el-button>x</el-button>
                </template>
              </el-popconfirm>
            </div>
          </div>
        </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancleAddress">取消</el-button>
        <el-button type="primary" @click="switchAddress">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 添加地址 -->
  <el-dialog
    v-model="addFlag"
    title="新增地址"
    width="30%"
  >
        <el-form :model="createAddressData" label-width="auto" style="max-width: 600px">
          <el-form-item label="姓名">
            <el-input v-model="createAddressData.receiver" />
          </el-form-item>
          <el-form-item label="联系方式">
            <el-input v-model="createAddressData.contact" />
          </el-form-item>
          <el-form-item label="省市区" prop="address">
              <el-cascader v-model="regionCode" :options="optionsnative_place" placeholder="请选择"/>
          </el-form-item>
          <el-form-item label="收货地址">
            <el-input v-model="createAddressData.address" />
          </el-form-item>
          <el-form-item label="默认">
            <el-switch
              v-model="createAddressData.isDefault"
              inline-prompt
              active-value=1
              inactive-value=0
              active-text="是"
              inactive-text="否"
            />
          </el-form-item>
        </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancleAddress">取消</el-button>
        <el-button type="primary" @click="createAddress">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>


</template>

<style scoped lang="scss">
@use "sass:color";
.xtx-pay-checkout-page {
  margin-top: 20px;

  .wrapper {
    background: #fff;
    padding: 0 20px;

    .box-title {
      font-size: 16px;
      font-weight: normal;
      padding-left: 10px;
      line-height: 70px;
      border-bottom: 1px solid #f5f5f5;
    }

    .box-body {
      padding: 20px 0;
    }
  }
}

.address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;

  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;

    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }

    >ul {
      flex: 1;
      padding: 20px;

      li {
        line-height: 30px;

        span {
          color: #999;
          margin-right: 5px;

          >i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }

    >a {
      color: $xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }

  .action {
    width: 420px;
    text-align: center;

    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;

      &:first-child {
        margin-right: 10px;
      }
    }
  }
}

.goods {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;

  .info {
    display: flex;
    text-align: left;

    img {
      width: 70px;
      height: 70px;
      margin-right: 20px;
    }

    .right {
      line-height: 24px;

      p {
        &:last-child {
          color: #999;
        }
      }
    }
  }

  tr {
    th {
      background: #f5f5f5;
      font-weight: normal;
    }

    td,
    th {
      text-align: center;
      padding: 20px;
      border-bottom: 1px solid #f5f5f5;

      &:first-child {
        border-left: 1px solid #f5f5f5;
      }

      &:last-child {
        border-right: 1px solid #f5f5f5;
      }
    }
  }
}

.my-btn {
  width: 228px;
  height: 50px;
  border: 1px solid #e4e4e4;
  text-align: center;
  line-height: 48px;
  margin-right: 25px;
  color: #666666;
  display: inline-block;

  &.active,
  &:hover {
    border-color: $xtxColor;
  }
}

.total {
  dl {
    display: flex;
    justify-content: flex-end;
    line-height: 50px;

    dt {
      i {
        display: inline-block;
        width: 2em;
      }
    }

    dd {
      width: 240px;
      text-align: right;
      padding-right: 70px;

      &.price {
        font-size: 20px;
        color: $priceColor;
      }
    }
  }
}

.submit {
  text-align: right;
  padding: 60px;
  border-top: 1px solid #f5f5f5;
}

.addressWrapper {
  max-height: 500px;
  overflow-y: auto;
}

.text {
  flex: 1;
  min-height: 90px;
  display: flex;
  align-items: center;
  position: relative;

  &.item {
    border: 1px solid #f5f5f5;
    margin-bottom: 10px;
    cursor: pointer;

    &.active,
    &:hover {
      border-color: $xtxColor;
      background: color.scale($xtxColor, $lightness: 50%);
    }

    >ul {
      padding: 10px;
      font-size: 14px;
      line-height: 30px;
    }
  }
  .addressDelete {
    position: absolute;
    right: 20px;
  }
}
</style>
