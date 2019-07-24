<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 运单列表
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" @click="temperatureInformation()">导出</el-button>
        <el-button type="primary" @click="exportImg()">签收照片导出</el-button>

        <el-form :inline="true" style="margin: 20px 0 0 0;">
          <el-row>
            <el-col>
              <el-form-item label="订单号">
                <el-input v-model="Order_number" type="number" placeholder="只能输入数字"></el-input>
              </el-form-item>
              <el-form-item label="运单号">
                <el-input v-model="Waybill_number"></el-input>
              </el-form-item>
              <el-form-item label="运单状态">
                <el-select v-model="select_cate" placeholder="请选择" class="handle-select mr10">
                  <el-option key="0" label="出港完成" value="出港完成"></el-option>
                  <el-option key="1" label="进入目的站" value="进入目的站"></el-option>
                  <el-option key="2" label="派送" value="派送"></el-option>
                  <el-option key="3" label="取件完成" value="取件完成"></el-option>
                  <el-option key="4" label="入库完成" value="入库完成"></el-option>
                  <el-option key="5" label="签收完成!" value="签收完成!"></el-option>
                  <el-option key="6" label="签收完成" value="签收完成"></el-option>
                  <el-option key="7" label="配载完成" value="配载完成"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="运单生成时间">
                <el-input v-model="TakeTime"></el-input>
              </el-form-item>
              <el-form-item label="至">
                <el-input v-model="GetsTime"></el-input>
              </el-form-item>
              <!-- <el-form-item label="发货时间">
                <el-date-picker
                  v-model="value4"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetimerange"
                  :picker-options="pickerOptions2"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </el-form-item> -->
              <el-form-item label="收件客户">
                <el-input v-model="art_no"></el-input>
              </el-form-item>
              <el-form-item label="地址">
                <el-input v-model="address"></el-input>
              </el-form-item>
              <el-button type="primary" icon="search" @click="getData">搜索</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        ref="multipleTable"
        border
        max-height="400"
        @selection-change="handleSelectionChange"
        v-loading="loading"
      >
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column type="index" width="50" label="序号" align="center" fixed></el-table-column>
        <el-table-column prop="ID" label="TMS订单号" align="center"></el-table-column>
        <el-table-column prop="GetCompany" label="收件客户" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="Condition" label="运单状态" align="center"></el-table-column>
        <el-table-column prop="BillNumber" label="运单号" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column
          prop="TakeTime"
          label="运单生成时间"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          prop="SendsAddress"
          label="发件地址"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>

        <el-table-column
          prop="GetAddress"
          label="收件地址"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          prop="GetsTime"
          label="签收时间"
          align="center"
          :formatter="timesta"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column label="操作" align="center" width="250">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click.native.prevent="details(scope.row)">详情</el-button>
            <el-button
              size="small"
              type="warning"
              @click.native.prevent="TemperatureList(scope.row)"
            >温度</el-button>
          </template>
        </el-table-column>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      art_no:"",
      address:"",
      AccountNumber:"", // 客户号 查地区
      Waybill_number: "", //运单号
      Order_number: "", //订单号
      select_cate: "", //运单状态
      tableData: [],
      loading: true,
      form: {
        Waybill_number: "",
        Order_number: ""
      },
      cur_page: 1,
      limit:50,
      ccc: 0, //总页数
      token: "",
      multipleSelection: [],
      TakeTime:"",
      GetsTime:""
    };
  },
  created() {
    this.AccountNumber = window.sessionStorage.getItem("AccountNumber");
    this.token = window.sessionStorage.getItem("token");
    let obj = JSON.parse(window.sessionStorage.getItem("waybill"));
    if(obj != null){
            this.cur_page = obj.page; //当前页
            this.limit = obj.limit;
            this.Waybill_number = obj.BillNumber; //运单号
            this.select_cate = obj.Condition; // 0 未完成 1 已完成
            this.Order_number = obj.ID; //订单号
            this.TakeTime = obj.TakeTime; // 下单开始时间
            this.GetsTime = obj.GetsTime; // 下单结束时间
            this.art_no = obj.GetCompany;
            this.address = obj.GetAddress;
    }
    this.getData();
  },
  methods: {
    // 分页导航
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
    handleSizeChange(val){
        // console.log(val); // 每页显示  条数
        this.loading = true;
        this.limit  = val;
        this.getData();
    },
    getData() {
            let obj = {
            page: this.cur_page, //当前页
            limit: this.limit,
            BillNumber: this.Waybill_number, //运单号
            Condition: this.select_cate, // 0 未完成 1 已完成
            ID: this.Order_number, //订单号
            TakeTime: this.TakeTime, // 下单开始时间
            GetsTime: this.GetsTime, // 下单结束时间
            GetCompany: this.art_no,
            GetAddress: this.address
      }
      window.sessionStorage.setItem('waybill',JSON.stringify(obj));
      if(this.TakeTime == this.GetsTime && this.TakeTime != ''&&this.GetsTime != ''){
        this.$message.error("搜索的起止时间不允许相同");
      }else{
      this.loading = true;
      this.$axios
        .post(
          this.URL_API + "/berry/public/index.php/Init_way_bill/index",
          {
            page: this.cur_page, //当前页
            limit: this.limit,
            BillNumber: this.Waybill_number, //运单号
            Condition: this.select_cate, // 0 未完成 1 已完成
            ID: this.Order_number, //订单号
            TakeTime: this.TakeTime, // 下单开始时间
            GetsTime: this.GetsTime, // 下单结束时间
            GetCompany: this.art_no,
            GetAddress: this.address,
            AccountNumber: this.AccountNumber,
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
            this.tableData = res.data.data;
            this.tableData.forEach((item,index) => {
              if(item.Condition == null){
                item.Condition = '暂无'
              }
            })
            this.ccc = res.data.sum;
            this.loading = false;
          }else if(res.data.code == 450){
            this.$message.success("登录时间过长，请重新登录");
            this.$router.push("/login");
          } else {
            this.tableData = [];
            this.ccc = 1;
            this.loading = false;
            this.$message.error(res.data.message);
          }
        });
      }

    },


    //
    timesta(row, column) {
      // return  this.GetsTime = row.GetsTime||"暂无";
      // return this.GetsTime == null ? new date() : row.GetsTime;
      if (row.GetsTime == null) {
        // let time = new date();
        return "暂无";
      } else {
        return row.GetsTime;
      }
    },
    // 签收照片导出
exportImg(){
  let len = this.multipleSelection;
  // console.log(len);
  if(len.length == 0){
    this.$message.error("请选择导出的运单");
  }else if(len.length>1){
    this.$message.error("请选择单个运单");
  }else if(len[0].Condition != '签收完成' && len[0].Condition != '签收完成!'){
    this.$message.error("请选择签收完成的运单");
  }else{
    // this.loading = true;
     window.open('http://out.ccsc58.cc/DATA_PUBLIC/Picture.php?billnumber='+len[0].BillNumber);
    
  }
},
        // 导出
    temperatureInformation() {
      // 导出
      this.loading = true;
      let import_file;

      new Promise((resolve, reject) => {
      import_file = this.multipleSelection;
      if (import_file.length == 0) {
        this.limit = 10000;
        this.getData();
        import_file = this.tableData;
      }
      // console.log(import_file);return;
        // let data = JSON.parse(JSON.stringify(this.tableData));
        // data.forEach((item, index) => {
        //   item.addtime = this.changeTime(item.addtime);
        //   item.send_goods_time = this.changeTime(item.send_goods_time);
        //   switch (item.status) {
        //     case 0:
        //       item.status = "待审核";
        //       break;
        //     case 1:
        //       item.status = "通过";
        //       break;
        //     case 2:
        //       item.status = "驳回";
        //       break;
        //     case 3:
        //       item.status = "完成";
        //       break;
        //   }
        // });
        resolve(import_file);
      }).then(res => {
        require.ensure([], () => {
          const { export_json_to_excel } = require("../../js/Export2Excel");
          const tHeader = [
            "TMS订单号",
            "收件客户",
            "运单状态",
            "运单号",
            "运单生成时间",
            "发件地址",
            "收件地址",
            "签收时间"
          ];
          const filterVal = [
            "ID",
            "GetName",
            "Condition",
            "BillNUmber",
            "TakeTime",
            "SendsAddress",
            "GetAddress",
            "GetsTime"
          ];
          const list = res;
          this.loading = false;
          const data = this.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, "运单信息列表");
        });
      });

      return;
    },
    formatJson: function(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },

    //详情
    details(rows) {
      let obj = {
            page: this.cur_page, //当前页
            limit: this.limit,
            BillNumber: this.Waybill_number, //运单号
            Condition: this.select_cate, // 0 未完成 1 已完成
            ID: this.Order_number, //订单号
            TakeTime: this.TakeTime, // 下单开始时间
            GetsTime: this.GetsTime, // 下单结束时间
            GetCompany: this.art_no,
            GetAddress: this.address
      }
      window.sessionStorage.setItem('waybill',JSON.stringify(obj));
      let detailsID = rows.ID;
      let status = rows.Condition;
      // var detailId = id.toString() ;

      window.localStorage.setItem("detailsID", detailsID);
      window.localStorage.setItem("status", status);
      this.$router.push({ path: "/WaybillDetails" });
    },
   
    //温度详情页
    TemperatureList(rows) {
      let BillNumber = rows.BillNumber;

      this.$axios
        .post(
          this.URL_API + "/berry/public/index.php/Init_way_bill/temperature",
          {
            BillNumber: BillNumber,
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
          if (res.data.code == "0") {
            
            window.localStorage.setItem("data1", JSON.stringify(res.data));
            window.localStorage.setItem("BillNumber", BillNumber);
            this.$router.push({ path: "/TemperatureList" });
          } else if (res.data.code == "450") {
            this.$message("暂无权限");
          }
        });
    }
  }
};
</script>
<style>
.el-table {
  color: #000;
}
</style>

<style scoped>

.handle-select {
  width: 120px;
}

td,
th {
  border: solid #ccc;
  border-width: 0px 1px 1px 0px;
  padding: 10px 0px;
  text-align: center;
}

table {
  border: solid #ccc;
  border-width: 1px 0px 0px 1px;
  border-collapse: collapse;
  width: 100%;
}
.table_td {
  background-color: #eff4f6;
}
</style>
