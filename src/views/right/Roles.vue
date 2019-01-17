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
    <el-button type="primary" plain @click="showAddDialogForm">添加角色</el-button>
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
          <el-button
            size="mini"
            type="primary"
            plain
            icon="el-icon-edit"
            @click="showEditDialog(scope.row)"
          ></el-button>
          <el-button
            size="mini"
            type="warning"
            plain
            icon="el-icon-delete"
            @click="deleteRole(scope.row)"
          ></el-button>
          <el-button
            size="mini"
            type="danger"
            plain
            icon="el-icon-check"
            title="授权角色"
            @click="showDialog(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 授权角色 -->
    <el-dialog title="授权角色" :visible.sync="dialogFormVisible">
      <div>
        <!-- 树形控件 -->
        <el-tree
          ref="tree"
          class="tree-container"
          :default-expand-all="true"
          :data="rightList"
          show-checkbox
          node-key="id"
          :default-expanded-keys="[2, 3]"
          :default-checked-keys="selectedRight"
          :props="defaultProps"
        ></el-tree>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitGrant">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加角色 -->
    <el-dialog title="添加角色" :visible.sync="addDialogFormVisible">
      <el-form :model="addForm" :rules="rules" label-width="80px" ref="addRoleForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleSubmit('addRoleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改角色 -->
    <el-dialog title="修改角色" :visible.sync="editDialogFormVisible">
      <el-form :model="editForm" label-width="80px" ref="editRoleForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleSubmit('editRoleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getRoleList,
  deleteRoleRight,
  getRightList,
  grantRoleRight,
  addRole,
  editRole,
  deleteRole
} from "@/api";
export default {
  data() {
    return {
      rolesList: [],
      dialogFormVisible: false,
      rightList: [],
      defaultProps: {
        children: "children",
        label: "authName" //指定节点标签为节点对象的某个属性值
      },
      selectedRight: [],
      currentRight: {},
      addDialogFormVisible: false,
      addForm: {
        roleName: "",
        roleDesc: ""
      },
      editDialogFormVisible: false,
      editForm: {
        roleName: "",
        roleDesc: "",
        id: 0
      },
      rules: {
        roleName: [{ required: true, message: "请输入角色名", trigger: "blur" }]
      }
    };
  },
  created() {
    this.initList();
  },
  methods: {
    initList() {
      getRoleList().then(res => {
        if (res.meta.status === 200) {
          this.rolesList = res.data;
        }
      });
    },
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
    },
    //显示授权窗口
    showDialog(row) {
      console.log(row);
      this.dialogFormVisible = true;
      //获取所有权限展示树形图上
      getRightList({ type: "tree" }).then(res => {
        if (res.meta.status === 200) {
          this.rightList = res.data;
        }
      });

      //先清空之前的数据
      this.selectedRight.length = 0;
      this.currentRight = row;
      //设置选中的角色的权限用于显示树形控件中
      this.currentRight.children.forEach(first => {
        if (first.children && first.children.length !== 0) {
          first.children.forEach(second => {
            if (second.children && second.children.length !== 0) {
              second.children.forEach(third => {
                //当前角色的权限展示树形控件中
                this.selectedRight.push(third.id);
              });
            }
          });
        }
      });
    },
    //提交授权
    submitGrant() {
      let rids = this.$refs.tree.getCheckedKeys().join(",");
      console.log(rids);
      // console.log(this.currentRight.id);
      grantRoleRight({ roleId: this.currentRight.id, rids: rids }).then(res => {
        if (res.meta.status === 200) {
          this.dialogFormVisible = false;
          this.$message({
            type: "success",
            message: res.meta.msg
          });
          //重新加载列表
          this.initList();
        }
      });
    },
    //显示添加角色窗口
    showAddDialogForm() {
      this.addDialogFormVisible = true;
    },
    //添加角色
    addRoleSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addRole(this.addForm).then(res => {
            console.log(res);
            if (res.meta.status === 201) {
              this.$message({
                type: "success",
                message: res.meta.msg
              });
              this.addDialogFormVisible = false;
              //重新加载列表
              this.initList();
            }
          });
        }
      });
    },
    //显示编辑角色窗口
    showEditDialog(row) {
      this.editDialogFormVisible = true;
      this.editForm.roleName = row.roleName;
      this.editForm.roleDesc = row.roleDesc;
      this.editForm.id = row.id;
      // console.log(this.editForm);
    },
    //编辑提交
    editRoleSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.editForm);
          editRole(this.editForm).then(res => {
            if (res.meta.status === 200) {
              this.$message({
                type: "success",
                message: "修改成功"
              });
              this.editDialogFormVisible = false;
              //重新加载列表
              this.initList();
            }
          });
        }
      });
    },
    //删除角色
    deleteRole(row) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteRole({ id: row.id }).then(res => {
            if (res.meta.status === 200) {
              this.$message({
                type: "success",
                message: "删除成功"
              });
              //重新加载列表
              this.initList();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
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
  .tree-container {
    overflow: auto;
    height: 300px;
  }
}
</style>

