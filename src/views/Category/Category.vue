<template>
  <div class="category">
    <!-- 面包屑 -->
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>分类列表</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <!-- 按钮 -->
    <el-button type="primary" plain @click="showAddDialogForm">添加分类</el-button>
    <!-- 树形控件 -->
    <tree-grid
      v-loading="loading"
      :treeStructure="true"
      :columns="columns"
      :data-source="dataSource"
      @deleteCate="deleteCategory"
      @editCate="editCategory"
    ></tree-grid>
    <!-- 分页 -->
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

    <!-- 添加分类 -->
    <el-dialog title="添加分类" :visible.sync="addDialogFormVisible">
      <el-form :model="addForm" :rules="rules" label-width="80px" ref="addCategorySubmit">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            :options="options"
            :props="props"
            separator=">"
            v-model="selectedOptions"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategorySubmit('addCategorySubmit')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改分类 -->
    <el-dialog title="添加分类" :visible.sync="editDialogFormVisible">
      <el-form :model="editForm" :rules="rules" label-width="80px" ref="editCategorySubmit">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCategorySubmit('editCategorySubmit')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import TreeGrid from "@/components/TreeGrid/TreeGrid";
import {
  getCategory,
  addCategories,
  deleteCategories,
  editCategories,
  getCategoryById
} from "@/api";
export default {
  data() {
    return {
      dataSource: [],
      total: 0,
      columns: [
        {
          text: "分类名称",
          dataIndex: "cat_name",
          width: ""
        },
        {
          text: "是否有效",
          dataIndex: "cat_deleted",
          width: ""
        },
        {
          text: "排序",
          dataIndex: "cat_level",
          width: ""
        }
      ],
      pagesize: 10,
      pagenum: 1,
      addForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0
      },
      options: [],
      selectedOptions: [],
      addDialogFormVisible: false,
      rules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      props: {
        value: "cat_id",
        label: "cat_name"
      },
      loading: true,
      editDialogFormVisible: false,
      editForm: {
        cat_name: "",
        id: 0
      }
    };
  },
  components: {
    TreeGrid
  },
  created() {
    this.init();
  },
  methods: {
    //删除分类
    deleteCategory(cid) {
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteCategories({ id: cid }).then(res => {
            if (res => res.meta.status === 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.init();
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
    //修改分类
    editCategory(cid) {
      getCategoryById({ id: cid }).then(res => {
        if (res.meta.status === 200) {
          this.editForm.cat_name = res.data.cat_name;
          this.editForm.id = res.data.cat_id;
        }
      });
      this.editDialogFormVisible = true;
    },
    //分页控件事件
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
    // 初始化分类列表
    init() {
      this.loading = true;
      getCategory({
        type: 3,
        pagenum: this.pagenum,
        pagesize: this.pagesize
      }).then(res => {
        // console.log(res);
        if (res.meta.status === 200) {
          this.dataSource = res.data.result;
          this.total = res.data.total;
          this.loading = false;
        }
      });
    },
    handleChange(value) {
      console.log(value);
    },
    //显示添加分类窗口
    showAddDialogForm() {
      this.addDialogFormVisible = true;
      getCategory({
        type: 2
      }).then(res => {
        if (res.meta.status === 200) {
          console.log(res);
          this.options = res.data;
        }
      });
    },
    //添加分类
    addCategorySubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.selectedOptions.length == 0) {
            this.addForm.cat_pid = 0;
            this.addForm.cat_level = 0;
          } else if (this.selectedOptions.length == 1) {
            this.addForm.cat_level = 1;
            this.addForm.cat_pid = this.selectedOptions[0];
          } else if (this.selectedOptions.length == 2) {
            this.addForm.cat_level = 2;
            this.addForm.cat_pid = this.selectedOptions[1];
          }
          addCategories(this.addForm).then(res => {
            if (res.meta.status === 201) {
              this.selectedOptions.length = 0;
              this.$message({
                type: "success",
                message: "添加成功"
              });
              this.init();
            }
          });
          this.addDialogFormVisible = false;
        }
      });
    },
    //修改分类
    editCategorySubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          editCategories(this.editForm).then(res => {
            console.log(res);
            if (res.meta.status == 200) {
              this.editDialogFormVisible = false;
              this.$message({
                type: "success",
                message: "修改成功"
              });
              this.init();
            }
          });
        }
      });
    }
  }
};
</script>
<style lang="sass" scoped>

</style>


