<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 权限资源列表
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
        <el-button type="primary" @click="handleEdit()">修改</el-button>
        <el-button type="primary" @click="handleDelete()">删除</el-button>
      </div>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        :cell-style="cellStyle"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        v-loading="loading"
      >
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column type="index" width="100" label="序号" align="center"></el-table-column>
        <el-table-column prop="name" label="权限名称" align="center" :formatter="powerName"></el-table-column>
        <el-table-column prop="controller" label="控制器名称" align="center"></el-table-column>
        <el-table-column prop="type" label="权限类型" align="center" :formatter="formatter"></el-table-column>
      </el-table>
      <!-- <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="1000">
                </el-pagination>
      </div>-->
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog :title="title" :visible.sync="editVisible" width="30%">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="权限名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="控制器名称">
          <el-input v-model="form.options"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="form.delivery"></el-input>
        </el-form-item>
        <el-form-item label="权限类型">
          <el-select v-model="form.select_cate" placeholder="请选择" class="handle-select mr10">
            <el-option label="请选择" value></el-option>
            <el-option label="菜单权限" value="1"></el-option>
            <el-option label="动作权限" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="icon">
          <el-input v-model="form.icon"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">返 回</el-button>
        <el-button type="primary" @click="saveEdit" :disabled="clickOne">提 交</el-button>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading:true,
      // url: './static/vuetable.json',
      clickOne: false,
      tableData: [],
      title: "添加权限",
      multipleSelection: [],
      select_word: "",
      del_list: [],
      is_search: false,
      editVisible: false,
      delVisible: false,
      floor: "",
      form: {
        name: "",
        options: "",
        delivery: "",
        select_cate: "",
        icon: ""
      },
      idx: -1,
      p_id: 0,
      p_path: "",
      token: ""
    };
  },
  created() {
    this.token = window.sessionStorage.getItem("token");
    this.getData();
  },
  computed: {
    // data() {
    //     return this.tableData.filter((d) => {
    //         let is_del = false;
    //         for (let i = 0; i < this.del_list.length; i++) {
    //             if (d.name === this.del_list[i].name) {
    //                 is_del = true;
    //                 break;
    //             }
    //         }
    //         if (!is_del) {
    //             if (d.address.indexOf(this.select_cate) > -1 &&
    //                 (d.name.indexOf(this.select_word) > -1 ||
    //                     d.address.indexOf(this.select_word) > -1)
    //             ) {
    //                 return d;
    //             }
    //         }
    //     })
    // }
  },
  methods: {
    getData() {
      // // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
      // if (process.env.NODE_ENV === 'development') {
      //     this.url = '/ms/table/list';
      // };
      this.$axios
        .post(this.URL_API + "/berry/public/index.php/oauth/index", {
          level: 1,
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
          if(res.data.code == 0){
          this.tableData = res.data.data;
          this.loading = false;
          }else if(res.data.code == 450){
            this.$message.success("登录时间过长，请重新登录");
            this.$router.push("/login");
          }

        });
    },
    formatter(row, column) {
      return row.type == 1 ? "菜单权限" : "动作权限";
    },
    powerName(row) {
      return row.level + row.name;
    },
    handleAdd() {
      this.title = "添加权限";
      this.form.name = "";
      this.form.options = "";
      this.form.delivery = "";
      this.form.select_cate = "";
      this.form.icon = "";
      let len = this.multipleSelection;

      if (len.length == 1) {
        if (len[0].type == 0) {
          // 动作权限 不允许添加子权限
          this.$message.error("动作权限 不允许添加子权限");
        } else {
          this.p_id = this.multipleSelection[0].o_id;
          this.p_path = this.multipleSelection[0].p_path;
          if(this.multipleSelection[0].floor == 1){
            this.floor = 2;
          }else if(this.multipleSelection[0].floor == 2){
            this.floor = 3;
          }
          
          this.editVisible = true;
        }
      } else if (len.length == 0) {
        this.p_id = 0;
        this.p_path = "";
        this.floor = 1;
        this.editVisible = true;
      } else {
        this.$message.error("请选择单个权限");
      }
    },
    // 添加权限  提交   修改权限  提交
    saveEdit() {
      this.clickOne = true;
      // this.$set(this.tableData, this.idx, this.form);
      // this.editVisible = false;
      // this.$message.success(`修改第 ${this.idx+1} 行成功`);
      let o_id = "";
      let type = "";
      if (this.title == "修改权限") {
        o_id = this.multipleSelection[0].o_id;
        this.p_path = this.multipleSelection[0].p_path;
      } else {
        o_id = "";
      }
      if (this.form.select_cate == "动作权限") {
        type = 0;
      } else if (this.form.select_cate == "菜单权限") {
        type = 1;
      } else {
        type = this.form.select_cate;
      }
      let webData = {
        name: this.form.name,
        p_id: this.p_id,
        o_id: o_id,
        controller: this.form.options,
        ord: this.form.delivery,
        type: type,
        p_path: this.p_path,
        icon: this.form.icon,
        token: this.token,
        floor: this.floor
      };

      this.$axios
        .post(this.URL_API + "/berry/public/index.php/oauth/add", webData,
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
          // this.clickOne = false;
          if (res.data.code == 0) {
            if (this.title == "修改权限") {
              this.$message.success("修改成功");
            } else {
              this.$message.success("添加成功");
            }

            this.editVisible = false;
            this.getData();
          }else if(res.data.code == 450){
            this.$message.success("登录时间过长，请重新登录");
            this.$router.push("/login");
          } else {
            this.$message.error(res.data.message);
          }
          setTimeout(() => {
            this.clickOne = false;
          }, 1000);
        });
    },
    handleEdit(index, row) {
      let len = this.multipleSelection;

      if (len.length == 1) {
        this.p_id = len[0].p_id;
        this.floor = len[0].floor;
        // 修改 权限 默认获取数据 http://www.zjcoldcloud.com/berry/public/index.php/oauth/update
        this.$axios
          .post(this.URL_API + "/berry/public/index.php/oauth/update", {
            o_id: this.multipleSelection[0].o_id,
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
              this.form.options = data.data.controller;
              this.form.delivery = data.data.ord;
              this.form.select_cate =
                data.data.type == 1 ? "菜单权限" : "动作权限";
              this.form.icon = data.data.icon;
              this.title = "修改权限";
              this.editVisible = true;
            }else if(res.data.code == 450){
            this.$message.success("登录时间过长，请重新登录");
            this.$router.push("/login");
          }
          });
      } else if (len.length == 0) {
        this.$message.error("请选择要修改的权限");
      } else {
        this.$message.error("请选择单个权限");
      }
    },
    handleDelete() {
      // 删除 弹框 二次确认
      let len = this.multipleSelection;
      if (len.length == 1) {
        this.delVisible = true;
      } else if (len.length == 0) {
        this.$message.error("请选择要删除的权限");
      } else {
        this.$message.error("请选择单个权限");
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 确定删除 http://www.zjcoldcloud.com/berry/public/index.php/oauth/del
    deleteRow() {
      this.$axios
        .post(this.URL_API + "/berry/public/index.php/oauth/del", {
          p_path: this.multipleSelection[0].p_path,
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
          }else if(res.data.code == 450){
            this.$message.success("登录时间过长，请重新登录");
            this.$router.push("/login");
          }
        });
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 2) {
        return "text-align:left;padding-left:10%";
      }
    }
  }
};
</script>
<style>
  @import '../../../static/css/table.css';
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
