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
        <el-button type="primary" @click="check_order()" v-if="isCheck">审核</el-button>
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
                  <el-option label="请选择" value></el-option>
                  <el-option key="0" label="待审核" value="0"></el-option>
                  <el-option key="1" label="通过" value="1"></el-option>
                  <el-option key="2" label="驳回" value="2"></el-option>
                  <el-option key="3" label="完成" value="3"></el-option>
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
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        v-loading="loading"
      >
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
        <el-table-column prop="order_code" label="订单号" align="center"></el-table-column>
        <el-table-column prop="addtime" label="下单时间" align="center" :formatter="addtimesta"></el-table-column>
        <el-table-column prop="place_order_admin" label="下单人员" align="center"></el-table-column>
        <el-table-column prop="check_order_admin" label="审核人" align="center"></el-table-column>
        <el-table-column prop="send_goods_time" label="发货时间" align="center" :formatter="timesta"></el-table-column>
        <el-table-column
          prop="send_goods_address"
          label="发货地址"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column prop="time_limit" label="时限" align="center"></el-table-column>
        <el-table-column
          prop="get_goods_address"
          label="收货地址"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column prop="support_value" label="保价金额" align="center"></el-table-column>
        <el-table-column prop="status" label="审核状态" align="center" :formatter="changeSta"></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :page-size="10"
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
    <!-- 商务经理 审核提示框 -->
    <el-dialog title="审核提示" :visible.sync="checkVisible" width="30%">
      <el-form :inline="true" label-width="100px">
        <el-form-item label="备注">
          <el-input v-model="remark_why" style="width: 300px;"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="check_remark(1)">通过</el-button>
        <el-button type="danger" @click="check_remark(2)">驳回</el-button>
      </span>
    </el-dialog>
    <!-- 运营      审核提示框 -->
    <el-dialog title="审核提示" :visible.sync="playCheckVisible" width="30%">
      <el-form label-width="100px" :model="formCheck">
        <el-form-item label="备注">
          <el-input v-model="order_why" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item label="订单号">
          <el-input v-model="formCheck.order_check" style="width: 300px;" disabled></el-input>
        </el-form-item>
        <!-- <el-form-item label="箱型">
          <el-input v-model="formCheck.order_box" style="width: 300px;"></el-input>
        </el-form-item>
                  <el-form-item label="数量">
          <el-input v-model="formCheck.order_num" style="width: 300px;"></el-input>
        </el-form-item>
           
                  <el-form-item label="温度区间">
          <el-input v-model="formCheck.order_tem" style="width: 300px;"></el-input>
        </el-form-item>-->
      </el-form>
      <el-row v-for="(item,index) in box_num" :key="index">
        <div style="border:1px solid #bbb;padding: 10px 0 10px 44px;margin: 0 0 10px 0;">
          <p>温度区间：{{item.temperature}}</p>
          <div v-for="(ite,index) in item.box_num" :key="index">
            <!-- 箱型：{{item.type}}L 数量：{{item.num}} -->
            <el-form :inline="true" style="display:flex;justify-content: space-between;">
              <el-form-item label="箱型">
                <el-select placeholder="请选择" class="handle-select mr10" v-model="ite.type">
                  <el-option label="12L" value="12L"></el-option>
                  <el-option label="28L" value="28L"></el-option>
                  <el-option label="56L" value="56L"></el-option>
                  <el-option label="97L" value="97L"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="数量">
                <el-input v-model="ite.num" style="width:100px;"></el-input>
              </el-form-item>
              <el-form-item style>
                <span @click="add_box(item)" style="color:blue;cursor:pointer;">添加</span>
                <span @click="del_box(item,index)" style="color:blue;cursor:pointer;">删除</span>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="play_remark(3)">通过</el-button>
        <el-button type="danger" @click="play_remark(2)">驳回</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formCheck: {
        order_tem: "",
        order_num: "",
        order_box: "",
        order_check: ""
      },
      order_why: "",
      box_num: {},
      playCheckVisible: false,
      loading: true,
      // url: './static/vuetable.json',
      isCheck: false, // 审核 按钮 是否显示
      remark_why: "", // 审核不通过原因
      checkVisible: false, // 审核弹框
      order_id: [],
      role_name: "",
      accout: "",
      name: "",
      select_cate: "",
      send_goods_name: "",
      get_goods_name: "",
      tableData: [],
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
      cur_page: 1,
      del_id: [], // 删除id
      id: "", // 详情id
      ccc: 0,
      token: "",
      value4: [],
      multipleSelection: [],
      value5: [],
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
    this.role_name = window.sessionStorage.getItem("role_name");
    if (this.role_name == "商务专员") {
      this.isCheck = false;
    } else {
      this.isCheck = true;
    }
    this.getData();
  },
  methods: {
    handleSelectionChange(val) {
      // 选中的  当前条 数据
      this.multipleSelection = val;
    },
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

      if (this.value5 == null) {
        this.value5 = ["", ""];
      }
      if (this.value4 == null) {
        this.value4 = ["", ""];
      }

      this.$axios
        .post(
          this.URL_API + "/berry/public/index.php/init_order/index",
          {
            page: this.cur_page,
            order_code: this.accout, // 订单号
            status: this.select_cate, // 0 未审核 1 已审核
            send_goods_name: this.send_goods_name, // 发货人
            get_goods_name: this.get_goods_name, // 收货人
            start_addtime: this.value4[0] || "", // 下单开始时间
            end_addtime: this.value4[1] || "", // 下单结束时间
            start_send_goods_time: this.value5[0] || "", // 发货开始时间
            end_send_goods_time: this.value5[1] || "", // 发货结束时间
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
          }else if(res.data.code == 450){
            this.$message.success("登录时间过长，请重新登录");
            this.$router.push("/login");
          } else {
            this.tableData = [];
            this.ccc = 1;
            this.$message.error(res.data.message);
            this.loading = false;
          }
        });
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
    changeSta(row, colume) {
      switch (row.status) {
        case 0:
          return "待审核";
          break;
        case 1:
          return "通过";
          break;
        case 2:
          return "驳回";
          break;
        case 3:
          return "完成";
          break;
      }
    },
    handleAdd() {
      this.$router.push("/add_order");
    },
    handleDetails() {
      let len = this.multipleSelection;
      // 订单  详情
      if (len.length == 1) {
        this.id = len[0].o_id;
        window.sessionStorage.setItem("details_id", this.id);
        this.$router.push({ path: "/details_order" });
      } else if (len.length == 0) {
        this.$message.error("请选择订单");
      } else {
        this.$message.error("请选择单个订单查看");
      }
    },
    add_box(item) {
      // 运营 添加 箱型 数量
      let obj = { type: "", num: "" };
      item.box_num.push(obj);
    },
    del_box(item, index) {
      // 运营 删除 箱型 数量
      if (item.box_num.length == 1) {
        this.$message.error("手下留情，不要删我");
      } else {
        item.box_num.splice(index, 1);
      }
    },
    play_remark(status) {
      // 运营 审核 接口
      // console.log(this.box_num);
      if (status == 2 && this.order_why == "") {
        this.$message.error("请输入订单驳回的原因");
      } else {
        // 订单 审核
        const Qs = require("qs");
        this.$axios
          .post(
            this.URL_API +
              "/berry/public/index.php/check_init_order/check_order",
            {
              o_id: this.order_id.join(","),
              status: status,
              remark: this.order_why,
              box_num: this.box_num,
              token: this.token
            },
            {
              transformRequest: [
                function(data) {
                  data = Qs.stringify(data);
                  return data;
                }
              ]
            },
            // #设置Content-Type
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
          )
          .then(res => {
            if (res.data.code == 0) {
              this.playCheckVisible = false;
              this.getData();
            }else if(res.data.code == 450){
            this.$message.success("登录时间过长，请重新登录");
            this.$router.push("/login");
          } else {
              this.$message.error(res.data.message);
            }
          });
      }
    },
    getOrder() {
      // 获取合单  订单  信息   this.playCheckVisible = true
      this.$axios
        .post(
          this.URL_API + "/berry/public/index.php/check_init_order/show_box",
          {
            o_id: this.order_id.join(","),
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
            this.box_num = res.data.data.box_num;
            this.formCheck.order_check = res.data.data.order_code;
            this.playCheckVisible = true;
          }else if(res.data.code == 450){
            this.$message.success("登录时间过长，请重新登录");
            this.$router.push("/login");
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    check_order() {
      let len = this.multipleSelection;
      if (len.length == 0) {
        this.$message.error("请选择要审核的订单");
      } else {
        this.order_id = [];
        let len = this.multipleSelection;
        // console.log(len);return;
        let check_arr = [];
        for (let i = 0; i < len.length; i++) {
          this.order_id.push(len[i].o_id);

          check_arr.push(len[i].status);
        }
        if (this.role_name == "商务经理") {
          if (check_arr.indexOf(1) != -1 || check_arr.indexOf(3) != -1) {
            this.$message.error(
              "选择的订单有审核通过或者已完成的单子，请重新选择"
            );
          } else {
            this.checkVisible = true;
          }
        } else {
          if (check_arr.indexOf(3) != -1) {
            this.$message.error(
              "选择的订单有审核已完成的单子，请重新选择"
            );
          } else {
            this.getOrder();
          }

        }
      }
    },
    check_remark(status) {
      if (status == 2 && this.remark_why == "") {
        this.$message.error("请输入订单驳回的原因");
      } else {
        // 订单 审核
        this.role_name == "商务经理" ? this.getsta(status) : "";
      }
    },
    // 商务经理审核订单 接口
    getsta(status) {
      this.$axios
        .post(
          this.URL_API + "/berry/public/index.php/check_init_order/remark",
          {
            o_id: this.order_id.join(","),
            status: status,
            remark: this.remark_why,
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
            this.checkVisible = false;
            this.getData();
          }else if(res.data.code == 450){
            this.$message.success("登录时间过长，请重新登录");
            this.$router.push("/login");
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    handleEdit() {
      let len = this.multipleSelection;
      // 订单  修改
      if (len.length == 1) {
        this.id = len[0].o_id;
        window.sessionStorage.setItem("edit_id", this.id);
        this.$router.push({ path: "/edit_order" });
      } else if (len.length == 0) {
        this.$message.error("请选择订单");
      } else {
        this.$message.error("请选择单个订单修改");
      }
    },
    handleDel() {
      // 删除 弹框 二次确认
      let len = this.multipleSelection;
      if (len.length == 0) {
        this.$message.error("请选择要删除的订单");
      } else {
        this.del_id = [];
        let len = this.multipleSelection;
        for (let i = 0; i < len.length; i++) {
          this.del_id.push(len[i].o_id);
        }

        this.delVisible = true;
      }
    },
    // 确定删除
    deleteRow() {
      this.$axios
        .post(
          this.URL_API + "/berry/public/index.php/init_order/del",
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
          }else if(res.data.code == 450){
            this.$message.success("登录时间过长，请重新登录");
            this.$router.push("/login");
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
