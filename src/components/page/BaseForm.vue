<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 用户列表
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-form :inline="true">
          <el-row :gutter="30">
            <el-col :span="4">
              <el-button type="primary" @click="handleAdd()">添加</el-button>
            </el-col>
            <el-col :span="15" :offset="7" style="width:max-content;">
              <el-form-item label="账户名">
                <el-input v-model="accout"></el-input>
              </el-form-item>
              <el-form-item label="姓名">
                <el-input v-model="name"></el-input>
              </el-form-item>
              <el-form-item label="使用状态">
                <el-select v-model="select_cate" placeholder="请选择" class="handle-select mr10">
                  <el-option key="1" label="启用" value="1"></el-option>
                  <el-option key="2" label="禁用" value="0"></el-option>
                </el-select>
              </el-form-item>
              <el-button type="primary" icon="search" @click="getData">搜索</el-button>
            </el-col>
          </el-row>
        </el-form>

        <!-- <el-select v-model="select_cate" placeholder="筛选省份" class="handle-select mr10">
              <el-option key="1" label="广东省" value="广东省"></el-option>
              <el-option key="2" label="湖南省" value="湖南省"></el-option>
          </el-select>
        <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>-->
      </div>
      <el-table :data="tableData" border style="width: 100%" ref="multipleTable">
        <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
        <el-table-column prop="account" label="账户名" align="center"></el-table-column>

        <el-table-column prop="relly_name" label="姓名" align="center"></el-table-column>
        <el-table-column prop="name" label="职务" align="center"></el-table-column>
        <el-table-column prop="phone" label="联系电话" align="center"></el-table-column>
        <el-table-column prop="email" label="邮箱" align="center" width="150"></el-table-column>
        <el-table-column prop="addtime" label="添加时间" align="center" :formatter="timesta" width="150"></el-table-column>
        <el-table-column prop="region" label="地区" align="center"></el-table-column>
        <el-table-column prop="status" label="使用状态" align="center" :formatter="formatter"></el-table-column>

        <el-table-column label="操作" align="center" width="250">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
            <el-button
              size="small"
              @click="handleMenu(scope.$index, scope.row)"
              v-if="scope.row.status==0"
            >启用</el-button>
            <el-button
              size="small"
              @click="handleMenu(scope.$index, scope.row)"
              v-if="scope.row.status==1"
            >禁用</el-button>
            <el-button size="small" type="danger" @click="handleDel(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :page-size="2"
          :total="ccc"
        ></el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog :title="title" :visible.sync="editVisible" width="30%">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="账号">
          <el-input v-model="form.accout"></el-input>
        </el-form-item>
        <el-form-item label="密码" v-if="isShow">
          <el-input v-model="form.pwd"></el-input>
        </el-form-item>
        <el-form-item label="用户职务">
          <!-- 读取接口 -->
          <el-select v-model="form.zhiwu" filterable placeholder="请选择">
            <el-option
              :label="item.name"
              :value="item.r_id"
              v-for="(item,index) in optionsZhan"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地区">
          <el-select v-model="form.options" placeholder="请选择" class="handle-select mr10">
            <el-option label="请选择" value></el-option>
            <el-option label="北京" value="北京"></el-option>
            <el-option label="杭州" value="杭州"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="真实姓名">
          <el-input v-model="form.relly_name"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱">
          <el-input v-model="form.email"></el-input>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      // url: './static/vuetable.json',
      accout: "",
      name: "",
      select_cate: "",
      tableData: [],
      optionsZhan: [], // 用户添加所需的职务
      title: "添加用户",
      editVisible: false,
      delVisible: false,
      isShow: false, // 密码 是否显示  修改的时候不显示
      form: {
        accout: "",
        pwd: "",
        zhiwu: "",
        options: "",
        relly_name: "",
        phone: "",
        email: ""
      },
      u_id: "",
      defaultProps: {
        children: "son",
        label: "name"
      },
      cur_page: 1,
      data2: [],
      data3: [],
      ccc: 0,
      token: ""
    };
  },
  created() {
    this.token = window.sessionStorage.getItem("token");
    this.getData();
  },
  methods: {
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
    },
    getData() {
      // // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
      // if (process.env.NODE_ENV === 'development') {
      //     this.url = '/ms/table/list';
      // };
      this.$axios
        .post(this.URL_API + "/berry/public/index.php/user/index", {
          page: this.cur_page,
          account: this.accout,
          relly_name: this.name,
          status: this.select_cate,
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

          this.tableData = res.data.data.data;
          this.ccc = res.data.data.count;
        });
    },
    formatter(row, column) {
      return row.status == 1 ? "启用" : "禁用";

    },
    timesta(row, column) {

      let date = new Date(JSON.parse(row.addtime) * 1000);
      let Y = date.getFullYear() + "-";
      let M =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1) + "-"
          : date.getMonth() + 1 + "-";
      let D =
        date.getDate() < 10 ? "0" + date.getDate() + " " : date.getDate() + " ";
      let h =
        date.getHours() < 10
          ? "0" + date.getHours() + ":"
          : date.getHours() + ":";
      let m =
        date.getMinutes() < 10
          ? "0" + date.getMinutes() + ":"
          : date.getMinutes() + ":";
      let s =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return Y + M + D + h + m + s;
    },
    handleAdd() {
      this.title = "添加用户";

      this.form.accout = "";
      this.form.pwd = "";
      this.form.zhiwu = "";
      this.form.options = "";
      this.form.relly_name = "";
      this.form.phone = "";
      this.form.email = "";
      this.editVisible = true;
      this.isShow = true;
      this.getzhiwu();
    },
    // 添加用户  提交   修改用户  提交
    saveEdit() {
      let u_id = "";
      if (this.title == "修改用户") {
        u_id = this.u_id;
      } else {
        u_id = "";
      }
      let webData = {
        account: this.form.accout,
        relly_name: this.form.relly_name,
        show_pwd: this.form.pwd,
        role_id: this.form.zhiwu,
        phone: this.form.phone,
        email: this.form.email,
        region: this.form.options,
        u_id: u_id,
        token: this.token
      };
      this.$axios
        .post(this.URL_API + "/berry/public/index.php/user/add", webData,
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
            if (this.title == "修改用户") {
              this.$message.success("修改成功");
            } else {
              this.$message.success("添加成功");
            }

            this.getData();
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    handleEdit(index, row) {
      this.u_id = row.u_id;
      this.getzhiwu();
      // 修改 用户 默认获取数据
      this.$axios
        .post(this.URL_API + "/berry/public/index.php/user/update", {
          u_id: this.u_id,
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
            this.form.accout = data.data.account;
            this.form.pwd = data.data.show_pwd;
            this.form.zhiwu = data.data.role_id;
            this.form.options = data.data.region;
            this.form.relly_name = data.data.relly_name;
            this.form.phone = data.data.phone;
            this.form.email = data.data.email;

            this.title = "修改用户";
            this.isShow = false;
            this.editVisible = true;
          }
        });
    },
    handleDel(index, row) {
      // 删除 弹框 二次确认
      this.u_id = row.u_id;
      this.delVisible = true;
    },
    // 确定删除
    deleteRow() {
      this.$axios
        .post(this.URL_API + "/berry/public/index.php/user/del", {
          id: this.u_id,
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
    getzhiwu() {
      // 获取职务  用户添加 需要
      this.$axios
        .post(this.URL_API + "/berry/public/index.php/role/index", {
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
            this.optionsZhan = data.data;
            this.optionsZhan.unshift({ name: "请选择", r_id: "" });
          }
        });
    },
    // 启用 禁用
    handleMenu(index, row) {
      let sta = "";
      if (Number(row.status) == 0) {
        sta = 1;
      } else {
        sta = 0;
      }
      this.$axios
        .post(this.URL_API + "/berry/public/index.php/user/checkStatus", {
          u_id: row.u_id,
          status: sta,
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
            this.$message.success("状态修改成功");
            this.getData();
          }
        });
    }
  }
};
</script>

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
