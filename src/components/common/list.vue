<template>
  <div>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        v-loading="loading"
      >
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
        <el-table-column prop="art_no" label="货号" align="center"></el-table-column>

        <el-table-column prop="model" label="型号" align="center"></el-table-column>
        <el-table-column prop="trade_name" label="品名" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="standard" label="规格" align="center"></el-table-column>
        <el-table-column prop="danwei" label="单位" align="center"></el-table-column>
        <el-table-column prop="temperature" label="储运温度" align="center"></el-table-column>
        <el-table-column prop="support" label="报价金额" align="center"></el-table-column>
        <el-table-column prop="size" label="尺寸（长*宽*高）" align="center"></el-table-column>
        <el-table-column prop="placement_mode" label="放置方式" align="center"></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :page-size="10"
          :total="ccc"
        ></el-pagination>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
		tableData:[],
		ccc:1,
		loading:true,
    };
  },
  created() {
    this.token = window.sessionStorage.getItem("token");
    this.getData();
  },
  computed: {},
  methods: {
	  getData(){
		        this.$axios
        .post(this.URL_API + "/berry/public/index.php/drug/index", {
          page: 1,
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
          })
        .then(res => {
          if(res.data.code == 0){
          this.tableData = res.data.data.data;
          for (let i = 0; i < this.tableData.length; i++) {
            this.tableData[i].danwei = "盒";
          }
          this.ccc = res.data.data.count;
          this.loading = false;
          }else if(res.data.code == 450){
            this.$message.success("登录时间过长，请重新登录");
            this.$router.push("/login");
          }

        });
	  }
  }
};
</script>

<style scoped>

</style>
