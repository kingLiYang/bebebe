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
        <el-button type="primary" @click="is_export()">导出</el-button>
        <el-button type="primary" @click="rollback()">撤单</el-button>

        <el-form :inline="true" style="margin: 20px 0 0 0;">
          <el-row>
            <el-col>
              <el-form-item label="订单号">
                <el-input v-model="accout"></el-input>
              </el-form-item>
              <el-form-item label="下单人员">
                <el-input v-model="send_goods_name"></el-input>
              </el-form-item>
              <el-form-item label="收件客户">
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
              <!-- </el-col>
              <el-col start_send_goods_time>-->
                <el-form-item label='下单时间'>
                  <el-input v-model="start_addtime"></el-input>
                </el-form-item>
                <el-form-item label='至'>
                  <el-input v-model="end_addtime"></el-input>
                </el-form-item>
                <el-form-item label='发货时间'>
                  <el-input v-model="start_send_goods_time"></el-input>
                </el-form-item>
                <el-form-item label='至'>
                  <el-input v-model="end_send_goods_time"></el-input>
                </el-form-item>
                <el-form-item label="发件公司">
                <el-input v-model="send_goods_company"></el-input>
              </el-form-item>
              <!-- <el-form-item label="下单时间">
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
                <el-date-picker
                  v-model="value5"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetimerange"
                  :picker-options="pickerOptions2"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </el-form-item> -->
              <el-button type="primary" icon="search" @click="getData">搜索</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        max-height="400"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        v-loading="loading"
        :row-class-name="tableRowClassName"
      >
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column type="index" width="50" label="序号" align="center" fixed></el-table-column>
        <el-table-column prop="order_code" label="订单号" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="art_no" label="货号" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="art_num" label="数量" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="审核状态" align="center" style="cursor:pointer;">
          <template slot-scope="scope">
            <span
              style="background: blue;padding:10px;color:#fff;cursor:pointer;"
              v-if="scope.row.status == 0"
              @click="jump(scope.row)"
            >待审核</span>
            <span
              style="background: blue;padding:15px;color:#fff;cursor:pointer;"
              v-if="scope.row.status == 1"
              @click="jump(scope.row)"
            >通过</span>
            <span
              style="background: #fff;color:red;cursor:pointer;"
              v-if="scope.row.status == 2"
              @click="jump(scope.row)"
            >驳回</span>
            <span
              style="background: blue;padding:15px;color:#fff;cursor:pointer;"
              v-if="scope.row.status == 3"
              @click="jump(scope.row)"
            >完成</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="addtime"
          label="下单时间"
          align="center"
          :formatter="addtimesta"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column prop="place_order_admin" label="下单人员" align="center"></el-table-column>
        <el-table-column prop="check_order_admin" label="审核人" align="center"></el-table-column>
        <el-table-column
          prop="send_goods_time"
          label="发货时间"
          align="center"
          :formatter="timesta"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          prop="send_goods_address"
          label="发货地址"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column prop="time_limit" label="时限" align="center"></el-table-column>

        <el-table-column prop="send_goods_company" label="发货公司" align="center" :show-overflow-tooltip="true"></el-table-column>

        <el-table-column prop="company" label="收件客户" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column
          prop="get_goods_address"
          label="收货地址"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          prop="support_value"
          label="保价金额"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
      </el-table>
      <div class="pagination">
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

    <!-- 删除提示框   -->
    <el-dialog title="提示" :visible.sync="delVisible" center>
      <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteRow">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 商务经理 审核提示框 -->
    <el-dialog title="审核提示" :visible.sync="checkVisible">
      <el-form :inline="true" label-width="100px" style="text-align:center;">
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
    <el-dialog title="审核提示" :visible.sync="playCheckVisible">
      <el-form label-width="100px" :model="formCheck">
        <el-form-item label="备注">
          <el-input v-model="order_why" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item label="订单号">
          <el-input v-model="formCheck.order_check" style="width: 300px;" disabled></el-input>
        </el-form-item>
      </el-form>
      <el-row v-for="(item,index) in box_num" :key="index">
        <div style="border:1px solid #bbb;padding: 10px 0 10px 44px;margin: 0 0 10px 0;">
          <div style="display:flex;align-items:center;padding: 0 0 10px 0;">
          <p style="float:left;padding: 0 20px 0 0;">温度区间：{{item.temperature}}</p>
          <div>保价：<input type="text" v-model="item.support" class="el-input__inner" style="width:100px;height:30px;"></div>
          </div>

          <div v-for="(ite,index) in item.box_num" :key="index">
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
                <el-input v-model="ite.num" style="width:100px;" @keyup.native="handleClick(item,index)"></el-input>
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
    <!-- 审核记录 提示框 -->
    <el-dialog title="审核记录" :visible.sync="jumpVisible" center>
      <div class="del-dialog-cnt">
        <table>
          <tr>
            <th>序号</th>
            <th>审核人</th>
            <th>审核人职务</th>
            <th>审核时间</th>
            <th>状态</th>
            <th>备注</th>
          </tr>
          <tr v-for="(item,index) in jumpDate" :key="index">
            <td>{{index+1}}</td>
            <td>{{item.relly_name}}</td>
            <td>{{item.role_name}}</td>
            <td>{{item.addtime}}</td>
            <td>{{item.status}}</td>
            <td>{{item.remark}}</td>
          </tr>
        </table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="jumpVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 撤单 弹框 -->
        <el-dialog title="撤单" :visible.sync="rollbackVisible">
      <el-form ref="form" :model="rollform" label-width="100px">
        <el-form-item label="原因">
          <el-input v-model="rollform.check"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rollbackVisible = false">返 回</el-button>
        <el-button type="primary" @click="rollbackCommit">提 交</el-button>
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
      is_what: true, // 判断是直接导出还是搜索后导出
      rollbackVisible: false, // 撤单弹框
      order_why: "",
      rollform:{
        check:""
      },
      roll_id:"",
      box_num: {},
      playCheckVisible: false,
      loading: true,
      isCheck: false, // 审核 按钮 是否显示
      remark_why: "", // 审核不通过原因
      checkVisible: false, // 审核弹框
      jumpVisible: false, // 审核记录弹框
      jumpDate: [], // 审核记录 数据
      send_goods_company: '',
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
      limit: 50,
      token: "",
      multipleSelection: [],
      start_addtime:"",
      end_addtime:"",
      start_send_goods_time:"",
      end_send_goods_time:""
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
    // 每次加载当前页  从sessionstorage中获取查询条件 有就有没有就没有
    let searchData = JSON.parse(window.sessionStorage.getItem('order'));
    // console.log(searchData);
    if(searchData != null){
      this.accout = searchData.accout;
      this.end_addtime = searchData.end_addtime;
      this.end_send_goods_time = searchData.end_send_goods_time;
      this.get_goods_name = searchData.get_goods_name;
      this.page = searchData.page;
      this.send_goods_name = searchData.send_goods_name;
      this.start_addtime = searchData.start_addtime;
      this.start_send_goods_time = searchData.start_send_goods_time;
      this.select_cate = searchData.status;
      this.limit = searchData.limit;
    }
    
    
    this.getData();
  },
  methods: {
    handleClick(item,index){
      item.box_num.forEach(item =>{
        item.num = item.num.replace(/[^0-9]+/, '');
      })
    },
    handleSelectionChange(val) {
      // 选中的  当前条 数据
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
    tableRowClassName({ row, rowIndex }) {
      // console.log(row,rowIndex);
      if (row.status == 2) {
        return "erring-row";
      }
    },
    jump(row) {
      // console.log(row);
      this.$axios
        .post(
          this.URL_API +
          
            "/berry/public/index.php/check_init_order/check_record",
          {
            o_id: row.o_id,
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
          },
          // #设置Content-Type
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        )
        .then(res => {
          if (res.data.code == 0) {
            this.jumpDate = res.data.data;
            this.jumpDate.forEach(item => {
              switch (item.status) {
                case 0:
                  item.status = "待审核";
                  break;
                case 1:
                  item.status = "通过";
                  break;
                case 2:
                  item.status = "驳回";
                  break;
                case 3:
                  item.status = "通过";
                  break;
                case 4:
                  item.status = "撤单";
                  break;
              }
              item.addtime = this.changeTime(item.addtime);
            });
            this.jumpVisible = true;
          } else if (res.data.code == 450) {
            this.$message.success("登录时间过长，请重新登录");
            this.$router.push("/login");
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    getData() {
      this.is_what = false;

      this.loading = true;
      this.$axios
        .post(
          this.URL_API + "/berry/public/index.php/init_order/index",
          {
            page: this.cur_page,
            limit: this.limit,
            order_code: this.accout, // 订单号
            status: this.select_cate, // 0 未审核 1 已审核
            send_goods_name: this.send_goods_name, // 发货人
            get_goods_name: this.get_goods_name, // 收货人
            start_addtime: this.start_addtime, // 下单开始时间
            end_addtime: this.end_addtime, // 下单结束时间
            start_send_goods_time: this.start_send_goods_time, // 发货开始时间
            end_send_goods_time: this.end_send_goods_time, // 发货结束时间
            send_goods_company: this.send_goods_company,
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
          } else {
            this.tableData = [];
            this.ccc = 1;
            this.$message.error(res.data.message);
            this.loading = false;
          }
        });
    },
    addtimesta(row, colume) {
      return row.addtime == null ? '暂无' : this.changeTime(row.addtime);
    },
    timesta(row, column) {
      return this.changeTime(row.send_goods_time);
    },
    changeTime(aaa) {
      let date = new Date(parseInt(aaa) * 1000);
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
      return Y + M + D ;
    },
    // 撤单
    rollback(){
      let len = this.multipleSelection;
      if(len.length < 1){
        this.$message.error("请选择要撤销的订单");
      }else if(len.length == 1){
        console.log(len);
        if(len[0].status == 3){
          // 可以撤销
          this.roll_id = len[0].o_id;
          this.rollbackVisible = true;
        }else{
          this.$message.error("请选择已经完成的订单");
        }
      }else{
        this.$message.error("请选择单个订单");
      }
    },
    rollbackCommit(){
      this.$axios
        .post(
          this.URL_API + "/berry/public/index.php/check_init_order/rollback_tms_order",
          {
            o_id: this.roll_id,
            cause: this.rollform.check,
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
            this.$message.success("撤单成功");
            this.delVisible = false;
            this.getData();
          } else if (res.data.code == 450) {
            this.$message.success("登录时间过长，请重新登录");
            this.$router.push("/login");
          } else {
            this.$message.error(data.message);
            this.delVisible = false;
          }
        });
    },
    // changeSta(row, colume) {
    //   switch (row.status) {
    //     case 0:
    //       return "待审核";
    //       break;
    //     case 1:
    //       return "通过";
    //       break;
    //     case 2:
    //       return "驳回";
    //       break;
    //     case 3:
    //       return "完成";
    //       break;
    //   }
    // },
    handleAdd() {
      let obj = {accout: this.accout,
      send_goods_name:this.send_goods_name,
      get_goods_name: this.get_goods_name,
      status: this.select_cate, // 0 未审核 1 已审核
      start_addtime: this.start_addtime, // 下单开始时间
      end_addtime: this.end_addtime, // 下单结束时间
      start_send_goods_time: this.start_send_goods_time, // 发货开始时间
      end_send_goods_time: this.end_send_goods_time, // 发货结束时间
      page: this.cur_page,
      limit: this.limit
      }
      window.sessionStorage.setItem('order',JSON.stringify(obj));
      this.$router.push("/add_order");
    },
    handleDetails() {
      let len = this.multipleSelection;
      // 订单  详情
      if (len.length == 1) {
      let obj = {accout: this.accout,
      send_goods_name:this.send_goods_name,
      get_goods_name: this.get_goods_name,
      status: this.select_cate, // 0 未审核 1 已审核
      start_addtime: this.start_addtime, // 下单开始时间
      end_addtime: this.end_addtime, // 下单结束时间
      start_send_goods_time: this.start_send_goods_time, // 发货开始时间
      end_send_goods_time: this.end_send_goods_time, // 发货结束时间
      page: this.cur_page,
      limit: this.limit
      }
      window.sessionStorage.setItem('order',JSON.stringify(obj));
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
      // console.log(this.box_num);return;

      if (status == 2 && this.order_why == "") {
        this.$message.error("请输入订单驳回的原因");
      } else {
        // 订单 审核
        // console.log(this.time_limit);return;
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
              // time_limit: this.formCheck.time_limit,
              // mode_type: this.formCheck.mode_type,
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
              this.$message.success("审核成功");
              this.getData();
            } else if (res.data.code == 450) {
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
          } else if (res.data.code == 450) {
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
            this.$message.error("选择的订单有审核已完成的单子，请重新选择");
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
          } else if (res.data.code == 450) {
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
              let obj = {accout: this.accout,
      send_goods_name:this.send_goods_name,
      get_goods_name: this.get_goods_name,
      status: this.select_cate, // 0 未审核 1 已审核
      start_addtime: this.start_addtime, // 下单开始时间
      end_addtime: this.end_addtime, // 下单结束时间
      start_send_goods_time: this.start_send_goods_time, // 发货开始时间
      end_send_goods_time: this.end_send_goods_time, // 发货结束时间
      page: this.cur_page,
      limit: this.limit
      }
      window.sessionStorage.setItem('order',JSON.stringify(obj));
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
          } else if (res.data.code == 450) {
            this.$message.error("登录时间过长，请重新登录");
            this.$router.push("/login");
          } else {
            this.$message.error(data.message);
            this.delVisible = false;
          }
        });
    },
    // 导出
    is_export() {
      // 导出
      this.loading = true;
      new Promise((resolve, reject) => {

        // 请求 试剂接口
        this.$axios
        .post(
          this.URL_API + "/berry/public/index.php/init_order/export_order_data",
          {
            order_code: this.accout, // 订单号
            status: this.select_cate, // 0 未审核 1 已审核
            send_goods_name: this.send_goods_name, // 发货人
            get_goods_name: this.get_goods_name, // 收货人
            start_addtime: this.start_addtime, // 下单开始时间
            end_addtime: this.end_addtime, // 下单结束时间
            start_send_goods_time: this.start_send_goods_time, // 发货开始时间
            end_send_goods_time: this.end_send_goods_time, // 发货结束时间
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
        let dataMath = res.data.data.data;
        
        let len = [];
        if(this.multipleSelection.length == 0){
          len = dataMath;
        }else{
          // len = this.multipleSelection;
          dataMath.forEach((item => {
            this.multipleSelection.forEach(item2 => {
              if(item2.o_id == item.o_id){
                len.push(item);
              }
            })
          }))
          
        }
        len = JSON.parse(JSON.stringify(len));
        len.forEach((item, index) => {
          item.addtime = this.changeTime(item.addtime);
          item.send_goods_time = this.changeTime(item.send_goods_time);
          switch (item.status) {
            case 0:
              item.status = "待审核";
              break;
            case 1:
              item.status = "通过";
              break;
            case 2:
              item.status = "驳回";
              break;
            case 3:
              item.status = "完成";
              break;
          }
        });

        let obj = {title: res.data.data.title,data: len};
          resolve(obj);
        });
      
      }).then((res) => {

        require.ensure([], () => {
          const { export_json_to_excel } = require("../../js/Export2Excel");
          const tHeader = [
            "订单号",
            "审核状态",
            "下单时间",
            "下单人员",
            "审核人",
            "发货时间",
            "发货地址",
            "时限",
            "发件公司",
            "收件客户",
            "收货地址",
            "保价金额"
          ];
          const filterVal = [
            "order_code",
            "status",
            "addtime",
            "place_order_admin",
            "check_order_admin",
            "send_goods_time",
            "send_goods_address",
            "time_limit",
            "send_goods_company",
            "company",
            "get_goods_address",
            "support_value"
          ];
          res.title.split(",").forEach(item => {
            tHeader.push(item);
            filterVal.push(item);
          })
          
          
          const list = res.data;
          this.loading = false;
          
          const data = this.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, "订单信息列表");
        });
      });

      return;
    },
    formatJson: function(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    }
  }
};
</script>

<style>
.el-table {
  color: #000;
}
.el-table .erring-row .cell {
  color: red !important;
}
.el-table .bg_ccc {
  background-color: #f5f7fa;
}
.el-dialog__body .el-input--small .el-input__inner {
  width: inherit;
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
td,
th {
  border: solid #ccc;
  border-width: 0px 1px 1px 0px;
  text-align: center;
  font-size: 12px;
}

table {
  border: solid #ccc;
  border-width: 1px 0px 0px 1px;
  border-collapse: collapse;
  width: 100%;
}
</style>
