<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 地址列表
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-form :inline="true">
          <el-row type="flex" justify="space-between">
            <el-col :span="10">
              <el-button type="primary" @click="handleAdd()">添加</el-button>
              <el-button size="small" type="primary" @click="handleEdit()">修改</el-button>
              <el-button size="small" type="danger" @click="handleDel()">删除</el-button>
              <el-button type="primary" @click="is_export()">导出</el-button>
            </el-col>
            <el-col style="display:flex;flex-flow:wrap;">
              <el-form-item label="姓名">
                <el-input v-model="username" size="mini" style="width:120px;"></el-input>
              </el-form-item>
              <el-form-item label="所属公司">
                <el-input v-model="company" size="mini" style="width:120px;"></el-input>
              </el-form-item>
              <el-form-item label="地址类型">
                <el-select v-model="type" placeholder="请选择" class="handle-select mr10">
                  <el-option label="请选择" value></el-option>
                  <el-option label="发件地址" value="1"></el-option>
                  <el-option label="收件地址" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-button type="primary" @click="getData" style="height:31px;">查询</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        ref="multipleTable"
        max-height="400"
        @selection-change="handleSelectionChange"
        v-loading="loading"
      >
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column type="index" width="50" label="序号" align="center" fixed></el-table-column>
        <el-table-column prop="username" label="姓名" align="center"></el-table-column>

        <el-table-column prop="phone" label="联系电话" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="type" label="地址类型" align="center" :formatter="timesta"></el-table-column>
        <el-table-column prop="province" label="省份" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="city" label="城市" align="center"></el-table-column>
        <el-table-column prop="district" label="区" align="center"></el-table-column>
        <el-table-column prop="company" label="公司" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="address" label="详细地址" align="center" :show-overflow-tooltip="true"></el-table-column>
      </el-table>
      <div class="pagination">
        <!-- <el-pagination
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :page-size="10"
          :total="ccc"
        ></el-pagination>-->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[50, 100, 500, 2000]"
          :page-size="50"
          layout="total, sizes, prev, pager, next, jumper"
          :total="ccc"
        ></el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog :title="title" :visible.sync="editVisible">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="地址类型">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option label="请选择" value></el-option>
            <el-option label="发件地址" value="1"></el-option>
            <el-option label="收件地址" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.username" @input="testName(form.username)"></el-input>
          <span style="color:red;position:absolute;width:100px;top:26px;" v-if="isName">格式输入有误！</span>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="form.phone" @input="testPhone(form.phone)"></el-input>
          <span style="color:red;position:absolute;width:100px;top:26px;" v-if="isPhone">格式输入有误！</span>
        </el-form-item>
        <el-form-item label="所属公司">
          <el-input v-model="form.company" @input="testCom(form.company)"></el-input>
          <span style="color:red;position:absolute;width:100px;top:26px;" v-if="isCom">格式输入有误！</span>
        </el-form-item>
        <el-form-item label="省/市/区">
          <el-cascader
            v-model="val"
            :options="areaOptions"
            @change="handleItemChange"
            :separator="' '"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">返 回</el-button>
        <el-button type="primary" @click="saveEdit">提 交</el-button>
      </span>
    </el-dialog>

    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" center>
      <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteRow">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import areaOptions from "static/area.js";
export default {
  data() {
    return {
      isName: false,
      isPhone: false,
      isCom: false,
      isCommit: true,
      loading: true,
      areaOptions: areaOptions,
      val: [], // 选中的省市区
      username: "",
      company: "",
      type: "",
      tableData: [],
      optionsZhan: [], // 用户添加所需的职务
      title: "添加地址",
      editVisible: false,
      delVisible: false,
      form: {
        username: "",
        phone: "",
        company: "",
        type: "",
        address: ""
      },
      id: "",
      del_id: [],
      defaultProps: {
        children: "son",
        label: "name"
      },
      cur_page: 1,
      limit: 50,
      data2: [],
      data3: [],
      ccc: 0,
      token: "",
      multipleSelection: []
    };
  },
  created() {
    this.token = window.sessionStorage.getItem("token");
    this.getData();
  },
  methods: {
    handleSelectionChange(val) {
      // 选中的  当前条 数据
      this.multipleSelection = val;
    },
    handleItemChange(val) {
      // 省市区
      this.val = val;
    },
    // 分页导航
    handleCurrentChange(val) {
      this.loading = true;
      this.cur_page = val;
      this.getData();
    },
    handleSizeChange(val) {
      this.loading = true;
      // console.log(val); // 每页显示  条数
      this.limit = val;
      this.getData();
    },
    getData() {
      // // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
      // if (process.env.NODE_ENV === 'development') {
      //     this.url = '/ms/table/list';
      // };
      this.$axios
        .post(
          this.URL_API + "/berry/public/index.php/address/index",
          {
            page: this.cur_page,
            limit: this.limit,
            username: this.username,
            company: this.company,
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
            this.tableData = res.data.data.data;
            this.ccc = res.data.data.count;
            this.loading = false;
          } else if (res.data.code == 450) {
            this.$message.success("登录时间过长，请重新登录");
            this.$router.push("/login");
          }
        });
    },
    timesta(row, column) {
      return row.type == 1 ? "发件地址" : "收件地址";
    },
    handleAdd() {
      this.title = "添加地址";
      this.form.username = "";
      this.form.phone = "";
      this.val = [];
      this.form.company = "";
      this.form.type = "";
      this.form.address = "";
      this.editVisible = true;
    },
    // 添加地址  提交   修改地址  提交
    saveEdit() {
      // console.log(this.isName,this.isPhone,this.isCom);return;
      if (this.isName == false && this.isPhone == false && this.isCom == false) {
        let id = "";
        let type = "";
        if (this.title == "修改地址") {
          id = this.id;
        } else {
          id = "";
        }
        if (this.form.type == "发件地址") {
          type = 1;
        } else if (this.form.type == "收件地址") {
          type = 2;
        } else {
          type = this.form.type;
        }
        if (this.val == "") {
          this.val = ["", "", ""];
        }
        let webData = {
          company: this.form.company,
          username: this.form.username,
          phone: this.form.phone,
          type: type,
          address: this.form.address,
          province: this.val[0],
          city: this.val[1],
          district: this.val[2],
          id: id,
          token: this.token
        };
        this.$axios
          .post(this.URL_API + "/berry/public/index.php/address/add", webData, {
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
              if (this.title == "修改地址") {
                this.$message.success("修改成功");
              } else {
                this.$message.success("添加成功");
              }
              this.getData();
            } else if (res.data.code == 450) {
              this.$message.success("登录时间过长，请重新登录");
              this.$router.push("/login");
            } else {
              this.$message.error(res.data.message);
            }
          });
      }else{
        this.$message.error("信息格式有误！")
      }
    },
    handleEdit() {
      let len = this.multipleSelection;

      if (len.length == 1) {
        this.id = len[0].id;
        // 修改 地址 默认获取数据
        this.$axios
          .post(
            this.URL_API + "/berry/public/index.php/address/update",
            {
              id: this.id,
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
            let data = res.data;
            if (data.code == 0) {
              this.form.company = data.data.company;
              this.form.username = data.data.username;
              this.form.phone = data.data.phone;
              this.form.type = data.data.type == 1 ? "发件地址" : "收件地址";
              this.form.address = data.data.address;
              this.val = [
                data.data.province,
                data.data.city,
                data.data.district
              ];
              this.title = "修改地址";
              this.editVisible = true;
            } else if (res.data.code == 450) {
              this.$message.success("登录时间过长，请重新登录");
              this.$router.push("/login");
            }
          });
      } else if (len.length == 0) {
        this.$message.error("请选择要修改的地址");
      } else {
        this.$message.error("请选择单个地址");
      }
      //   this.id = row.id;
    },
    handleDel() {
      // 删除 弹框 二次确认
      let len = this.multipleSelection;
      if (len.length == 0) {
        this.$message.error("请选择要删除的权限");
      } else {
        this.del_id = [];
        let len = this.multipleSelection;
        for (let i = 0; i < len.length; i++) {
          this.del_id.push(len[i].id);
        }
        this.delVisible = true;
      }
    },
    // 确定删除
    deleteRow() {
      this.$axios
        .post(
          this.URL_API + "/berry/public/index.php/address/del",
          {
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
          }
        )
        .then(res => {
          let data = res.data;
          if (data.code == 0) {
            this.$message.success("删除成功");
            this.delVisible = false;
            this.getData();
          } else if (res.data.code == 450) {
            this.$message.success("登录时间过长，请重新登录");
            this.$router.push("/login");
          }
        });
    },
    // 正则检查
    testName(name) {
      this.checkEmail(this.checkName(name, 1));
    },
    testPhone(phone) {
      this.checkEmail(this.checkName(phone, 2));
    },
    testCom(com) {
      this.checkEmail(this.checkName(com, 3));
    },
    checkName(bbb, a) {
      let reg = /^([\u4e00-\u9fa5]){2,4}$/; //只能是中文，长度为2-7位  姓名
      let regPhone = /^\d+$/; // 匹配电话号码
      let regCom = /^[\u4e00-\u9fa5]+$/; // 匹配 汉字 [\u4e00-\u9fa5]
      if (a == 1) {
        if (reg.test(bbb)) {
          this.isName = false;
        } else {
          this.isName = true;
        }
      } else if (a == 2) {
        if (regPhone.test(bbb)) {
          this.isPhone = false;
        } else {
          this.isPhone = true;
        }
      } else if (a == 3) {
        if (regCom.test(bbb)) {
          this.isCom = false;
        } else {
          this.isCom = true;
        }
      }
    },
    // 防抖  输入优化
    checkEmail(aaa) {
      let timer = null;
      return function() {
        clearTimeout(timer);
        var that = this,
          args = arguments;
        timer = setTimeout(function() {
          aaa.apply(that, args);
        }, 1000);
      };
    },
        // 导出
    is_export() {
      // 导出
      this.loading = true;
      new Promise((resolve, reject) => {
      this.$axios
        .post(
          this.URL_API + "/berry/public/index.php/address/index",
          {
            limit: 100000,
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
            resolve(res.data.data.data);
          } else if (res.data.code == 450) {
            this.$message.success("登录时间过长，请重新登录");
            this.$router.push("/login");
          }
        });
      
      }).then((res) => {

        require.ensure([], () => {
          const { export_json_to_excel } = require("../../js/Export2Excel");
          const tHeader = [
            "姓名",
            "联系电话",
            "地址类型",
            "省份",
            "城市",
            "区",
            "公司",
            "详细地址",
          ];
          const filterVal = [
            "username",
            "phone",
            "type",
            "province",
            "city",
            "district",
            "company",
            "address",
          ];
          
          const list = res;
          this.loading = false;
          list.forEach((item => {
            item.type = item.type == 1 ? '发件地址' : '收件地址';
          }))
          const data = this.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, "地址信息列表");
        });
      });

      return;
    },
    formatJson: function(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    }
  }
};
</script>
<style>
.el-table {
  color: #000;
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
</style>
