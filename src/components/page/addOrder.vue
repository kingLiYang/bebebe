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
        <el-form :inline="true" >
          <!-- <el-col> -->
            <el-form-item label="订单号">
              <el-input v-model="order_num"></el-input>
            </el-form-item>
            <el-form-item label="发货时间">
              <el-date-picker
                v-model="ask_time"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="选择日期时间"
                class="input-class"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="时限">
              <el-select placeholder="请选择" class="handle-select" style="width: 112px;" v-model="limit" disabled>
                <el-option label="请选择" value></el-option>
                <el-option label="12H" value="12H"></el-option>
                <el-option label="24H" value="24H"></el-option>
                <el-option label="36H" value="36H"></el-option>
                <el-option label="48H" value="48H"></el-option>
                <el-option label="72H" value="72H"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="审核人" v-if="isCheck">
              <el-select placeholder="请选择" class="handle-select" v-model="statusMan">
                <el-option label="请选择" value></el-option>
                <el-option
                  :label="item.relly_name"
                  :value="item.u_id"
                  v-for="(item,index) in optionsStatus"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          <!-- </el-col> -->
        </el-form>
      </div>
      <div
        style="border:1px solid #ccc;padding: 20px 20px 0 20px;"
        v-for="(ite,index) in drug_data"
        :key="index"

      >
    
          <el-form :inline="true">
            <el-form-item label="货号">
              <el-input
                v-model="ite.art_no"
                @blur="getDrug(ite.art_no,index)"
                @input="ifNull(ite.art_no,index)"
              ></el-input>
            </el-form-item>
            <el-form-item label="数量">
              <el-input v-model="ite.art_num" @input="art_blur(ite.art_num,index)"></el-input>
            </el-form-item>
            <el-form-item label="是否使用温度计">
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
      

        <table v-if="ite.isShow">
          <tr>
            <td>序列</td>
            <td>型号</td>
            <td>规格</td>
            <td>数量</td>
            <td>品名</td>
            <td>存储温度</td>
            <td>保价金额(元)</td>
            <td>尺寸</td>
            <td>放置方式</td>
          </tr>
          <tr v-for="(item,index) in ite.drug_list" :key="index">
            <td>{{index+1}}</td>
            <td
              :title="item.model"
            >{{item.model.length>7 ? item.model.substr(0,7)+'...' : item.model}}</td>
            <td
              :title="item.standard"
            >{{item.standard.length>7 ? item.standard.substr(0,7)+'...' : item.standard}}</td>
            <td>{{item.num}}</td>
            <td :title="item.trade_name">{{item.trade_name.substr(0,3)}}...</td>
            <td>{{item.temperature}}</td>
            <td>{{item.support}}</td>
            <td>{{item.size}}</td>
            <td
              :title="item.placement_mode"
            >{{item.placement_mode.length > 3 ? item.placement_mode.substr(0,3)+'...' : item.placement_mode}}</td>
          </tr>
        </table>
      </div>
      <!-- 发货信息   收货信息 -->
      <div style="border:1px solid #ccc;margin:20px 0;padding:20px;">
        <div>
          <span style="font-weight:800;">发货信息</span>
          <el-form :model="send" label-width="100px" :inline="true" style="padding:10px 0 0 0;">
            <el-form-item label="发货人">
              <el-select v-model="send.name" filterable placeholder="请选择" @change="handleSelect">
                <el-option
                  v-for="(item,index) in sendName"
                  :key="index"
                  :label="item.username"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发货公司">
              <el-select v-model="send.company" filterable placeholder="请选择" @change="handleSelect" class="select-class">
                <el-option
                  v-for="(item,index) in sendName"
                  :key="index"
                  :label="item.company"
                  :value="item.id"
                ></el-option>
              </el-select>
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
            <el-form-item label="详址" class="input-class-big">
              <el-input v-model="send.address" disabled></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div>
          <span style="font-weight:800;">收货信息</span>
          <el-form :model="receive" label-width="100px" :inline="true" style="padding:10px 0 0 0;">
            <el-form-item label="收货人">
              <el-select v-model="receive.name" filterable placeholder="请选择" @change='handleSelectreceive'>
                <el-option
                  v-for="(item,index) in receiveName"
                  :key="index"
                  :label="item.username"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="收货公司">
              <el-select v-model="receive.company" filterable placeholder="请选择" @change='handleSelectreceive' class="select-class">
                <el-option
                  v-for="(item,index) in receiveName"
                  :key="index"
                  :label="item.company"
                  :value="item.id"
                ></el-option>
              </el-select>
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
            <el-form-item label="详址" class="input-class-big">
              <el-input v-model="receive.address" disabled></el-input>
            </el-form-item>
          </el-form>
        </div>
        <el-form  label-width="100px" >
          <el-form-item label="备注">
            <el-input type="textarea" v-model="remark"></el-input>
          </el-form-item>
        </el-form>

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
      remark:"",
      order_num: "",
      ask_time: "",
      limit: "",
      statusMan: "", // 审核人
      optionsStatus: [],
      send_id: "",
      get_id: "",
      sendName: [], // 发货人 发货公司
      receiveName: [], // 收货人  收货公司
      // isShow: false,
      drug_data: [
        {
          isShow: false, // 显示 隐藏
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
      role_name: "",
      type: "",
      isCheck: true,
      restaurants: [] // 模糊查询
    };
  },
  created() {
    this.token = window.sessionStorage.getItem("token");
    this.role_name = window.sessionStorage.getItem("role_name");
    this.getStatus(); // 获取审核人
    this.querySearch(); // 获取发货人 发货公司
    this.querySearchreceive(); // 获取收货人 收货公司
    if (this.role_name == "运营专员") {
      this.isCheck = false;
    } else {
      this.isCheck = true;
    }
  },
  methods: {
    getStatus() {
      // 获取审核人
      this.$axios
        .post(
          this.URL_API + "/berry/public/index.php/index/get_check_user",
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
        isShow: false,
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
    ifNull(bbb, index) {
      // 货号改变 不显示 药品信息
      this.drug_data[index].isShow = false;
    },
    art_blur(ccc, index) {
      this.drug_data[index].drug_list.forEach(item => {
        item.num = ccc;
      });
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
              res.data.data.forEach(item => {
                item.num = this.drug_data[index].art_num;
              });

              this.drug_data[index].isShow = true;
              this.drug_data[index].drug_list = res.data.data;
            } else {
              this.$message.error(res.data.message);
            }
          });
      }
    },
    querySearch() {
      this.$axios
        .post(
          this.URL_API + "/berry/public/index.php/address/get_address",
          {
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
          if (res.data.code == 0) {
            this.sendName = res.data.data;
          } else if (res.data.code == 450) {
            this.$message.success("登录时间过长，请重新登录");
            this.$router.push("/login");
          }
        });
    },
    querySearchreceive(queryString, cb) {
      this.$axios
        .post(
          this.URL_API + "/berry/public/index.php/address/get_address",
          {
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
          // this.get_id = "";
          // this.receive.phone = "";
          // this.receive.company = "";
          // this.receive.provice = "";
          // this.receive.city = "";
          // this.receive.area = "";
          // this.receive.address = "";
          // this.limit = "";
          if (res.data.code == 0) {
            this.receiveName = res.data.data;
          } else if (res.data.code == 450) {
            this.$message.success("登录时间过长，请重新登录");
            this.$router.push("/login");
          }
        });
    },
    handleSelect(id) {
      // 选中 渲染数据
      this.sendName.forEach((item, index) => {
        if (item.id == id) {
          this.send_id = item.id;
          this.send.name = item.username;
          this.send.phone = item.phone;
          this.send.company = item.company;
          this.send.provice = item.province;
          this.send.city = item.city;
          this.send.area = item.district;
          this.send.address = item.address;
        }
      });
      if (this.receive.city != "") {
        this.getLimit();
      }
    },
    handleSelectreceive(id) {
      this.receiveName.forEach((item,index)=>{
        if(item.id == id){
      this.get_id = item.id;
      this.receive.name = item.username;
      this.receive.phone = item.phone;
      this.receive.company = item.company;
      this.receive.provice = item.province;
      this.receive.city = item.city;
      this.receive.area = item.district;
      this.receive.address = item.address;
        }
      })

      if (this.send.city != "") {
        this.getLimit();
      }
    },
    addReturn() {
      this.$router.push("/initOrder");
    },
    addCommit() {
      const Qs = require("qs");
      let arr1 = this.drug_data;
      let arr = [];
      arr1.forEach(it => {
        if (it.is_thermomete == "是") {
          it.is_thermometer = "1";
        } else {
          it.is_thermometer = it.is_thermomete;
        }
        let obj = {
          is_thermometer: it.is_thermometer,
          art_no: it.art_no,
          art_num: it.art_num
        };
        arr.push(obj);
      });

      this.$axios
        .post(
          this.URL_API + "/berry/public/index.php/init_order/add",
          {
            user_role: this.role_name, // 用户职位
            order_code: this.order_num, // 订单号
            send_goods_time: this.ask_time, // 发货时间
            time_limit: this.limit, // 时限
            check_order_admin: this.statusMan, // 审核人员
            send_goods_address: this.send_id, // 发货地址id
            get_goods_address: this.get_id, // 收货地址id
            goods: arr, // 货号信息  数组
            o_id: "", // 修改必传  添加无所谓
            remark: this.remark,
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
    },
    // 获取时限
    getLimit() {
      this.$axios
        .post(
          this.URL_API +
            "/berry/public/index.php/init_order/order_default_time",
          {
            start_city: this.send.city.substr(0, this.send.city.length - 1),
            end_city: this.receive.city.substr(0, this.receive.city.length - 1),
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
            this.limit = res.data.data.time_limit;
          } else if (res.data.code == 450) {
            this.$message.error("登录时间过长，请重新登录");
            this.$router.push("/login");
          } else {
            this.limit = '';
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
.el-form--inline .el-form-item{
  margin-right: 2px;
  
}
.input-class .el-input__inner{
  width:200px;
}
.select-class .el-input__inner{
  width: 300px;
}
.input-class-big .el-input__inner{
  width: 650px;
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
  padding: 5px 1px;
  text-align: center;
  font-size: 12px;
}

table {
  border: solid #ccc;
  border-width: 1px 0px 0px 1px;
  border-collapse: collapse;
  width: 100%;
  margin: 0 0 20px 0;
}
</style>


