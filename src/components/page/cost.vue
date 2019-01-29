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
              <el-form-item label="时间">
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
              <!-- <el-form-item label="货号">
                <el-input v-model="art_no"></el-input>
              </el-form-item>
              <el-form-item label="型号">
                <el-input v-model="model"></el-input>
              </el-form-item>-->
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
        ref="multipleTable"
        v-loading="loading"
      >
        <!-- <el-table-column type="selection" width="60" align="center"></el-table-column> -->
        <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
        <el-table-column prop="id" label="订单号" align="center"></el-table-column>
        <el-table-column prop="Depart" label="发货省份" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="City" label="发货城市" align="center"></el-table-column>
        <el-table-column prop="Address" label="发货地址" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="GetDepart" label="收货省份" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="GetCity" label="收货城市" align="center"></el-table-column>
        <el-table-column
          prop="GetAddress"
          label="收货地址"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column prop="yunfei_jisuan" label="运费(元)" align="center"></el-table-column>
        <el-table-column prop="SafePay" label="保价金额(元)" align="center"></el-table-column>
      </el-table>
      <div class="pagination">
        <!-- <el-pagination
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :page-size="10"
          :total="ccc"
        ></el-pagination> -->
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
      ccc: 1,
      tableData: [],
      loading: true,
      cur_page: 1,
      limit: 50,
      tableAllData:[],
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
    this.getData();
  },
  computed: {},
  methods: {
    // 分页导航
    handleCurrentChange(val) {
      this.loading=true;
      this.cur_page = val;
      this.getData();
    },
            handleSizeChange(val){
              this.loading=true;
        // console.log(val); // 每页显示  条数
        this.limit  = val;
        this.getData();
    },
    getData() {
      if (this.value5 == null) {
        this.value5 = ["", ""];
      }

      this.$axios
        .post(
          this.URL_API + "/berry/public/index.php/init_way_bill/way_price",
          {
            page: this.cur_page,
            limit: this.limit,
            TakeTime: this.value5[0] || "",
            GetsTime: this.value5[1] || "",
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
    getAllData(){
            this.$axios
        .post(
          this.URL_API + "/berry/public/index.php/init_way_bill/way_price",
          {
           export:1,
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
            // this.tableAllData = res.data.data.data;
            resolve(res.data.data.data);
          } else if (res.data.code == 450) {
            this.$message.success("登录时间过长，请重新登录");
            this.$router.push("/login");
          }
        });
    },
    is_export(){
      // 导出
      new Promise((resolve,reject)=>{
        // this.getAllData();
                    this.$axios
        .post(
          this.URL_API + "/berry/public/index.php/init_way_bill/way_price",
          {
           export:1,
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
            // this.tableAllData = res.data.data.data;
            resolve(res.data.data.data);
          } else if (res.data.code == 450) {
            this.$message.success("登录时间过长，请重新登录");
            this.$router.push("/login");
          }
        });

      }).then(res =>{
        // this.tableAllData = res;
        require.ensure([], () => {
        const { export_json_to_excel } = require("../../js/Export2Excel");
        const tHeader = [
          "订单号",
          "发货省份",
          "发货城市",
          "发货地址",
          "收货省份",
          "收货城市",
          "收货地址",
          "运费",
          "保价金额"
        ];
        const filterVal = [
          "id",
          "Depart",
          "City",
          "Address",
          "GetDepart",
          "GetCity",
          "GetAddress",
          "yunfei_jisuan",
          "PayMoney"
        ];
        const list = res;
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "费用信息列表");
      });

      })

       return;
        
    },
        formatJson: function(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
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

</style>
