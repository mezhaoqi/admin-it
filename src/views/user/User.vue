<template>
  <div class="user">
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>用户列表</el-breadcrumb-item>
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
        <el-button type="primary" plain>添加用户</el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="mobile" label="联系方式" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeUserState(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain icon="el-icon-edit"></el-button>
          <el-button size="mini" type="warning" plain icon="el-icon-delete"></el-button>
          <el-button size="mini" type="danger" plain icon="el-icon-check"></el-button>
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
            :page-sizes="[1, 2, 3, 4]"
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
import { getUserList, changeUserState } from "@/api";
export default {
  data() {
    return {
      tableData: [],
      query: "",
      total: 0,
      pagesize: 1,
      pagenum: 1
    };
  },
  methods: {
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
    init() {
      getUserList({
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      }).then(res => {
        this.tableData = res.data.users;
        this.total = res.data.total;
      });
    },
    changeUserState(row) {
      //   console.log(row);
      changeUserState({ uid: row.id, type: row.mg_state }).then(res => {
        if (res.meta.status === 200) {
          this.$message({
            message: "成功修改用户状态",
            type: "success"
          });
        } else {
          this.$message({
            message: "修改用户状态失败了",
            type: "warning"
          });
        }
      });
    }
  },
  created() {
    this.init();
  }
};
</script>

<style lang="scss" scoped>
.user {
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
