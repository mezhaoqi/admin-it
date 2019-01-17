<template>
  <div class="roles">
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>角色管理</el-breadcrumb-item>
          <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <!-- 按钮 -->
    <el-button type="primary" plain>添加角色</el-button>
    <!-- 表格 -->
    <el-table :data="rolesList" style="width: 100%" border class="mt-20">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row v-for="firstChildren in scope.row.children" :key="firstChildren.id">
            <el-col :span="4">
              <el-tag
                closable
                @close="deleteRoleRight(scope.row,firstChildren.id)"
              >{{firstChildren.authName}}</el-tag>
              <i class="el-icon-arrow-right" v-if="firstChildren.children.length!==0"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="secondChildren in firstChildren.children" :key="secondChildren.icon">
                <el-col :span="4">
                  <el-tag
                    closable
                    type="success"
                    @close="deleteRoleRight(scope.row,secondChildren.id)"
                  >{{secondChildren.authName}}</el-tag>
                  <i class="el-icon-arrow-right" v-if="firstChildren.children.length!==0"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    v-for="thirdChildren in secondChildren.children"
                    :key="thirdChildren.id"
                    closable
                    type="warning"
                    @close="deleteRoleRight(scope.row,thirdChildren.id)"
                  >{{thirdChildren.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="scope.row.children.length==0">
            <el-col :span="24">没有分配任何权限</el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="角色名称" prop="roleName" width="130px"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc" width="130px"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain icon="el-icon-edit"></el-button>
          <el-button size="mini" type="warning" plain icon="el-icon-delete"></el-button>
          <el-button size="mini" type="danger" plain icon="el-icon-check"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getRoleList, deleteRoleRight } from "@/api";
export default {
  data() {
    return {
      rolesList: []
    };
  },
  created() {
    getRoleList().then(res => {
      console.log(res);
      if (res.meta.status === 200) {
        this.rolesList = res.data;
      }
    });
  },
  methods: {
    //删除权限
    deleteRoleRight(row, rightId) {
      deleteRoleRight({ roleId: row.id, rightId: rightId }).then(res => {
        if (res.meta.status === 200) {
          row.children = res.data;
        } else {
          this.$message({
            type: "error",
            message: res.meta.msg
          });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.roles {
  .el-tag {
    margin-bottom: 5px;
    margin-right: 5px;
  }
}
</style>

