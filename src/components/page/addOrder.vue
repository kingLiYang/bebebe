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
              <el-input v-model="ask_time"></el-input>
            </el-form-item>
            <el-form-item label="时限">
              <!-- <el-input v-model="limit"></el-input> -->
              <el-select placeholder="请选择" class="handle-select mr10" v-model="limit">
                <el-option label="请选择" value></el-option>
                <el-option label="-25℃~-15℃" value="-25℃~-15℃"></el-option>
                <el-option label="2℃~8℃" value="2℃~8℃"></el-option>
                <el-option label="15℃~25℃" value="15℃~25℃"></el-option>
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
              <el-select placeholder="请选择" class="handle-select mr10" v-model="ite.is_thermometer">
                <el-option label="请选择" value></el-option>
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
                <el-input size="medium" v-model="item.model"></el-input>
              </el-form-item>
              <el-form-item label="保价金额">
                <el-col>
                  <el-input v-model="item.support"></el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="储运温度">
                <el-select placeholder="请选择" class="handle-select mr10" v-model="item.temperature">
                  <el-option label="请选择" value></el-option>
                  <el-option label="-25℃~-15℃" value="-25℃~-15℃"></el-option>
                  <el-option label="2℃~8℃" value="2℃~8℃"></el-option>
                  <el-option label="15℃~25℃" value="15℃~25℃"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="尺寸">
                <el-input v-model="item.size"></el-input>
              </el-form-item>
              <el-form-item label="品名">
                <el-input v-model="item.trade_name"></el-input>
              </el-form-item>
              <el-form-item label="放置方式">
                <el-input v-model="item.placement_mode"></el-input>
              </el-form-item>
              <el-form-item label="规格">
                <el-input v-model="item.standard"></el-input>
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
              <el-input size="medium" @blur="get_send()" v-model="send.name"></el-input>
            </el-form-item>
            <el-form-item label="联系电话">
              <el-input v-model="send.phone" disabled></el-input>
            </el-form-item>
            <el-form-item label="发货公司">
              <el-input v-model="send.company" disabled></el-input>
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
              <el-input size="medium" v-model="receive.name" @blur="get_recive"></el-input>
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
      isShow: false,
      drug_data: [
        {
          art_no: "", // 货号
          art_num: "", // 数量
          is_thermometer: "", // 是否使用温度计
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
      type: ""
    };
  },
  created() {
    this.token = window.sessionStorage.getItem("token");
  },
  methods: {
    add_drug() {
      let obj = {
        art_no: "", // 货号
        art_num: "", // 数量
        is_thermometer: "", // 是否使用温度计
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
              // this.send.name = res.data.data[0].username;
              this.send.phone = data.phone;
              this.send.name = data.username;
              this.send.company = data.company;
              this.send.provice = data.province;
              this.send.city = data.city;
              this.send.area = data.district;
              this.send.address = data.address;
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

			  this.receive.phone = data.phone;
            //   this.receive.name = data.username;
              this.receive.company = data.company;
              this.receive.provice = data.province;
              this.receive.city = data.city;
              this.receive.area = data.district;
              this.receive.address = data.address;
            } else {
              this.$message.error(res.data.message);
            }
          });
      }
    },
    addReturn() {
      this.$router.push("/drug");
    },
    addCommit() {
      this.$axios
        .post(
          this.URL_API + "/berry/public/index.php/drug/add",
          {
            order_code: data, // 订单号
            send_goods_time:"", // 发货时间
            time_limit:"", // 时限
            check_order_admin:"", // 审核人员
            support_value:"", // 保价金额
            send_goods_address: "", // 发货地址id
            get_goods_address:"", // 收货地址id
            goods:"", // 货号信息  数组
            o_id:"", // 修改必传  添加无所谓
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
            this.$message.success("添加成功");
            this.$router.push("/drug");
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


