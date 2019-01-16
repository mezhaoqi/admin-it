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
        <el-button type="primary" plain @click="addDialogFormVisible=true">添加用户</el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" border style="width: 100%" v-loading="loading" class="margin-20">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="mobile" label="联系方式" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#d3dce6"
            @change="changeUserState(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
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

    <!-- 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="addDialogFormVisible">
      <el-form :model="addForm" :rules="rules" label-width="80px" ref="addUserForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserSubmit('addUserForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogFormVisible">
      <el-form :model="editForm" :rules="rules" label-width="80px" ref="editUserForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserSubmit('editUserForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色 -->
    <el-dialog title="分配角色" :visible.sync="grantDialogFormVisible">
      <el-form :model="editForm" label-width="120px">
        <el-form-item label="当前用户：">
          <el-tag type="info">{{grantForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="请选择角色：">
          <el-select v-model="roleId" placeholder="请选择角色">
            <el-option
              v-for="(role,index) in roles"
              :key="index"
              :label="role.roleName"
              :value="role.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="grantDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="grantUserSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getUserList,
  changeUserState,
  addUser,
  getUserById,
  editUser,
  deleteUser,
  getRoleList,
  editUserRole
} from "@/api";
export default {
  data() {
    return {
      tableData: [],
      query: "",
      total: 0,
      pagesize: 10,
      pagenum: 1,
      addDialogFormVisible: false,
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      editDialogFormVisible: false,
      editForm: {
        username: "",
        email: "",
        mobile: "",
        id: 0
      },
      grantDialogFormVisible: false,
      grantForm: {},
      roles: [],
      roleId: "",
      loading: true,
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: "blur,change"
          }
        ],
        mobile: [{ required: true, message: "请输入手机号", trigger: "blur" }]
      }
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
      this.loading = true;
      getUserList({
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      }).then(res => {
        if (res.meta.status === 200) {
          this.tableData = res.data.users;
          this.total = res.data.total;
        } else {
          this.$message({
            message: "加载失败了",
            type: "warning"
          });
        }
      });
      this.loading = false;
    },

    //修改用户状态
    changeUserState(row) {
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
    },

    //添加用户
    addUserSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addUser(this.addForm).then(res => {
            console.log(res);
            if (res.meta.status === 201) {
              this.$message({
                type: "success",
                message: "添加成功"
              });
              this.addDialogFormVisible = false;
              this.init();
            } else {
              this.$message({
                message: res.meta.msg,
                type: "warning"
              });
            }
          });
        } else {
          console.log("校验失败");
          return false;
        }
      });
    },
    //显示编辑窗口
    showEditDialogForm(row) {
      this.editDialogFormVisible = true;
      getUserById(row.id).then(res => {
        if (res.meta.status === 200) {
          this.editForm.id = res.data.id;
          this.editForm.username = res.data.username;
          this.editForm.email = res.data.email;
          this.editForm.mobile = res.data.mobile;
        }
      });
    },
    //修改用户信息
    editUserSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          editUser(this.editForm).then(res => {
            if (res.meta.status === 200) {
              this.$message({
                type: "success",
                message: "修改成功"
              });
              this.editDialogFormVisible = false;
              this.init();
            } else {
              this.$message({
                type: "warning",
                message: "修改失败"
              });
              this.editDialogFormVisible = false;
            }
          });
        }
      });
    },
    //显示删除窗口
    showDeleteDialogForm(row) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteUser(row.id).then(res => {
            if (res.meta.status === 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.init();
            } else {
              this.$message({
                type: "warning",
                message: "删除失败"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //显示分配角色窗口
    showGrantDialogForm(row) {
      this.grantForm = row;
      this.grantDialogFormVisible = true;
      getRoleList().then(res => {
        if (res.meta.status === 200) {
          this.roles = res.data;
        }
      });
    },
    //分配角色
    grantUserSubmit() {
      if (!this.roleId) {
        this.$message({
          type: "warning",
          message: "用户角色不能为空"
        });
      } else {
        editUserRole({ id: this.grantForm.id, rid: this.roleId }).then(res => {
          if (res.meta.status === 200) {
            this.$message({
              type: "success",
              message: "分配角色成功"
            });
            this.grantDialogFormVisible = false;
          } else {
            this.$message({
              type: "warning",
              message: res.meta.msg
            });
          }
        });
      }
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
