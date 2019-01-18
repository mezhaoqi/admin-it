<template>
  <div class="addGoods">
    <!-- 面包屑 -->
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <!-- 步骤条 -->
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1"></el-step>
      <el-step title="步骤 2"></el-step>
      <el-step title="步骤 3"></el-step>
      <el-step title="步骤 4"></el-step>
      <el-step title="步骤 5"></el-step>
    </el-steps>
    <!-- tabs标签页 -->
    <el-tabs v-model="activeName" @tab-click="handleClick" tab-position="left" class="mt-20">
      <el-tab-pane label="基本信息" name="first">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品参数" name="second">商品参数</el-tab-pane>
      <el-tab-pane label="商品属性" name="third">商品属性</el-tab-pane>
      <el-tab-pane label="商品图片" name="fourth">
        <el-upload
          class="upload-demo"
          action="http://localhost:8888/api/private/v1/upload"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          list-type="picture"
          :headers="setHeader()"
          :on-success="uploadSuccess"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="fifth">商品内容</el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  data() {
    return {
      active: 0,
      activeName: "first",
      form: {
        goods_name: "",
        goods_cat: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        pics: {
          pic: ""
        },
        attrs: []
      }
    };
  },
  methods: {
    handleClick(tab, event) {
      //   console.log(tab, event);
      switch (tab.name) {
        case "first":
          this.active = 0;
          break;
        case "second":
          this.active = 1;
          break;
        case "third":
          this.active = 2;
          break;
        case "fourth":
          this.active = 3;
          break;
        case "fifth":
          this.active = 4;
          break;
        default:
          this.active = 0;
          break;
      }
    },
    // 文件列表移除文件时的钩子
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    // 点击已上传的文件链接时的钩子, 可以通过 file.response 拿到服务端返回数据
    handlePreview(file) {
      console.log(file);
    },
    // 设置请求头
    setHeader() {
      let token = localStorage.getItem("mytoken");
      return { Authorization: token };
    },
    // 图片上传成功的回调
    uploadSuccess(response, file, fileList) {
      console.log(response);
      console.log(file);
      console.log(fileList);
      this.form.pics.pic = response.data.tmp_path;
    }
  }
};
</script>
<style lang="scss" scoped>
</style>


