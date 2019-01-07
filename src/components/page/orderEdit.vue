<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 订单修改
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
                <el-option label="12" value="12"></el-option>
                <el-option label="24" value="24"></el-option>
                <el-option label="36" value="36"></el-option>
                <el-option label="48" value="48"></el-option>
                <el-option label="72" value="72"></el-option>
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
          <li v-for="(item,index) in ite.drug" :key="index">
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
              <el-input size="medium" @blur="get_send()" v-model="send.username"></el-input>
            </el-form-item>
            <el-form-item label="联系电话">
              <el-input v-model="send.phone" disabled></el-input>
            </el-form-item>
            <el-form-item label="发货公司">
              <el-input v-model="send.company" disabled></el-input>
            </el-form-item>
            <el-form-item label="省">
              <el-input v-model="send.province" disabled></el-input>
            </el-form-item>
            <el-form-item label="市">
              <el-input v-model="send.city" disabled></el-input>
            </el-form-item>
            <el-form-item label="区">
              <el-input v-model="send.district" disabled></el-input>
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
              <el-input size="medium" v-model="receive.username" @blur="get_recive"></el-input>
            </el-form-item>
            <el-form-item label="联系电话">
              <el-col>
                <el-input v-model="receive.phone" disabled></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="收货公司">
              <el-input v-model="receive.company" disabled></el-input>
            </el-form-item>
            <el-form-item label="省">
              <el-input v-model="receive.province" disabled></el-input>
            </el-form-item>
            <el-form-item label="市">
              <el-input v-model="receive.city" disabled></el-input>
            </el-form-item>
            <el-form-item label="区">
              <el-input v-model="receive.district" disabled></el-input>
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
          drug: [] // 药品信息
        }
      ],
      receive: {},
      send: {},
      token: "",
      type: ""
    };
  },
  created() {
    this.token = window.sessionStorage.getItem("token");
    this.edit_id = window.sessionStorage.getItem("edit_id");
    this.getUpdate(); // 获取默认数据
    this.getStatus(); // 获取审核人
  },
  methods: {
    getUpdate() {
      this.$axios
        .post(
          this.URL_API + "/berry/public/index.php/init_order/update",
          {
            o_id: this.edit_id,
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
          let data = res.data.data;
          this.order_num = data.order_code;
          this.limit = data.time_limit;
          this.statusMan = data.check_order_admin;
          this.send = data.send_goods_address;
          this.receive = data.get_goods_address;
          this.drug_data = data.drug;
          this.isShow = true;

          this.drug_data.forEach(item => {
            if (item.is_thermometer == 1) {
              item.is_thermomete = "是";
            } else {
              item.is_thermomete = "否";
            }
          });
          this.send_id = data.send_goods_address.id;
          this.get_id = data.get_goods_address.id;
          this.ask_time = this.dateFormat(
            data.send_goods_time,
            "yyyy-mm-dd hh:ii:ss"
          );
        });
    },
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
            this.optionsStatus = res.data.data;
          }else if(res.data.code == 450){
            this.$message.success("登录时间过长，请重新登录");
            this.$router.push("/login");
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    add_drug() {
      let obj = {
        art_no: "", // 货号
        art_num: "", // 数量
        is_thermomete: "是", // 是否使用温度计
        drug: [] // 药品信息
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
              this.drug_data[index].drug = res.data.data;
            }else if(res.data.code == 450){
            this.$message.success("登录时间过长，请重新登录");
            this.$router.push("/login");
          } else {
              this.$message.error(res.data.message);
            }
          });
      }
    },
    get_send() {
      // 获取 发货信息 /berry/public/index.php/address/index
      let name = this.send.name;
      if (this.send.name == "") {
      } else {
        this.type = 1;
        this.$axios
          .post(
            this.URL_API + "/berry/public/index.php/address/index",
            {
              username: name,
              type: this.type,
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
              let data = res.data.data.data[0];
              this.send_id = data.id;
              // this.send.name = res.data.data[0].username;
              this.send.phone = data.phone;
              this.send.name = data.username;
              this.send.company = data.company;
              this.send.provice = data.province;
              this.send.city = data.city;
              this.send.area = data.district;
              this.send.address = data.address;
            }else if(res.data.code == 450){
            this.$message.success("登录时间过长，请重新登录");
            this.$router.push("/login");
          } else {
              this.$message.error(res.data.message);
            }
          });
      }
    },
    get_recive() {
      let name = this.receive.name;
      if (name == "") {
        this.receive = [];
      } else {
        this.type = 2;
        this.$axios
          .post(
            this.URL_API + "/berry/public/index.php/address/index",
            {
              username: name,
              type: this.type,
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
              let data = res.data.data.data[0];
              this.get_id = data.id;
              this.receive.phone = data.phone;
              //   this.receive.name = data.username;
              this.receive.company = data.company;
              this.receive.provice = data.province;
              this.receive.city = data.city;
              this.receive.area = data.district;
              this.receive.address = data.address;
            }else if(res.data.code == 450){
            this.$message.success("登录时间过长，请重新登录");
            this.$router.push("/login");
          } else {
              this.$message.error(res.data.message);
            }
          });
      }
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
        delete item.drug;
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
            o_id: this.edit_id, // 修改必传  添加无所谓
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
            this.$message.success("修改成功");
            this.$router.push("/initOrder");
          }else if(res.data.code == 450){
            this.$message.success("登录时间过长，请重新登录");
            this.$router.push("/login");
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    dateFormat: function(time, fmt = "yyyy-mm-dd hh:ii:ss") {
      time = parseInt(time) * 1000;
      let date = new Date(time);
      let year = date.getFullYear();
      let month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      let hours =
        date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      let minutes =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      let seconds =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      // 拼接
      switch (fmt) {
        case "yyyy-mm-dd hh:ii:ss":
          return (
            year +
            "-" +
            month +
            "-" +
            day +
            " " +
            hours +
            ":" +
            minutes +
            ":" +
            seconds
          );
          break;
        default:
          return year + "-" + month + "-" + day;
      }
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


