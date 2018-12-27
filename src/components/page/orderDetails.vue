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
        <el-col :offset="20">
          <div>订单号：{{order_code}}</div>
        </el-col>
      </el-row>
    </div>
    <div class="container">
      <el-collapse v-model="activeNames">
        <el-collapse-item
          :title="item.title"
          :name="index"
          v-for="(item,index) in drugmsg"
          :key="index"
        >
          <el-table :data="tableData" style="width: 100%">
            <el-table-column type="index" :index="indexMethod"></el-table-column>
            <el-table-column prop="date" label="日期" width="180"></el-table-column>
            <el-table-column prop="name" label="姓名" width="180"></el-table-column>
            <el-table-column prop="address" label="地址"></el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeNames: [0],
      id: "",
      token: "",
      order_code: "",
      oneTitle: "",
      drugmsg: []
    };
  },
  created() {
    this.id = this.$route.query.id;
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
    }
  }
};
</script>
<style scoped>
</style>


