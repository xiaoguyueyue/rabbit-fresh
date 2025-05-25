<script setup>
import { getCategoryFilterAPI,getSubCategoryAPI } from '@/apis/category';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import GoodsItem from '../Home/components/GoodsItem.vue';

// 获取面包屑导航数据
const categoryData = ref({})
const route = useRoute()
const disabled = ref(false)

onMounted(() => {
  getCategoryFilterAPI(route.params.id).then(res => {
    categoryData.value = res.result
  })
});

// 获取基础列表数据渲染
const goodList = ref([])
const reqData = ref({
  categoryId: route.params.id,
  page: 1,
  pageSize: 10,
  sortField: "publishTime",
})
const getSubCategory = async () => {
  const res = await getSubCategoryAPI(reqData.value)
  goodList.value = res.result.items
  disabled.value = false
}
onMounted(() => {getSubCategory()});

const tabChange = () => {
  reqData.value.page = 1
  getSubCategory()
}

const load = async () => {
  reqData.value.page++
  const res = await getSubCategoryAPI(reqData.value)
  if (res.result.items.length === 0) {
    disabled.value = true
    return
  }
  goodList.value.push(...res.result.items)
}

</script>

<template>
  <div class="container ">
    <!-- 面包屑 -->
    <div class="bread-container">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: `/category/${categoryData.parentId}` }">{{categoryData.parentName}}
        </el-breadcrumb-item>
        <el-breadcrumb-item>{{categoryData.name}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="sub-container">
      <el-tabs  v-model="reqData.sortField" @tab-click="tabChange()">
        <el-tab-pane label="最新商品" name="publishTime"></el-tab-pane>
        <el-tab-pane label="最高人气" name="orderNum"></el-tab-pane>
        <el-tab-pane label="评论最多" name="evaluateNum"></el-tab-pane>
      </el-tabs>
      <div class="body" v-infinite-scroll="load" :infinite-scroll-disabled="disabled">
         <!-- 商品列表-->
          <GoodsItem v-for="item in goodList" :key="item.id" :good="item"></GoodsItem>
      </div>
    </div>
  </div>

</template>



<style lang="scss" scoped>
.bread-container {
  padding: 25px 0;
  color: #666;
}

.sub-container {
  padding: 20px 10px;
  background-color: #fff;

  .body {
    display: flex;
    flex-wrap: wrap;
    padding: 0 10px;
  }
}
</style>