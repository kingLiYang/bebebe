<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 订单列表
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" @click="handleAdd()">添加订单</el-button>
        <el-button type="primary" @click="handleEdit()">修改</el-button>
        <el-button type="primary" @click="handleDel()">删除</el-button>
        <el-button type="primary" @click="handleDetails()">详情</el-button>
        <el-form :inline="true" style="margin: 20px 0 0 0;">
          <el-row>
            <el-col style="width:max-content;">
              <el-form-item label="订单号">
                <el-input v-model="accout"></el-input>
              </el-form-item>
              <el-form-item label="发货人">
                <el-input v-model="send_goods_name"></el-input>
              </el-form-item>
              <el-form-item label="收货人">
                <el-input v-model="get_goods_name"></el-input>
              </el-form-item>
              <el-form-item label="审核状态">
                <el-select v-model="select_cate" placeholder="请选择" class="handle-select mr10">
                  <el-option key="0" label="未审核" value="1"></el-option>
                  <el-option key="1" label="已审核" value="0"></el-option>
                </el-select>
              </el-form-item>

              
            </el-col>
            <el-col>
              <el-form-item label="下单时间">
                <!-- <el-input v-model="name"></el-input> -->
                <el-date-picker
                  v-model="value4"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetimerange"
                  :picker-options="pickerOptions2"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="发货时间">
                <!-- <el-input v-model="name"></el-input> -->
                <el-date-picker
                  v-model="value5"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetimerange"
                  :picker-options="pickerOptions2"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
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
        <el-table-column prop="order_code" label="订单号" align="center"></el-table-column>
        <el-table-column prop="addtime" label="下单时间" align="center" :formatter="addtimesta"></el-table-column>
        <el-table-column prop="place_order_admin" label="下单人员" align="center"></el-table-column>
        <el-table-column prop="check_order_admin" label="审核人" align="center"></el-table-column>
        <el-table-column prop="send_goods_time" label="发货时间" align="center" :formatter="timesta"></el-table-column>
        <el-table-column prop="send_goods_address" label="发货地址" align="center"></el-table-column>
        <el-table-column prop="time_limit" label="时限" align="center"></el-table-column>
        <el-table-column prop="get_goods_address" label="收货地址" align="center"></el-table-column>
        <el-table-column prop="support_value" label="保价金额" align="center"></el-table-column>
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
      send_goods_name: "",
      get_goods_name: "",
      tableData: [],
      optionsZhan: [], // 用户添加所需的职务
      title: "添加用户",
      editVisible: false,
      delVisible: false,
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
      cur_page: 1,
      data2: [],
      data3: [],
      ccc: 0,
      token: "",
      value4: ["",""],
      value5: ["",""],
      pickerOptions2: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
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
        .post(
          this.URL_API + "/berry/public/index.php/init_order/index",
          {
            page: this.cur_page,
            order_code: this.accout, // 订单号
            status: this.select_cate, // 0 未审核 1 已审核
            send_goods_name: this.send_goods_name, // 发货人
            get_goods_name: this.get_goods_name, // 收货人
            start_addtime: this.value4[0], // 下单开始时间
            end_addtime: this.value4[1], // 下单结束时间
            start_send_goods_time: this.value5[0], // 发货开始时间
            end_send_goods_time: this.value5[1], // 发货结束时间
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
          } else {
            this.tableData = [];
            this.ccc = 1;
            this.$message.error(res.data.message);
          }
        });
    },
    formatter(row, column) {
      return row.status == 1 ? "启用" : "禁用";
    },
    addtimesta(row, colume) {
      if (row.addtime == null) {
        return "暂无";
      } else {
        let date = new Date(parseInt(row.addtime) * 1000);
        let Y = date.getFullYear() + "-";
        let M =
          date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1) + "-"
            : date.getMonth() + 1 + "-";
        let D =
          date.getDate() < 10
            ? "0" + date.getDate() + " "
            : date.getDate() + " ";
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
      }
    },
    timesta(row, column) {
      let date = new Date(parseInt(row.send_goods_time) * 1000);
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
      this.$router.push("/add_order");
    },
    handleDetails(){
      // 详情 http://www.zjcoldcloud.com/berry/public/index.php/user/get_check_user
            this.$axios
        .post(
          this.URL_API + "/berry/public/index.php/user/get_check_user",
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
          // if (res.data.code == 0) {
          //   this.tableData = res.data.data.data;

          //   this.ccc = res.data.data.count;
          // } else {
          //   this.tableData = [];
          //   this.ccc = 1;
          //   this.$message.error(res.data.message);
          // }
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
        })
        .then(res => {
          let data = res.data;
          if (data.code == 0) {
            this.$message.success("删除成功");
            this.delVisible = false;
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
