<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 费用保价
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-form :inline="true">
          <el-row type="flex" justify="space-between">
            <el-col :span="10">
              <el-button type="primary" @click="handleAdd()" v-if="role_name == '中集商务'">添加</el-button>
              <!-- <el-button type="primary" @click="handleEdit()">修改</el-button> -->
              <el-button type="primary" @click="handleDelete()" v-if="role_name == '中集商务'">删除</el-button>
              <el-button type="primary" @click="handlecheck()" v-if="role_name == '运营专员'">审核</el-button>
              <el-button type="primary" @click="handleLock()" v-if="role_name == '运营专员'">解锁</el-button>
            </el-col>
            <el-col>
              <el-form-item label="开始城市">
                <el-input v-model="start_city"></el-input>
              </el-form-item>
              <el-form-item label="结束城市">
                <el-input v-model="end_city"></el-input>
              </el-form-item>
              <el-form-item label="状态">
                <el-select placeholder="请选择" class="mr10" v-model="status">
                  <el-option label="请选择" value></el-option>
                  <el-option label="未审核" value="0"></el-option>
                  <el-option label="审核通过" value="1"></el-option>
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
      <el-table
        :data="tableData"
        style="width: 100%"
        ref="multipleTable"
        max-height="400"
        border
        @selection-change="handleSelectionChange"
        v-loading="loading"
      >
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column type="index" label="序号" align="center" fixed></el-table-column>
        <el-table-column prop="start_city" label="始发城市" align="center"></el-table-column>
        <el-table-column prop="end_city" label="目的城市" align="center"></el-table-column>
        <el-table-column prop="status" label="审核状态" align="center" :formatter="changeStatus"></el-table-column>
        <el-table-column prop="lock" label="锁定状态" align="center" :formatter="changeLockStatus"></el-table-column>
        <el-table-column prop="box_type4" label="12L" align="center"></el-table-column>
        <el-table-column prop="box_type3" label="28L" align="center"></el-table-column>
        <el-table-column prop="box_type2" label="56L" align="center"></el-table-column>
        <el-table-column prop="box_type1" label="97L" align="center"></el-table-column>
        <el-table-column prop="box_type5" label="130L" align="center"></el-table-column>
        <el-table-column prop="time_limit" label="时限" align="center"></el-table-column>
      </el-table>
      <div class="pagination">
        <!-- <el-pagination
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :page-size="10"
          :total="ccc"
        ></el-pagination>-->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[50, 100, 500, 2000]"
          :page-size="50"
          layout="total, sizes, prev, pager, next, jumper"
          :total="ccc"
        ></el-pagination>
      </div>
    </div>

    <!-- 编辑 弹框 -->
    <el-dialog :title="title" :visible.sync="editVisible" id="editMoney">
      <div>
        <el-form label-width="80px" v-model="addData" :inline="true" style="padding:10px 0 0 0;">
          <el-row style="display:flex;justify-content:center;">
            <el-form-item label="开始城市">
              <el-input v-model="addData.start_city"></el-input>
            </el-form-item>
            <el-form-item label="目的城市">
              <el-input v-model="addData.end_city"></el-input>
            </el-form-item>
            <el-form-item label="时限">
              <el-input v-model="addData.time_limit"></el-input>
            </el-form-item>
          </el-row>
          <el-row style="display:flex;justify-content:center;">
            <el-form-item label="12L">
              <el-input v-model="addData.box_type4"></el-input>
            </el-form-item>
            <el-form-item label="28L">
              <el-input v-model="addData.box_type3"></el-input>
            </el-form-item>
            <el-form-item label="56L">
              <el-input v-model="addData.box_type2"></el-input>
            </el-form-item>
          </el-row>
          <el-row style="display:flex;justify-content:center;">
            <el-form-item label="97L">
              <el-input v-model="addData.box_type1"></el-input>
            </el-form-item>
            <el-form-item label="130L">
              <el-input v-model="addData.box_type5"></el-input>
            </el-form-item>
            <el-form-item label="审核人">
              <el-select placeholder="请选择" class="handle-select mr10" v-model="addData.auditor">
                <el-option label="请选择" value></el-option>
                <!-- staData -->
                <el-option
                  :label="item.relly_name"
                  :value="item.u_id"
                  v-for="(item,index) in staData"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
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
<!-- 添加审核 提示框 -->
        <el-dialog title="提示" :visible.sync="addCheckDialog" width="300px" center>
      <div class="del-dialog-cnt">添加审核</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addCheckPass">通 过</el-button>
        <el-button type="error" @click="addCheckNot">驳 回</el-button>
      </span>
    </el-dialog>
    <!-- 删除审核 提示框 -->
        <el-dialog title="提示" :visible.sync="delCheckDialog" width="300px" center>
      <div class="del-dialog-cnt">删除审核</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="delCheckPass">通 过</el-button>
        <el-button type="error" @click="delCheckNot">驳 回</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addCheckDialog: false,
      delCheckDialog: false,
      loading: true,
      start_city: "",
      end_city: "",
      status: "",
      edit_art_no: "",
      art_no: "",
      select_cate: "",
      tableData: [],
      staData: [],
      title: "添加保价",
      editVisible: false,
      delVisible: false,
      addData: {
        start_city: "",
        end_city: "",
        time_limit: "",
        box_type4: "",
        box_type3: "",
        box_type2: "",
        box_type1: "",
        box_type5: "",
        auditor: ""
      },
      id: "",
      cur_page: 1,
      limit: 50,
      del_id: [],
      multipleSelection: [],
      ccc: 0,
      role_name: '',
      token: "",
      check_id:""
    };
  },
  created() {
    this.token = window.sessionStorage.getItem("token");
    this.role_name = window.sessionStorage.getItem("role_name");
    
    this.getData();
    
  },
  computed: {},
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 分页导航
    handleCurrentChange(val) {
      this.loading = true;
      this.cur_page = val;
      this.getData();
    },
    handleSizeChange(val) {
      this.loading = true;
      // console.log(val); // 每页显示  条数
      this.limit = val;
      this.getData();
    },
    handleAdd() {
      this.addData.start_city = "";
      this.addData.end_city = "";
      this.addData.time_limit = "";
      this.addData.box_type4 = "";
      this.addData.box_type3 = "";
      this.addData.box_type2 = "";
      this.addData.box_type1 = "";
      this.addData.box_type5 = "";
      this.addData.auditor = "";
      // 添加保价的时候    获取审核人

      this.getSta();
      // this.editVisible = true;
    },
    getData() {
      // // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
      // if (process.env.NODE_ENV === 'development') {
      //     this.url = '/ms/table/list';
      // };
      this.$axios
        .post(
          this.URL_API + "/berry/public/index.php/box_city_price/index",
          {
            page: this.cur_page,
            limit: this.limit,
            start_city: this.start_city,
            end_city: this.end_city,
            status: this.status, // 0 未审核  1 审核通过
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
          }
        )
        .then(res => {
          if (res.data.code == 0) {
            this.tableData = res.data.data.data;
            this.ccc = res.data.data.count;
            this.loading = false;
          } else if (res.data.code == 450) {
            this.$message.success("登录时间过长，请重新登录");
            this.$router.push("/login");
          }
        });
    },
    changeStatus(row) {
      // return row.status == 1 ? "审核通过" : "未审核";
      if(row.status == 1){
        return '审核通过'
      }else if(row.status == 2){
        return '删除审核'
      }else if(row.status == 3){
        return '审核驳回'
      }else{
        return '添加审核'
      }
    },
    changeLockStatus(row){
      return row.lock == 1 ? '锁定' : '未锁定';
    },
    getSta() {
      this.$axios
        .post(
          this.URL_API + "/berry/public/index.php/index/get_business_user",
          {
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
          }
        )
        .then(res => {
          let data = res.data;
          if (data.code == 0) {
            this.staData = data.data;
            this.editVisible = true;
          } else if (res.data.code == 450) {
            this.$message.success("登录时间过长，请重新登录");
            this.$router.push("/login");
          }
        });
    },

    // 添加  修改  提交
    saveEdit() {
      let webData = {
        id: this.id,
        token: this.token,
        start_city: this.addData.start_city,
        end_city: this.addData.end_city,
        time_limit: this.addData.time_limit,
        box_type4: this.addData.box_type4,
        box_type3: this.addData.box_type3,
        box_type2: this.addData.box_type2,
        box_type1: this.addData.box_type1,
        box_type5: this.addData.box_type5,
        auditor: this.addData.auditor
      };
      this.$axios
        .post(
          this.URL_API + "/berry/public/index.php/box_city_price/add",
          webData,
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
          }
        )
        .then(res => {
          // this.tableData = res.data.data;
          if (res.data.code == 0) {
            this.editVisible = false;
            this.$message.success("添加成功");
            this.getData();
          } else if (res.data.code == 450) {
            this.$message.success("登录时间过长，请重新登录");
            this.$router.push("/login");
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    handleDelete() {
      // 删除 弹框 二次确认
      let len = this.multipleSelection;
      this.del_id = [];
      if (len.length == 0) {
        this.$message.error("请选择要删除的数据");
      } else if(len.length > 1){
        this.$message.error("请选择单个数据");
      }else{
        // this.del_id = [];
        if(len[0].status == 1 || len[0].status == 2){
          if(len[0].lock == 1){
            this.$message.error("不允许删除,请联系运营人员解锁");
          }else{
            // console.log(111);return;
            this.changeSta(len[0].id,2)
          }
        }else{
          this.del_id.push(len[0].id);
          this.delVisible = true;
        }
        
      }
    },
    // 改变状态 接口
    changeSta(id,sta){
      this.$axios
        .post(
          this.URL_API + "/berry/public/index.php/box_city_price/check_status",
          {
            id: id,
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
          }
        )
        .then(res => {
          let data = res.data;
          if (data.code == 0) {
            this.$message.success("状态修改成功");
            this.addCheckDialog = false;
            this.delCheckDialog = false;
            this.getData();
          } else if (res.data.code == 450) {
            this.$message.success("登录时间过长，请重新登录");
            this.$router.push("/login");
          }else{
            this.$message.error(res.data.message);
          }
        });
    },
    // 删除 数据
    deleteRow() {
      this.$axios
        .post(
          this.URL_API + "/berry/public/index.php/box_city_price/del",
          {
            id: this.del_id.join(","),
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
          }
        )
        .then(res => {
          let data = res.data;
          if (data.code == 0) {
            this.$message.success("删除成功");
            this.delVisible = false;
            this.getData();
          } else if (res.data.code == 450) {
            this.$message.success("登录时间过长，请重新登录");
            this.$router.push("/login");
          }else{
            this.$message.error(res.data.message);
            this.delVisible = false;
          }
        });
    },
    handleLock(){
      // 解锁
      let len = this.multipleSelection;
      let id = [];
      if (len.length == 0) {
        this.$message.error("请选择数据");
      } else {
        for (let i = 0; i < len.length; i++) {
          id.push(len[i].id);
        }
        this.$axios
        .post(
          this.URL_API + "/berry/public/index.php/box_city_price/check_lock",
          {
            id: id.join(","),
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
          }
        )
        .then(res => {
          let data = res.data;
          if (data.code == 0) {
            this.$message.success("解锁成功");
            this.getData();
          } else if (res.data.code == 450) {
            this.$message.success("登录时间过长，请重新登录");
            this.$router.push("/login");
          }else{
            this.$message.error(res.data.message);
          }
        });

      }
    },
    // 添加审核  通过
    addCheckPass(){
      this.changeSta(this.check_id,1);
    },
        // 添加审核  驳回
    addCheckNot(){
      this.changeSta(this.check_id,3);
    },
    // 删除审核  通过
    delCheckPass(){
      this.$axios
        .post(
          this.URL_API + "/berry/public/index.php/box_city_price/del",
          {
            id: this.check_id,
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
          }
        )
        .then(res => {
          let data = res.data;
          if (data.code == 0) {
            this.$message.success("删除成功");
            this.delCheckDialog = false;
            this.getData();
          } else if (res.data.code == 450) {
            this.$message.success("登录时间过长，请重新登录");
            this.$router.push("/login");
          }else{
            this.$message.error(res.data.message);
            this.delCheckDialog = false;
          }
        });
    },
    // 删除审核  驳回
    delCheckNot(){
      this.changeSta(this.check_id,3);
    },
    // 审核
    handlecheck() {
      let len = this.multipleSelection;

      if (len.length == 1) {
        if(len[0].status == 1 || len[0].status == 3){
          this.$message.error('已经审核，不允许二次审核');
        }else if(len[0].status == 0){
          // 添加审核  通过  请求接口 
          this.check_id = len[0].id;
          this.addCheckDialog = true;
        }else if(len[0].status == 2){
          // 删除审核 通过 走删除接口  驳回 改变状态
          this.check_id = len[0].id;
          this.delCheckDialog = true;
        }
      } else if (len.length == 0) {
        this.$message.error("请选择要审核的数据");
      } else {
        this.$message.error("请选择单个");
      }
    }
  }
};
</script>
<style>
.el-table {
  color: #000;
}
#editMoney .el-input__inner {
  width: 120px;
}
</style>
<style scoped>
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
ul li {
  list-style: none;
}
</style>
