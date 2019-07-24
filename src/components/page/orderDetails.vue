<template>
  <div>
    <div class="crumbs">
      <el-row :gutter="20">
        <el-col>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>
              <i class="el-icon-tickets"></i> 订单详情
            </el-breadcrumb-item>
          </el-breadcrumb>
        </el-col>
        <el-col style="display:flex;flex-flow: wrap;margin-top:10px;">
          <div style="margin: 0 10px 0 0;">
            <span style="color:blue;">订单号：</span>
            {{order_code}}
          </div>
          <div>
            <span style="color:blue;">保价金额：</span>
            {{support_value}}
          </div>
          <div style="margin: 0 10px;">
            <span style="color:blue;">发货时间：</span>
            {{sendTime}}
          </div>
          <div style="margin: 0 10px 0 0;">
            <span style="color:blue;">时限：</span>
            {{limit}}
          </div>
          <div>
            <span style="color:blue;">审核状态：</span>
            {{status}}
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="container">
      <h4 style="padding: 0 0 10px 0;">订单信息</h4>
      <el-collapse v-model="activeNames">
        <el-collapse-item
          :title="item.title"
          :name="index"
          v-for="(item,index) in drugmsg"
          :key="index"
        >
          <el-row>
            <table>
              <tr>
                <th>型号</th>
                <th>品名</th>
                <th>规格</th>
                <th>储运温度</th>
                <th>尺寸</th>
                <th>放置方式</th>
                <th>保价金额</th>
              </tr>
              <tr v-for="(item,index) in item.drug_list" :key="index">
                <td>{{item.model}}</td>
                <td :title="item.trade_name">{{item.trade_name.length>2 ? item.trade_name.substr(0,3)+'...' : item.trade_name}}</td>
                <td :title="item.standard">{{item.standard.length>6 ? item.standard.substr(0,7)+'...' : item.standard}}</td>
                <td>{{item.temperature}}</td>
                <td>{{item.size}}</td>
                <td>{{item.placement_mode}}</td>
                <td>{{item.support}}</td>
              </tr>
            </table>
  
          </el-row>
        </el-collapse-item>
      </el-collapse>
      <div>
        <h4 style="padding: 10px 0;">货物信息</h4>
        <el-row v-model="sendData">
            <table>
              <tr>
                <th>发货人</th>
                <th>联系电话</th>
                <th>发货公司</th>
                <th>发货地址</th>
              </tr>
              <tr>
                <td>{{sendData.username}}</td>
                <td>{{sendData.phone}}</td>
                <td :title="sendData.company">{{sendData.company.length>6 ? sendData.company.substr(0,7)+'...' : sendData.company}}</td>
                <td :title="sendData.province+sendData.city+sendData.district+sendData.address">{{(sendData.province+sendData.city+sendData.district+sendData.address).substr(0,7)}}...</td>
              </tr>
            </table>
        </el-row>
        <el-row v-model="getDatamsg">
          <table style="margin-top:10px;">
            <tr>
                <th>收货人</th>
                <th>联系电话</th>
                <th>收货公司</th>
                <th>收货地址</th>
            </tr>
              <tr>
                <td>{{getDatamsg.username}}</td>
                <td>{{getDatamsg.phone}}</td>
                <td :title="getDatamsg.company">{{getDatamsg.company.length>6 ? getDatamsg.company.substr(0,7)+'...' : getDatamsg.company}}</td>
                <td :title="getDatamsg.province+getDatamsg.city+getDatamsg.district+getDatamsg.address">{{(getDatamsg.province+getDatamsg.city+getDatamsg.district+getDatamsg.address).substr(0,7)}}...</td>
              </tr>
          </table>
        </el-row>
      </div>
        <el-form  >
          <el-form-item label="备注">
            <el-input type="textarea" v-model="remark" disabled></el-input>
          </el-form-item>
        </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      remark:"",
      activeNames: [],
      id: "",
      token: "",
      order_code: "",
      oneTitle: "",
      drugmsg: [],
      sendData: {},
      support_value: "",
      limit: "",
      sendTime: "",
      status: "",
      getDatamsg: ""
    };
  },
  created() {
    this.id = window.sessionStorage.getItem("details_id");
    this.token = window.sessionStorage.getItem("token");
    this.getData();
  },
  methods: {
    getData() {
      this.$axios
        .post(
          this.URL_API + "/berry/public/index.php/init_order/update",
          {
            o_id: this.id,
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
          this.order_code = data.order_code;
          this.limit = data.time_limit;
          this.getDatamsg = data.get_goods_address;
          this.sendTime = this.dateFormat(
            data.send_goods_time,
            "yyyy-mm-dd hh:ii:ss"
          );
          this.sendData = data.send_goods_address;
          this.support_value = data.support_value;
          this.remark = data.remark;

          switch (data.status) {
            case 0:
              this.status = "待审核";
              break;
            case 1:
              this.status = "通过";
              break;
            case 2:
              this.status = "驳回";
              break;
            case 3:
              this.status = "完成";
              break;
          }
          this.drugmsg = data.drug;
          this.drugmsg.forEach(item => {
            let istem = "";
            if (item.is_thermometer == 0) {
              istem = "否";
            } else {
              istem = "是";
            }
            item.title =
              "货号：" +
              item.art_no +
              "\xa0\xa0\xa0" +
              "数量：" +
              item.art_num +
              " \xa0\xa0\xa0温度计使用：" +
              istem;
          });
        });
    },
    //     formatterAddTime(row, column) {
    //     return this.dateFormat(row.add_time,'yyyy-mm-dd');
    // },
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
.el-collapse-item__header {
  background: rgba(0, 0, 0, 0.2);
}
.el-collapse-item__content{
  padding-bottom: 10px;
}
</style>

<style scoped>
td,
th {
  border: solid #ccc;
  border-width: 0px 1px 1px 0px;
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


