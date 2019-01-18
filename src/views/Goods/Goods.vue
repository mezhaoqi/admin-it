<template>
  <div class="goods">
    <!-- 面包屑 -->
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-input
          placeholder="请输入内容"
          class="search-input"
          v-model="query"
          @keydown.native.enter="init"
        >
          <el-button slot="append" icon="el-icon-search" @click="init"></el-button>
        </el-input>
        <el-button type="primary" plain @click="addGoods">添加商品</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading" class="margin-20">
      <el-table-column type="index" label="编号" width="50"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="180"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格" width="180"></el-table-column>
      <el-table-column prop="goods_state" label="商品状态" width="180"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
      <el-table-column prop="add_time" label="创建时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            plain
            icon="el-icon-edit"
            @click="showEditDialogForm(scope.row)"
          ></el-button>
          <el-button
            size="mini"
            type="warning"
            plain
            icon="el-icon-delete"
            @click="showDeleteDialogForm(scope.row)"
          ></el-button>
          <el-button
            size="mini"
            type="danger"
            plain
            icon="el-icon-check"
            @click="showGrantDialogForm(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-row>
        <el-col :span="24">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="1"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="1"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { getGoodsList } from "@/api";
export default {
  data() {
    return {
      loading: false,
      query: "",
      tableData: [],
      total: 0,
      pagesize: 10,
      pagenum: 1
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      getGoodsList({
        query: this.query,
        pagenum: this.pagenum,
        pagesize: this.pagesize
      }).then(res => {
        if (res.meta.status === 200) {
          this.tableData = res.data.goods;
          this.total = res.data.total;
          //   console.log(res);
        }
      });
    },
    addGoods() {
      this.$router.push({ name: "AddGoods" });
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.init();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.init();
    },
    showEditDialogForm() {},
    showDeleteDialogForm() {}
  }
};
</script>
<style lang="scss" scoped>
.goods {
  .margin-20 {
    margin: 20px 0;
  }
  .search-input {
    width: 300px;
  }
  .page {
    padding: 5px 0;
    background-color: #d3dce6;
  }
}
</style>
