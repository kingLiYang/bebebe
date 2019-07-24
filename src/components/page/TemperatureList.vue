<template>
  <div>
    <div class="crumbs">
      <el-row :gutter="20">
        <el-col>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>
              <i class="el-icon-tickets"></i> 温度监控
            </el-breadcrumb-item>
          </el-breadcrumb>
        </el-col>
        <el-col style="display:flex;padding: 40px 0px 0px 15px;">
          <div style="margin: 0 20px 0 0;">
            <span style="color:rebeccapurple; font-family: cursive;">运单号：{{temperature1}}</span>
          </div>
          <div style="margin: 0 20px;font-family: cursive;">
            <span style="color:rebeccapurple;font-family: cursive;">目的地：</span>
            {{StartCity}} - {{EndCity}}
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="container" style="min-height: 500px;">
      <h4 style="padding: 0 0 10px 0;color:gray;">物流冷链运输</h4>
      <div
        style="float: left;border: 2px solid green; border-radius: 5px;padding: 2px 20px;margin:20px;"
        v-for="(item,index) in temperature"
        :key="index"
        @click="TemperatureDetails(item)"
      >
        <div style="display: flex">
          <span
            style="color:rebeccapurple;text-align: center;line-height: 70px;padding: 0px 10px"
          >{{item}}</span>
          <img :src="item < 999999 ? 'static/img/wdzj.png' : 'static/img/wddx.png'" alt>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      temperature: "",
      token:''
    };
  },

  created() {
    // console.log(window.sessionStorage);
    this.token = window.sessionStorage.getItem("token");
    let data = JSON.parse(window.localStorage.getItem("data1"));
    // console.log(data);return
    this.StartCity = data.data.StartCity;
    this.EndCity = data.data.EndCity;
    this.temperature1 = data.data.BillNumber;
    this.temperature = data.data.SheBeiHao.split(",");
  },
  methods: {
    TemperatureDetails(item) {
      if(item < 999999) {
        let SheBeiHao = item,
          BillNumber = this.temperature1;
        window.localStorage.setItem("SheBeiHao", SheBeiHao);
        window.localStorage.setItem("BillNumber", BillNumber);
        this.$router.push({ path: "/TemperatureDetails" });
      }else{
        this.$axios.get('http://www.zjcoldcloud.com/berry/public/index.php/Init_way_bill/Elephant?BillNumber='+this.temperature1+'&SheBeiHao='+item+'&token='+this.token).then((res=>{
          if(res.data.code == 1){
            this.$message.error(res.data.message);
          }else if(res.data.code == 450){
            this.$message.error("登录时间过长，请重新登录");
            this.$router.push("/login");
          }else if(res.data.code == 0){
            // window.location.href = res.data.data;
            let SheBeiHao = item,
          BillNumber = this.temperature1;
        window.localStorage.setItem("SheBeiHao", SheBeiHao);
        window.localStorage.setItem("BillNumber", BillNumber);
            this.$router.push("/pdf");
          }
        }))
      }

    }
  },
  filters: {}
};
</script>
<style>
</style>

<style scoped>
</style>


