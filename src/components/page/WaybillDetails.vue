<template>
  <div>
    <div style="padding-bottom: 50px;">
      <el-col>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <i class="el-icon-tickets"></i> 运单详情
          </el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </div>
    <!--  <div v-if="showPrise">暂无数据</div>-->
    <div v-for="(item,index) in datailsWabill " :key="index" style="margin-bottom: 50px">
      <div class="crumbs">
        <el-row>
          <el-col style="display:flex;">
            <div style="margin: 0 20px 0 0;">
              <span style="color:blue;">tms订单号：</span>
              {{item.tms_order_code}}
            </div>
            <div style="margin: 0 20px 0 0;">
              <span style="color:blue;">订单号：</span>
              {{item.order_code}}
            </div>
            <div>
              <span style="color:blue;">保价金额：</span>
              {{item.support_value}}
            </div>
            <div style="margin: 0 20px;">
              <span style="color:blue;">发货时间：</span>
              {{item.send_goods_time}}
            </div>
            <div style="margin: 0 20px 0 0;">
              <span style="color:blue;">时限：</span>
              {{item.time_limit}}
            </div>
            <div>
              <span style="color:blue;">审核状态：</span>
              {{item.status}}
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-for="(item,index) in datailsbox" :key="index">
        <el-row>
          <el-col style="display:flex;">
            <div style="margin: 0 20px 0 0;">
              <span style="color:blue;">温度区间：</span>
              {{item.WDQJ}}
            </div>
            <div style="margin: 0 20px 0 0;">
              <span style="color:blue;">箱型：</span>
              {{item.PackageName}}
            </div>
            <div>
              <span style="color:blue;">件数：</span>
              {{item.Jian}}
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="container">
        <h4 style="padding: 0 0 10px 0;">订单信息</h4>
        <el-collapse v-model="activeNames">
          <el-collapse-item
            :title="'\xa0\xa0\xa0货号：'+K.art_no+'\xa0\xa0\xa0数量：'+K.art_num+'\xa0\xa0\xa0温度计使用：'+K.is_thermometer"
            :name="index"
            v-for="(K,index) in item.drug"
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
                <tr v-for="(item,index) in K.drug" :key="index">
                  <td>{{item.model}}</td>
                  <td :title="item.trade_name">{{item.trade_name.substr(0,3)}}...</td>
                  <td :title="item.standard">{{item.standard.substr(0,7)}}...</td>
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
          <el-row v-model="item.send_goods_address">
            <table>
              <tr>
                <th>发货人</th>
                <th>联系电话</th>
                <th>发货公司</th>
                <th>发货地址</th>
              </tr>
              <tr>
                <td>{{item.send_goods_address.username}}</td>
                <td>{{item.send_goods_address.phone}}</td>
                <td
                  :title="item.send_goods_address.company"
                >{{item.send_goods_address.company.substr(0,7)}}...</td>
                <td
                  :title="item.send_goods_address.province+item.send_goods_address.city+item.send_goods_address.district+item.send_goods_address.address"
                >{{(item.send_goods_address.province+item.send_goods_address.city+item.send_goods_address.district+item.send_goods_address.address).substr(0,7)}}...</td>
              </tr>
            </table>
          </el-row>
          <el-row v-model="item.get_goods_address">
            <table style="margin-top:10px;">
              <tr>
                <th>收货人</th>
                <th>联系电话</th>
                <th>收货公司</th>
                <th>收货地址</th>
              </tr>
              <tr>
                <td>{{item.get_goods_address.username}}</td>
                <td>{{item.get_goods_address.phone}}</td>
                <td
                  :title="item.get_goods_address.company"
                >{{item.get_goods_address.company.substr(0,7)}}...</td>
                <td
                  :title="item.get_goods_address.province+item.get_goods_address.city+item.get_goods_address.district+item.get_goods_address.address"
                >{{(item.get_goods_address.province+item.get_goods_address.city+item.get_goods_address.district+item.get_goods_address.address).substr(0,7)}}...</td>
              </tr>
            </table>
          </el-row>
        </div>
        <div v-if="isShow">
          <h4 style="padding: 10px 0;">签单图片</h4>
          <div class="isPhoto">
            <img
              :src="'http://59.110.61.154/ftp/'+BillNumber+'.jpg'"
              alt="暂无"
              @click="isHover($event)"
            >
            <img
              :src="'http://59.110.61.154/ftp/'+BillNumber+'-0.jpg'"
              alt="暂无"
              @click="isHover($event)"
            >
            <img
              :src="'http://59.110.61.154/ftp/'+BillNumber+'-1.jpg'"
              alt="暂无"
              @click="isHover($event)"
            >
            <img
              :src="'http://59.110.61.154/ftp/'+BillNumber+'-2.jpg'"
              alt="暂无"
              @click="isHover($event)"
            >
            <img
              :src="'http://59.110.61.154/ftp/'+BillNumber+'-3.jpg'"
              alt="暂无"
              @click="isHover($event)"
            >
          </div>
        </div>
      </div>
    </div>
    <!-- 图片弹框 -->
    <el-dialog title :visible.sync="centerDialogVisible" size="large" width="90%" center>
      <div style="display:flex;justify-content: center;cursor:pointer;">
        <img src="../../assets/tran.png" @click="changeImg()">
      </div>
      <div style="display:flex;justify-content: center;">
        <img
          :src="isSrc"
          alt
          :class="{imgRotate: isClass, imgRotate1 : isClass1,imgRotate2: isClass2,imgRotate3: isClass3,imgRotate4: isClass4}"
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeNames: [],
      datailsbox: [],
      detailsID: "",
      token: "",
      order_code: "",
      oneTitle: "",
      drugmsg: [],
      sendData: {},
      datailsWabill: [],
      support_value: "",
      limit: "",
      sendTime: "",
      status: "",
      getDatamsg: "",
      BillNumber: "",
      centerDialogVisible: false,
      isClass: true,
      isClass1: false,
      isClass2: false,
      isClass3: false,
      isClass4: false,
      isShow: true,
      isSrc: ""
      //showPrise: false,
    };
  },
  created() {
    this.token = window.sessionStorage.getItem("token");
    let status = window.localStorage.getItem("status");
    if (status == "签收完成" || status == "签收完成!") {
      this.isShow = true;
    } else {
      this.isShow = false;
    }
    this.getData();
  },
  methods: {
    isHasImg(pathImg) {
      var ImgObj = new Image();
      ImgObj.src = pathImg;
      if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {
        return true;
      } else {
        return false;
      }
    },
    isHover(e) {
      let src = e.currentTarget.getAttribute("src");
      if (this.isHasImg(src)) {
        this.isSrc = e.currentTarget.getAttribute("src");
        this.isClass = true;
        this.isClass1 = false;
        this.isClass2 = false;
        this.isClass3 = false;
        this.isClass4 = false;
        this.centerDialogVisible = true;
      }
    },
    changeImg() {
      // 点击 改变图片显示方向
      // this.isClass1 = true;
      if (this.isClass == true) {
        this.isClass = false;
        this.isClass1 = true;
      } else if (this.isClass1 == true) {
        this.isClass1 = false;
        this.isClass2 = true;
      } else if (this.isClass2 == true) {
        this.isClass2 = false;
        this.isClass3 = true;
      } else if (this.isClass3 == true) {
        this.isClass3 = false;
        this.isClass4 = true;
      } else if (this.isClass4 == true) {
        this.isClass4 = false;
        this.isClass1 = true;
      }
    },
    getData() {
      this.detailsID = JSON.parse(window.localStorage.getItem("detailsID"));

      this.$axios
        .post(
          this.URL_API + "/berry/public/index.php/init_way_bill/way_default",
          {
            o_id: this.detailsID,
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
            //this.showPrise = false
            this.datailsWabill = res.data.data.order;
            this.BillNumber = res.data.data.BillNumber;
            this.datailsbox = res.data.data.box;
            this.datailsWabill.forEach((item, index) => {
              item.send_goods_time = this.dateFormat(
                item.send_goods_time,
                "yyyy-mm-dd hh:ii:ss"
              );
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

              item.drug.forEach((item, index) => {
                if (item.is_thermometer == 0) {
                  item.is_thermometer = "否";
                } else {
                  item.is_thermometer = "是";
                }
              });
            });
          } else if (res.data.code == 1) {
            this.$message.error(res.data.message);
            this.$router.push({ path: "/InitWayBill" });
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
.el-collapse-item__header {
  background: rgba(0, 0, 0, 0.2);
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
.isPhoto {
  margin: 10px 0 0 0;
  display: flex;
  justify-content: flex-start;
  position: relative;
  flex-wrap: wrap;
}
.isPhoto img {
  /* width:100px; */
  height: 100px;
  margin: 0 50px 0 0;
}
.imgRotate {
  transform: rotate(0deg);
  width: 600px;
  height: 600px;
}
.imgRotate1 {
  transform: rotate(90deg);
  width: 600px;
  height: 600px;
}
.imgRotate2 {
  transform: rotate(180deg);
  width: 600px;
  height: 600px;
}
.imgRotate3 {
  transform: rotate(270deg);
  width: 600px;
  height: 600px;
}
.imgRotate4 {
  transform: rotate(360deg);
  width: 600px;
  height: 600px;
}
</style>


