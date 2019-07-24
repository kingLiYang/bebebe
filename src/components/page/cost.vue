<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 费用管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-form :inline="true">
          <el-row type="flex" justify="space-between">
            <!-- <el-col :span="10">
              <el-button type="primary" @click="handleAdd()">添加</el-button>
              <el-button type="primary" @click="handleEdit()">修改</el-button>
              <el-button type="primary" @click="handleDelete()">删除</el-button>
            </el-col>-->
            <el-col>
              <el-form-item label="发货时间">
                <el-input v-model="TakeTime"></el-input>
              </el-form-item>
              <el-form-item label="至">
                <el-input v-model="GetsTime"></el-input>
              </el-form-item>
              <el-form-item label="客户名称">
                <el-input v-model="art_no"></el-input>
              </el-form-item>
              <el-form-item label="地址">
                <el-input v-model="address"></el-input>
              </el-form-item>
              <el-button type="primary" icon="search" @click="getData">搜索</el-button>
              <el-button type="primary" @click="is_export()">导出</el-button>
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
      >
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column fixed="left" type="index" width="50" label="序号" align="center"></el-table-column>
        <el-table-column prop="id" label="订单号" align="center" fixed></el-table-column>
        <el-table-column prop="beirui_code" label="贝瑞订单号" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="OrderTime" label="发货时间" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="City" label="始发城市" align="center"></el-table-column>
        <el-table-column prop="GetCity" label="目的城市" align="center"></el-table-column>
        <el-table-column
          prop="GetAddress"
          label="目的地址"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        
        <el-table-column prop="GetCompany" label="客户名称" align="center" :show-overflow-tooltip="true"></el-table-column>
<el-table-column label="试剂套数" align="center">
          <template slot-scope="scope">
            <input
              v-model="scope.row.beirui_drug_num"
              @blur="drugNum(scope.row)"
              :disabled="scope.row.beirui_is_ture == 1 ? true : false"
              style="width:50px;"
            >
          </template>
        </el-table-column>
        <el-table-column prop="box_num" label="总件数" align="center"></el-table-column>
                <el-table-column
          prop="temperature"
          label="温度要求"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column prop="box1" label="箱型1" align="center"></el-table-column>
        <el-table-column prop="num1" label="件数1" align="center"></el-table-column>
        <el-table-column prop="price1" label="单价1" align="center"></el-table-column>
        <el-table-column prop="box2" label="箱型2" align="center"></el-table-column>
        <el-table-column prop="num2" label="件数2" align="center"></el-table-column>
        <el-table-column prop="price2" label="单价2" align="center"></el-table-column>
        <el-table-column prop="box3" label="箱型3" align="center"></el-table-column>
        <el-table-column prop="num3" label="件数3" align="center"></el-table-column>
        <el-table-column prop="price3" label="单价3" align="center"></el-table-column>
        <el-table-column prop="box4" label="箱型4" align="center"></el-table-column>
        <el-table-column prop="num4" label="件数4" align="center"></el-table-column>
        <el-table-column prop="price4" label="单价4" align="center"></el-table-column>
        <el-table-column prop="yunfei_jisuan" label="运费" align="center"></el-table-column>
        <el-table-column prop="SafePay" label="保价金额" align="center"></el-table-column>
        <el-table-column prop="new_premium" label="保价增值" align="center"></el-table-column>
                <el-table-column label="加急费用(元)" align="center">
          <template slot-scope="scope">
            <input
              v-model="scope.row.new_urgent"
              @blur="urgent(scope.row)"
              :disabled="scope.row.beirui_is_ture == 1 ? true : false"
              style="width:50px;"
            >
          </template>
        </el-table-column>
        <el-table-column prop="new_total_money" label="总费用(元)" align="center"></el-table-column>
        <el-table-column label="是否确认" align="center">
          <template slot-scope="scope">
            <el-checkbox
              :checked="scope.row.beirui_is_ture == 1 ? true : false"
              :disabled="scope.row.beirui_is_ture == 1 ? true : false"
              @change.native.prevent="is_true(scope.row)"
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="beirui_ture_name" label="确认人" align="center"></el-table-column>
        <el-table-column
          prop="beirui_ture_time"
          label="确认时间"
          align="center"
          :formatter="addtimesta"
          :show-overflow-tooltip="true"
        ></el-table-column>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      AccountNumber:"", // 客户号 查地区
      art_no: '',
      address: '',
      ccc: 1,
      tableData: [],
      loading: true,
      multipleSelection: '',
      cur_page: 1,
      limit: 50,
      tableAllData: [],
      GetsTime:"",
      TakeTime:"",
    };
  },
  created() {
    this.AccountNumber = window.sessionStorage.getItem("AccountNumber");
    this.token = window.sessionStorage.getItem("token");
    let obj = JSON.parse(window.sessionStorage.getItem('cost'));
    if(obj != null){
            this.cur_page = obj.page;
            this.limit = obj.limit;
            this.TakeTime = obj.TakeTime;
            this.GetsTime = obj.GetsTime;
            this.art_no = obj.GetCompany;
            this.address = obj.GetAddress
    }
    this.getData();
  },
  computed: {},
  methods: {
    handleSelectionChange(val) {
      // 选中的  当前条 数据
      this.multipleSelection = val;
    },
    drugNum(row){
            this.$axios
        .post(
          this.URL_API + "/berry/public/index.php/Init_way_bill/check_drug_num",
          {
            id: row.id,
            num: row.beirui_drug_num == null ? "" : row.beirui_drug_num,
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
          if (res.data.code == 450) {
            this.$message.success("登录时间过长，请重新登录");
            this.$router.push("/login");
          } else {
            // this.$message.error(res.data.message);
          }
        });
    },
    urgent(row) {

      this.$axios
        .post(
          this.URL_API + "/berry/public/index.php/Init_way_bill/urgent",
          {
            id: row.id,
            money: row.new_urgent == null ? "" : row.new_urgent,
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
          if (res.data.code == 450) {
            this.$message.success("登录时间过长，请重新登录");
            this.$router.push("/login");
          } else {
            // this.$message.error(res.data.message);
          }
        });
    },
    // 是否确认  选择框
    is_true(val) {
     
      if (val.beirui_is_ture == 1) {
        
        this.$message.error("已经确认，不能重复操作");
      } else {
        this.$axios
          .post(
            this.URL_API + "/berry/public/index.php/Init_way_bill/user_true",
            {
              id: val.id,
              is_true: 1,
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
            if (res.data.code == 450) {
              this.$message.success("登录时间过长，请重新登录");
              this.$router.push("/login");
            } else {
              this.$message.success(res.data.message);
              this.getData();
            }
          });
      }
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
    getData() {
      let obj = {
            TakeTime: this.TakeTime,
            GetsTime: this.GetsTime,
            GetCompany: this.art_no,
            GetAddress: this.address,
            page: this.cur_page,
            limit: this.limit,
      }
      window.sessionStorage.setItem("cost",JSON.stringify(obj));
      this.loading = true;

      this.$axios
        .post(
          this.URL_API + "/berry/public/index.php/init_way_bill/way_price",
          {
            page: this.cur_page,
            limit: this.limit,
            TakeTime: this.TakeTime,
            GetsTime: this.GetsTime,
            token: this.token,
            GetCompany: this.art_no,
            GetAddress: this.address,
            AccountNumber: this.AccountNumber
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
          }else{
            this.loading = false;
            this.tableData = [];
            this.ccc = 1;
          }
        });
    },
    is_export() {
      // 导出
      this.loading = true;
      let import_file = [];
      new Promise((resolve, reject) => {
        // this.getAllData();
      import_file = this.multipleSelection;
      
      if (import_file.length == 0) {
        
        this.limit = 10000;
        this.getData();
        import_file = this.tableData;
      }
      resolve(import_file);
      }).then(res => {
        // this.tableAllData = res;
        // console.log(res);return;
        require.ensure([], () => {
          const { export_json_to_excel } = require("../../js/Export2Excel");
          const tHeader = [
            "订单号",
            "贝瑞订单号",
            "发货时间",
            "始发城市",
            "目的城市",
            "目的地址",
            "客户名称",
            "试剂套数",
            "总件数",
            "温度要求",
            "箱型1",
            "件数1",
            "单价1",
            "箱型2",
            "件数2",
            "单价2",
            "箱型3",
            "件数3",
            "单价3",
            "箱型4",
            "件数4",
            "单价4",
            "运费",
            "保价金额",
            "保价增值",
            "加急费用",
            "总费用",
            "是否确认",
            "确认人",
            "确认时间"
          ];
          const filterVal = [
            "id",
            "beirui_code",
            "OrderTime",
            "City", // 始发城市
            "GetCity", // 目的城市
            "GetAddress", // 目的地址
            "GetCompany", // 客户名称
            "beirui_drug_num", // 试剂套数
            "box_num", // "总件数",
            "temperature", // "温度要求",
            "box1", // "箱型1",
            "num1", // "数量1",
            "price1", // "单价1",
            "box2", // "箱型2",
            "num2", // "数量2",
            "price2", // "单价2",
            "box3", // "箱型3",
            "num3", // "数量3",
            "price3", // "单价3",
            "box4", // "箱型4",
            "num4", // "数量4",
            "price4", // "单价4"
            "yunfei_jisuan", // 运费
            "SafePay", // 保价金额
            "new_premium", // 保价增值
            "new_urgent", // "加急费用",
            "new_total_money", // "总费用",
            "beirui_is_ture", // 是否确认
            "beirui_ture_name", // 确认人
            "beirui_ture_time" // 确认时间
            
          ];
          const list = res;
          this.loading = false;
          const data = this.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, "费用信息列表");
        });
      });

      return;
    },
    addtimesta(row, colume) {
      if (row.beirui_ture_time == null) {
        return " ";
      } else {
        return this.changeTime(row.beirui_ture_time);
      }
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
.el-table .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
  background-color: #409eff;
  border-color: #409eff;
}
</style>
<style scoped>
</style>
