<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 试剂列表
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-form :inline="true">
          <el-row type="flex" justify="space-between">
            <el-col :span="10">
              <el-button type="primary" @click="handleAdd()">添加</el-button>
              <el-button type="primary" @click="handleEdit()">修改</el-button>
              <el-button type="primary" @click="handleDelete()">删除</el-button>
            </el-col>
            <el-col >
              <el-form-item label="货号">
                <el-input v-model="art_no"></el-input>
              </el-form-item>
              <el-form-item label="型号">
                <el-input v-model="model"></el-input>
              </el-form-item>

              <el-button type="primary" icon="search" @click="getData">搜索</el-button>
            </el-col>
          </el-row>
        </el-form>

        <!-- <el-select v-model="select_cate" placeholder="筛选省份" class="handle-select mr10">
              <el-option key="1" label="广东省" value="广东省"></el-option>
              <el-option key="2" label="湖南省" value="湖南省"></el-option>
          </el-select>
        <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>-->
      </div>
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
        <el-table-column prop="standard" label="规格" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="danwei" label="单位" align="center"></el-table-column>
        <el-table-column prop="temperature" label="储运温度" align="center"></el-table-column>
        <el-table-column prop="support" label="保价金额" align="center"></el-table-column>
        <el-table-column prop="size" label="尺寸（长*宽*高）" align="center"></el-table-column>
        <el-table-column prop="placement_mode" label="放置方式" align="center" :show-overflow-tooltip="true"></el-table-column>
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

    <!-- 修改 弹框 -->
    <el-dialog :title="title" :visible.sync="editVisible" width="30%">
      <div class="handle-box">
        <el-form label-width="100px" :gutter="20">
          <el-col :span="10">
            <el-form-item label="货号">
              <el-input v-model="edit_art_no"></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </div>
      <div style="margin-top: 60px;">
        <ul>
          <li>
            <el-form label-width="100px" :model="form" :inline="true">
              <el-form-item label="型号">
                <el-input size="medium" v-model="form.model"></el-input>
              </el-form-item>
              <el-form-item label="保价金额">
                <el-col>
                  <el-input v-model="form.support"></el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="储运温度">
                <el-select placeholder="请选择" class="handle-select mr10" v-model="form.temperature">
                  <el-option label="请选择" value></el-option>
                  <el-option label="-25℃~-15℃" value="-25℃~-15℃"></el-option>
                  <el-option label="2℃~8℃" value="2℃~8℃"></el-option>
                  <el-option label="15℃~25℃" value="15℃~25℃"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="尺寸">
                <el-input v-model="form.size"></el-input>
              </el-form-item>
              <el-form-item label="品名">
                <el-input v-model="form.trade_name"></el-input>
              </el-form-item>
              <el-form-item label="放置方式">
                <el-input v-model="form.placement_mode"></el-input>
              </el-form-item>
              <el-form-item label="规格">
                <el-input v-model="form.standard"></el-input>
              </el-form-item>
            </el-form>
          </li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">返 回</el-button>
        <el-button type="primary" @click="saveEdit">提 交</el-button>
      </span>
    </el-dialog>
    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteRow">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      model: "",
      edit_art_no: "",
      art_no: "",
      select_cate: "",
      tableData: [],
      title: "添加用户",
      editVisible: false,
      delVisible: false,
      form: {
        model: "", // 型号
        trade_name: "", // 品名
        temperature: "", // 储存温度
        standard: "", // 规格
        support: "", // 保价金额
        placement_mode: "", // 放置方式
        size: "" // 尺寸
      },
      id: "",
      cur_page: 1,
      del_id: [],
      multipleSelection: [],
      ccc: 0,
      token: ""
    };
  },
  created() {
    this.token = window.sessionStorage.getItem("token");
    this.getData();
  },
  computed: {},
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
    },
    handleAdd() {
      this.$router.push("/addDrug");
    },
    getData() {
      // // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
      // if (process.env.NODE_ENV === 'development') {
      //     this.url = '/ms/table/list';
      // };
      this.$axios
        .post(this.URL_API + "/berry/public/index.php/drug/index", {
          page: this.cur_page,
          art_no: this.art_no,
          model: this.model,
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
    },
    handleEdit() {
      let len = this.multipleSelection;
      // 修改 试剂 默认获取数据
      if (len.length == 1) {
        this.id = len[0].d_id;
        this.$axios
          .post(this.URL_API + "/berry/public/index.php/drug/update", {
            d_id: this.id,
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
            let data = res.data;
            if (data.code == 0) {
              this.edit_art_no = data.data.art_no;
              this.form.model = data.data.model;
              this.form.trade_name = data.data.trade_name;
              this.form.temperature = data.data.temperature;
              this.form.standard = data.data.standard;
              this.form.support = data.data.support;
              this.form.placement_mode = data.data.placement_mode;
              this.form.size = data.data.size;

              this.title = "修改试剂";
              this.editVisible = true;
            }else if(res.data.code == 450){
            this.$message.success("登录时间过长，请重新登录");
            this.$router.push("/login");
          }
          });
      } else if (len.length == 0) {
        this.$message.error("请选择要修改的权限");
      } else {
        this.$message.error("请选择单个权限");
      }
    },
    //  修改试剂  提交
    saveEdit() {
      let webData = {
        d_id: this.id,
        token: this.token,

        model: this.form.model, // 型号
        art_no: this.edit_art_no,
        trade_name: this.form.trade_name, // 品名
        temperature: this.form.temperature, // 储存温度
        standard: this.form.standard, // 规格
        support: this.form.support, // 保价金额
        placement_mode: this.form.placement_mode, // 放置方式
        size: this.form.size // 尺寸
      };
      this.$axios
        .post(this.URL_API + "/berry/public/index.php/drug/updateDo", webData,
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
          // this.tableData = res.data.data;
          if (res.data.code == 0) {
            this.editVisible = false;
            this.$message.success("修改成功");
            this.getData();
          }else if(res.data.code == 450){
            this.$message.success("登录时间过长，请重新登录");
            this.$router.push("/login");
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    handleDelete() {
      // 删除 弹框 二次确认
      let len = this.multipleSelection;
      if (len.length == 0) {
        this.$message.error("请选择要删除的权限");
      } else {
        this.del_id = [];
        let len = this.multipleSelection;
        for (let i = 0; i < len.length; i++) {
          this.del_id.push(len[i].d_id);
        }
        this.delVisible = true;
      }
    },
    // 确定删除
    deleteRow() {
      this.$axios
        .post(this.URL_API + "/berry/public/index.php/drug/del", {
          id: this.del_id.join(","),
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
          let data = res.data;
          if (data.code == 0) {
            this.$message.success("删除成功");
            this.delVisible = false;
            this.getData();
          }else if(res.data.code == 450){
            this.$message.success("登录时间过长，请重新登录");
            this.$router.push("/login");
          }
        });
    }
  }
};
</script>
<style>
.el-table{
  color:#000;
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
ul li {
  list-style: none;
}
</style>
