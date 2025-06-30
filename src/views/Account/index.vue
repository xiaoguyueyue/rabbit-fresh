<script setup>
import { useUserStore } from '@/stores/user';
const userStore = useUserStore();
</script>

<template>
  <div class="xtx-account-page">
    <el-descriptions
      title="个人信息"
      direction="vertical"
      border
      style="margin-top: 20px"
    >
      <el-descriptions-item
        :rowspan="2"
        :width="140"
        label="头像"
        align="center"
      >
        <el-image
          style="width: 100px; height: 100px;"
          :src="userStore.userInfo?.avatar"
        />
      </el-descriptions-item>
      <el-descriptions-item label="姓名">
        <el-tag
        effect="light"
        round
      >
        {{userStore.userInfo?.nickname}}
      </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="性别">
        <el-tag
        effect="light"
        round
      >
        {{userStore.userInfo?.gender}}
      </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="生日">
        <el-tag
        effect="light"
        round
      >
        {{userStore.userInfo?.birthday}}
      </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="电话">
        <el-tag
        effect="light"
        round
      >
        {{userStore.userInfo?.mobile}}
      </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="职务">
        <el-tag
        effect="light"
        round
      >
        {{userStore.userInfo?.profession}}
      </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="省编码">
        <el-tag
        effect="light"
        round
      >
        {{userStore.userInfo?.provinceCode}}
      </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="市编码">
        <el-tag
        effect="light"
        round
      >
        {{userStore.userInfo?.cityCode}}
      </el-tag>
      </el-descriptions-item>
    </el-descriptions>
  </div>
  <iframe src="https://dify.gz.cvte.cn//chatbot/obzH0gY3LMpKh5R9"
style="width: 100%; height: 100%; min-height: 700px" frameborder="0"
allow="microphone"></iframe>
</template>


<style scoped lang="scss">
.xtx-account-page {
  margin:20px 100px
}

img {
  background-color: transparent !important;
  color: #4AC3B9;
}
</style>
