<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 订单添加
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="container">
      <div class="handle-box">
        <el-form label-width="100px" :gutter="20" :inline="true">
          <el-col :pull="1">
            <el-form-item label="订单号">
              <el-input v-model="order_num"></el-input>
            </el-form-item>
            <el-form-item label="发货时间">
              <!-- <el-input v-model="ask_time"></el-input> -->
              <el-date-picker
                v-model="ask_time"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="选择日期时间"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="时限">
              <!-- <el-input v-model="limit"></el-input> -->
              <el-select placeholder="请选择" class="handle-select mr10" v-model="limit">
                <el-option label="请选择" value></el-option>
                <el-option label="12H" value="12H"></el-option>
                <el-option label="24H" value="24H"></el-option>
                <el-option label="36H" value="36H"></el-option>
                <el-option label="48H" value="48H"></el-option>
                <el-option label="72H" value="72H"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="审核人">
              <!-- <el-input v-model="limit"></el-input> optionsStatus -->
              <el-select placeholder="请选择" class="handle-select mr10" v-model="statusMan">
                <el-option label="请选择" value></el-option>
                <el-option
                  :label="item.relly_name"
                  :value="item.u_id"
                  v-for="(item,index) in optionsStatus"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form>
      </div>
      <div
        style="margin: 50px 0 20px 0;border:1px solid #ccc;padding: 20px"
        v-for="(ite,index) in drug_data"
        :key="index"
      >
        <div>
          <el-form :inline="true">
            <el-form-item label="货号">
              <el-input
                v-model="ite.art_no"
                @blur="getDrug(ite.art_no,index)"
                @input="ifNull(ite.art_no)"
              ></el-input>
            </el-form-item>
            <el-form-item label="数量">
              <el-input v-model="ite.art_num"></el-input>
            </el-form-item>
            <el-form-item label="是否使用温度计">
              <!-- <el-input v-model="limit"></el-input> -->
              <el-select placeholder="请选择" class="handle-select mr10" v-model="ite.is_thermomete">
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="float:right;">
              <span @click="add_drug" style="color:blue;cursor:pointer;">添加</span>
              <span @click="del_drug(index)" style="color:blue;cursor:pointer;">删除</span>
            </el-form-item>
          </el-form>
        </div>

        <ul class="drug_list" v-if="isShow">
          <li v-for="(item,index) in ite.drug_list" :key="index">
            <span style="font-weight:800;">药品信息</span>
            <el-form label-width="100px" :inline="true" style="padding:10px 0 0 0;">
              <el-form-item label="型号">
                <el-input size="medium" v-model="item.model" disabled></el-input>
              </el-form-item>
              <el-form-item label="保价金额">
                <el-col>
                  <el-input v-model="item.support" disabled></el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="储运温度">
                <el-select
                  placeholder="请选择"
                  class="handle-select mr10"
                  v-model="item.temperature"
                  disabled
                >
                  <el-option label="请选择" value></el-option>
                  <el-option label="-25℃~-15℃" value="-25℃~-15℃"></el-option>
                  <el-option label="2℃~8℃" value="2℃~8℃"></el-option>
                  <el-option label="15℃~25℃" value="15℃~25℃"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="尺寸">
                <el-input v-model="item.size" disabled></el-input>
              </el-form-item>
              <el-form-item label="品名">
                <el-input v-model="item.trade_name" disabled></el-input>
              </el-form-item>
              <el-form-item label="放置方式">
                <el-input v-model="item.placement_mode" disabled></el-input>
              </el-form-item>
              <el-form-item label="规格">
                <el-input v-model="item.standard" disabled></el-input>
              </el-form-item>
            </el-form>
          </li>
        </ul>
      </div>
      <!-- 发货信息   收货信息 -->
      <div style="border:1px solid #ccc;margin:20px 0;padding:20px;">
        <div>
          <span style="font-weight:800;">发货信息</span>
          <el-form :model="send" label-width="100px" :inline="true" style="padding:10px 0 0 0;">
            <el-form-item label="发货人">
              <!-- <el-input size="medium" @blur="get_send()" v-model="send.name"></el-input> -->
              <el-autocomplete
                class="inline-input"
                v-model="send.name"
                :fetch-suggestions="querySearch"
                :trigger-on-focus="false"
                @select="handleSelect"
              ></el-autocomplete>
            </el-form-item>
            <el-form-item label="发货公司">
              <el-input v-model="send.company" disabled></el-input>
            </el-form-item>
            <el-form-item label="联系电话">
              <el-input v-model="send.phone" disabled></el-input>
            </el-form-item>

            <el-form-item label="省">
              <el-input v-model="send.provice" disabled></el-input>
            </el-form-item>
            <el-form-item label="市">
              <el-input v-model="send.city" disabled></el-input>
            </el-form-item>
            <el-form-item label="区">
              <el-input v-model="send.area" disabled></el-input>
            </el-form-item>
            <el-form-item label="详址">
              <el-input v-model="send.address" disabled></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div>
          <span style="font-weight:800;">收货信息</span>
          <el-form :model="receive" label-width="100px" :inline="true" style="padding:10px 0 0 0;">
            <el-form-item label="收货人">
              <!-- <el-input size="medium" v-model="receive.name" @blur="get_recive"></el-input> -->
              <el-autocomplete
                class="inline-input"
                v-model="receive.name"
                :fetch-suggestions="querySearchreceive"
                :trigger-on-focus="false"
                @select="handleSelectreceive"
              ></el-autocomplete>
            </el-form-item>
            <el-form-item label="收货公司">
              <el-input v-model="receive.company" disabled></el-input>
            </el-form-item>
            <el-form-item label="联系电话">
              <el-col>
                <el-input v-model="receive.phone" disabled></el-input>
              </el-col>
            </el-form-item>

            <el-form-item label="省">
              <el-input v-model="receive.provice" disabled></el-input>
            </el-form-item>
            <el-form-item label="市">
              <el-input v-model="receive.city" disabled></el-input>
            </el-form-item>
            <el-form-item label="区">
              <el-input v-model="receive.area" disabled></el-input>
            </el-form-item>
            <el-form-item label="详址">
              <el-input v-model="receive.address" disabled></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <el-button @click="addReturn">返 回</el-button>
      <el-button type="primary" @click="addCommit">确 定</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      order_num: "",
      ask_time: "",
      limit: "",
      statusMan: "", // 审核人
      optionsStatus: [],
      send_id: "",
      get_id: "",
      isShow: false,
      drug_data: [
        {
          art_no: "", // 货号
          art_num: "", // 数量
          is_thermomete: "是", // 是否使用温度计
          drug_list: [] // 药品信息
        }
      ],
      receive: {
        name: "",
        phone: "",
        company: "",
        provice: "",
        city: "",
        area: "",
        address: ""
      },
      send: {
        name: "",
        phone: "",
        company: "",
        provice: "",
        city: "",
        area: "",
        address: ""
      },
      token: "",
      type: "",
      restaurants: [] // 模糊查询
    };
  },
  created() {
    this.token = window.sessionStorage.getItem("token");
    this.getStatus(); // 获取审核人
  },
  methods: {
    getStatus() {
      // 获取审核人
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
          if (res.data.code == 0) {
            this.optionsStatus = res.data.data.data;
            this.order_num = res.data.data.order;
          } else {
            this.$message.error("暂无审核人信息");
          }
        });
    },
    add_drug() {
      let obj = {
        art_no: "", // 货号
        art_num: "", // 数量
        is_thermomete: "是", // 是否使用温度计
        drug_list: [] // 药品信息
      };
      this.drug_data.push(obj);
    },
    del_drug(index) {
      if (this.drug_data.length == 1) {
        this.$message.error("手下留情，不要删我");
      } else {
        this.drug_data.splice(index, 1);
      }
    },
    ifNull(bbb) {
      // 货号为空 不显示 药品信息
      if (bbb == "") {
        this.isShow = false;
      }
    },
    getDrug(aaa, index) {
      // 货号 查询药品信息
      //   console.log(aaa);
      if (aaa != "") {
        this.$axios
          .post(
            this.URL_API + "/berry/public/index.php/drug/get_drug",
            {
              art_no: aaa,
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
              this.isShow = true;
              this.drug_data[index].drug_list = res.data.data;
            } else {
              this.$message.error(res.data.message);
            }
          });
      }
    },
    querySearch(queryString, cb) {
      new Promise((resolve, reject) => {
        this.$axios
          .post(
            this.URL_API + "/berry/public/index.php/address/get_address",
            {
              username: queryString,
              type: 1,
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
            this.send_id = "";
            this.send.phone = "";
            this.send.company = "";
            this.send.provice = "";
            this.send.city = "";
            this.send.area = "";
            this.send.address = "";
            if (res.data.code == 0) {
              res.data.data.forEach(item => {
                item.value = item.username;
              });

              let obj = { data: res.data.data, queryString: queryString };
              resolve(obj);
            } else if (res.data.code == 450) {
              this.$message.success("登录时间过长，请重新登录");
              this.$router.push("/login");
            }
          });
      }).then(res => {
        var restaurants = res.data;
        var results = queryString
          ? restaurants.filter(this.createFilter(res.queryString))
          : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      });
    },
    querySearchreceive(queryString, cb){
            new Promise((resolve, reject) => {
        this.$axios
          .post(
            this.URL_API + "/berry/public/index.php/address/get_address",
            {
              username: queryString,
              type: 2,
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
            this.get_id = "";
            this.receive.phone = "";
            this.receive.company = "";
            this.receive.provice = "";
            this.receive.city = "";
            this.receive.area = "";
            this.receive.address = "";
            if (res.data.code == 0) {
              res.data.data.forEach(item => {
                item.value = item.username;
              });

              let obj = { data: res.data.data, queryString: queryString };
              resolve(obj);
            } else if (res.data.code == 450) {
              this.$message.success("登录时间过长，请重新登录");
              this.$router.push("/login");
            }
          });
      }).then(res => {
        var restaurants = res.data;
        var results = queryString
          ? restaurants.filter(this.createFilter(res.queryString))
          : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      });
    },
    createFilter(queryString) {
      return restaurant => {
        return (true);
      };
    },
    handleSelect(item) {
      // 选中 渲染数据
      this.send_id = item.id;
      this.send.phone = item.phone;
      this.send.company = item.company;
      this.send.provice = item.province;
      this.send.city = item.city;
      this.send.area = item.district;
      this.send.address = item.address;
    },
    handleSelectreceive(item) {
      this.get_id = item.id;
      this.receive.phone = item.phone;
      this.receive.company = item.company;
      this.receive.provice = item.province;
      this.receive.city = item.city;
      this.receive.area = item.district;
      this.receive.address = item.address;
    },
    addReturn() {
      this.$router.push("/initOrder");
    },
    addCommit() {
      const Qs = require("qs");
      let arr = [];
      this.drug_data.forEach(item => {
        arr.push(item);
      });
      arr.forEach(item => {
        if (item.is_thermomete == "是") {
          item.is_thermometer = "1";
        } else {
          item.is_thermometer = item.is_thermomete;
        }
        delete item.is_thermomete;
        delete item.drug_list;
      });
      this.$axios
        .post(
          this.URL_API + "/berry/public/index.php/init_order/add",
          {
            order_code: this.order_num, // 订单号
            send_goods_time: this.ask_time, // 发货时间
            time_limit: this.limit, // 时限
            check_order_admin: this.statusMan, // 审核人员
            send_goods_address: this.send_id, // 发货地址id
            get_goods_address: this.get_id, // 收货地址id
            goods: arr, // 货号信息  数组
            o_id: "", // 修改必传  添加无所谓
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
            this.$message.success("添加成功");
            this.$router.push("/initOrder");
          } else if (res.data.code == 450) {
            this.$message.success("登录时间过长，请重新登录");
            this.$router.push("/login");
          } else {
            this.$message.error(res.data.message);
          }
        });
    }
  }
};
</script>
<style>
body {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
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
.drug_list {
  list-style-type: none;
}
</style>


