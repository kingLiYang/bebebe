<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 职务列表
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <!-- <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <el-select v-model="select_cate" placeholder="筛选省份" class="handle-select mr10">
                    <el-option key="1" label="广东省" value="广东省"></el-option>
                    <el-option key="2" label="湖南省" value="湖南省"></el-option>
                </el-select>
        <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>-->
        <!-- <el-button type="primary" icon="search" @click="search">搜索</el-button> -->
        <el-button type="primary" @click="handleAdd()">添加</el-button>
      </div>
      <el-table :data="tableData" border style="width: 100%" ref="multipleTable" v-loading="loading">
        <el-table-column type="index" width="100" label="序号" align="center"></el-table-column>
        <el-table-column prop="department" label="部门" align="center"></el-table-column>
        <el-table-column prop="name" label="职务" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="small" @click="handleMenu(scope.$index, scope.row)">分配菜单</el-button>
            <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
            <el-button size="small" type="danger" @click="handleDel(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="1000">
                </el-pagination>
      </div>-->
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog :title="title" :visible.sync="editVisible" width="30%">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="部门">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="职务">
          <el-input v-model="form.options"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">返 回</el-button>
        <el-button type="primary" @click="saveEdit">提 交</el-button>
      </span>
    </el-dialog>

    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteRow">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限 树-->
    <el-dialog title="分配菜单" :visible.sync="allotVisible" width="30%">
      <el-tree
        :data="data2"
        show-checkbox
		highlight-current
        node-key="o_id"
        ref="tree"
        :default-expand-all="true"
        :default-checked-keys="data3"
        :props="defaultProps"
      ></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="allotVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotOrder">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      // url: './static/vuetable.json',
      tableData: [],
      title: "添加职务",
      editVisible: false,
      delVisible: false,
      allotVisible: false, // 分配菜单 弹框
      form: {
        name: "",
        options: ""
      },
      r_id: "",
      defaultProps: {
        children: "son",
        label: "name"
      },
      data2: [],
      data3: [],
      token: ""
    };
  },

  created() {
    this.token = window.sessionStorage.getItem("token");
    this.getData();
  },
  methods: {
    getData() {
      // // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
      // if (process.env.NODE_ENV === 'development') {
      //     this.url = '/ms/table/list';
      // };
      this.$axios
        .post(this.URL_API + "/berry/public/index.php/role/index",{token:this.token},
          {
            transformRequest: [
              function(data) {
                let ret = "";
                for (let it in data) {
                  ret +=
                    encodeURIComponent(it) +
                    "=" +
                    encodeURIComponent(data[it]) +
                    "&";
                }
                return ret;
              }
            ]
          })
        .then(res => {
          if(res.data.code == 0){
          this.tableData = res.data.data;
          this.loading = false;
          }else if(res.data.code == 450){
            this.$message.success("登录时间过长，请重新登录");
            this.$router.push("/login");
          }

        });
    },
    handleAdd() {
      this.title = "添加职务";
      this.form.name = "";
      this.form.options = "";
      this.editVisible = true;
    },
    // 添加权限  提交   修改权限  提交
    saveEdit() {
      let o_id = "";
      if (this.title == "修改职务") {
        o_id = this.r_id;
      } else {
        o_id = "";
      }

      let webData = {
        name: this.form.options,
        department: this.form.name,
        r_id: o_id,
        token: this.token
      };
      this.$axios
        .post(this.URL_API + "/berry/public/index.php/role/add", webData,
          {
            transformRequest: [
              function(data) {
                let ret = "";
                for (let it in data) {
                  ret +=
                    encodeURIComponent(it) +
                    "=" +
                    encodeURIComponent(data[it]) +
                    "&";
                }
                return ret;
              }
            ]
          })
        .then(res => {
          // this.tableData = res.data.data;
          if (res.data.code == 0) {
              this.editVisible = false;
            if (this.title == "修改职务") {
              this.$message.success("修改成功");
            } else {
              this.$message.success("添加成功");
            }

            
            this.getData();
          }else if(res.data.code == 450){
            this.$message.success("登录时间过长，请重新登录");
            this.$router.push("/login");
          }
        });
    },
    handleEdit(index, row) {
      this.r_id = row.r_id;
      // 修改 职务 默认获取数据
      this.$axios
        .post(this.URL_API + "/berry/public/index.php/role/update", {
          r_id: row.r_id,
          token: this.token
        },
          {
            transformRequest: [
              function(data) {
                let ret = "";
                for (let it in data) {
                  ret +=
                    encodeURIComponent(it) +
                    "=" +
                    encodeURIComponent(data[it]) +
                    "&";
                }
                return ret;
              }
            ]
          })
        .then(res => {
          let data = res.data;
          if (data.code == 0) {
            this.form.name = data.data.name;
            this.form.options = data.data.department;
            this.title = "修改职务";
            this.editVisible = true;
          }else if(res.data.code == 450){
            this.$message.success("登录时间过长，请重新登录");
            this.$router.push("/login");
          }
        });
    },
    handleDel(index, row) {
      // 删除 弹框 二次确认
      this.r_id = row.r_id;
      this.delVisible = true;
    },
    // 确定删除
    deleteRow() {
      this.$axios
        .post(this.URL_API + "/berry/public/index.php/role/del", {
          id: this.r_id,
          token: this.token
        },
          {
            transformRequest: [
              function(data) {
                let ret = "";
                for (let it in data) {
                  ret +=
                    encodeURIComponent(it) +
                    "=" +
                    encodeURIComponent(data[it]) +
                    "&";
                }
                return ret;
              }
            ]
          })
        .then(res => {
          let data = res.data;
          if (data.code == 0) {
            this.$message.success("删除成功");
            this.delVisible = false;
            this.getData();
          }
        });
    },
    // 分配菜单 默认
    handleMenu(index,row){
		this.r_id = row.r_id;
        this.$axios.get(this.URL_API+"/berry/public/index.php/role/allot?role_id="+this.r_id+"&token="+this.token,
          {
            transformRequest: [
              function(data) {
                let ret = "";
                for (let it in data) {
                  ret +=
                    encodeURIComponent(it) +
                    "=" +
                    encodeURIComponent(data[it]) +
                    "&";
                }
                return ret;
              }
            ]
          }).then(res=>{
            if(res.data.code == 0){
                this.data2 = res.data.data.all;
                this.data3 = res.data.data.default;
                this.allotVisible = true;
            }else if(res.data.code == 450){
            this.$message.success("登录时间过长，请重新登录");
            this.$router.push("/login");
          }
        })
    },
    // 分配菜单 提交 
    allotOrder(){
        this.$axios.post(this.URL_API+'/berry/public/index.php/role/allot',{
			role_id: this.r_id,
      oauth_id: this.$refs.tree.getCheckedKeys(),
      token: this.token
		},
          {
            transformRequest: [
              function(data) {
                let ret = "";
                for (let it in data) {
                  ret +=
                    encodeURIComponent(it) +
                    "=" +
                    encodeURIComponent(data[it]) +
                    "&";
                }
                return ret;
              }
            ]
          }).then(res=>{
            if(res.data.code == 0){
				this.$message.success('分配成功');
				this.allotVisible = false;
				this.getData();
            }
        })
    }
  }
};
</script>
<style>
.el-table{
  color:#000;
}

</style>
<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.del-dialog-cnt {
  font-size: 16px;
  text-align: center;
}
</style>
