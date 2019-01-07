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
        <el-col style="display:flex;" :offset="11">
          <div style="margin: 0 20px 0 0;"><span style="color:blue;">订单号：</span>{{order_code}}</div>
          <div><span style="color:blue;">保价金额：</span>{{support_value}}</div>
          <div style="margin: 0 20px;"><span style="color:blue;">发货时间：</span>{{sendTime}}</div>
          <div style="margin: 0 20px 0 0;"><span style="color:blue;">时限：</span>{{limit}}</div>
          <div><span style="color:blue;">审核状态：</span>{{status}}</div>
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
            <table v-for="(item,index) in item.drug" :key="index">
              <tr>
                <td rowspan="4" style="background: rgb(32, 160, 255);color:#fff;">药品信息</td>
                <td class="table_td">型号</td>
                <td>{{item.model}}</td>
                <td class="table_td">品名</td>
                <td>{{item.trade_name}}</td>
              </tr>
              <tr>
				 
				  <td class="table_td">规格</td>
				  <td>{{item.standard}}</td>
				  <td class="table_td">储运温度</td>
				  <td>{{item.temperature}}</td>
			  </tr>
			  <tr>
				
				  <td class="table_td">尺寸</td>
				  <td>{{item.size}}</td>
				  <td class="table_td">放置方式</td>
				  <td>{{item.placement_mode}}</td>
			  </tr>
				<tr>
			
					<td class="table_td">保价金额</td>
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
                <td rowspan="2" style="background: rgb(32, 160, 255);color:#fff;">发货信息</td>
                <td class="table_td">发货人</td>
                <td>{{sendData.username}}</td>
                <td class="table_td">联系电话</td>
                <td>{{sendData.phone}}</td>
              </tr>

			  <tr>
				
				  <td class="table_td">发货公司</td>
				  <td>{{sendData.company}}</td>
				  <td class="table_td">发货地址</td>
				  <td>{{sendData.province+sendData.city+sendData.district+sendData.address}}</td>
			  </tr>
            </table>
        </el-row>
                <el-row v-model="getDatamsg">
              <table>
              <tr>
                <td rowspan="2" style="background: rgb(32, 160, 255);color:#fff;">收货信息</td>
                <td class="table_td">收货人</td>
                <td>{{getDatamsg.username}}</td>
                <td class="table_td">联系电话</td>
                <td>{{getDatamsg.phone}}</td>
              </tr>

			  <tr>
				
				  <td class="table_td">收货公司</td>
				  <td>{{getDatamsg.company}}</td>
				  <td class="table_td">收货地址</td>
				  <td>{{getDatamsg.province+getDatamsg.city+getDatamsg.district+getDatamsg.address}}</td>
			  </tr>
            </table>
        </el-row>

      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeNames: [],
      id: "",
      token: "",
      order_code: "",
      oneTitle: "",
      drugmsg: [],
      sendData:{},
      support_value:"",
      limit:"",
      sendTime:"",
      status:"",
      getDatamsg:""
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
          this.sendTime = this.dateFormat(data.send_goods_time,'yyyy-mm-dd hh:ii:ss');
          this.sendData = data.send_goods_address;
          this.support_value = data.support_value;
          
          switch (data.status) {
            case 0 :
            this.status = "待审核";
            break;
            case 1 :
            this.status = "通过";
            break;
            case 2 :
            this.status = "驳回";
            break;
            case 3 :
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
dateFormat:function(time,fmt = 'yyyy-mm-dd hh:ii:ss') {
    time = parseInt(time)*1000;
    let date=new Date(time);
    let year=date.getFullYear();
    let month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
    let day=date.getDate()<10 ? "0"+date.getDate() : date.getDate();
    let hours=date.getHours()<10 ? "0"+date.getHours() : date.getHours();
    let minutes=date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
    let seconds=date.getSeconds()<10 ? "0"+date.getSeconds() : date.getSeconds();
    // 拼接
    switch (fmt) {
        case 'yyyy-mm-dd hh:ii:ss':
            return year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds;
            break;
        default :
            return year+"-"+month+"-"+day;
    }
}

  }
};
</script>
<style>
.el-collapse-item__header{
  background: rgba(0,0,0,0.2)
}
</style>

<style scoped>
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
  margin: 0 0 20px 0;
}
.table_td {
  background-color: #eff4f6;
}
</style>


