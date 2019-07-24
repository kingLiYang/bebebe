<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i>
          {{title}}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="container">
      <div>
        <el-form label-width="80px" v-model="addData" :inline="true" style="padding:10px 0 0 0;">
          <el-row>
            <el-form-item label="开始城市">
              <el-input v-model="addData.start_city"></el-input>
            </el-form-item>
            <el-form-item label="目的城市">
              <el-input v-model="addData.end_city"></el-input>
            </el-form-item>
            <el-form-item label="时限">
              <el-input v-model="addData.time_limit"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="12L">
              <el-input v-model="addData.box_type4"></el-input>
            </el-form-item>
            <el-form-item label="28L">
              <el-input v-model="addData.box_type3"></el-input>
            </el-form-item>
            <el-form-item label="56L">
              <el-input v-model="addData.box_type2"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="97L">
              <el-input v-model="addData.box_type1"></el-input>
            </el-form-item>
            <el-form-item label="130L">
              <el-input v-model="addData.box_type5"></el-input>
            </el-form-item>
            <el-form-item label="审核人">
              <el-select placeholder="请选择" class="handle-select mr10" v-model="addData.auditor">
                <el-option label="请选择" value></el-option>
                <el-option label="-25℃~-15℃" value="-25℃~-15℃"></el-option>
                <el-option label="2℃~8℃" value="2℃~8℃"></el-option>
                <el-option label="15℃~25℃" value="15℃~25℃"></el-option>
              </el-select>
            </el-form-item>
          </el-row>
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
      title: "",
      art_no: "",
      isSubmit: false,
      isCommit: false,
      addData: [
        {
          start_city: "",
          end_city: "",
          time_limit: "",
          box_type4: "",
          box_type3: "",
          box_type2: "",
          box_type1: "",
          box_type5: "",
          auditor: ""
        }
      ],
      token: ""
    };
  },
  beforeCreate() {
    //   console.log(this.$route.query.sta)
  },
  created() {
    if (this.$route.query.sta == "修改") {
      
      this.title = "保价修改";
      this.$route.meta.title = '修改保价';
    }else{
		this.title = "保价添加";
		this.$route.meta.title = '添加保价';
	}
	this.token = window.sessionStorage.getItem("token");
	console.log(this.$route);
  },
  methods: {
    isSupport(aaa) {
      let reg = /^[0-9]*$/; // 只能数字
      if (reg.test(aaa)) {
        this.isCommit = true;
      } else {
        this.isCommit = false;
        this.$message.error("只能输入数字!");
      }
    },
    add_drug() {
      let obj = {
        art_no: this.art_no,
        model: "", // 型号
        trade_name: "", // 品名
        temperature: "", // 储存温度
        standard: "", // 规格
        support: "", // 保价金额
        placement_mode: "", // 放置方式
        size: "" // 尺寸
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
    addReturn() {
      this.$router.push("/insured");
    },
    chicun(aaa, index) {
      // 尺寸 正则
      let reg = /^((\d+\.\d+)|\d+)\*((\d+\.\d+)|\d+)\*((\d+\.\d+)|\d+)$/;
      if (aaa != "") {
        if (reg.test(aaa)) {
          this.isSubmit = true;
        } else {
          this.isSubmit = false;
          this.$message.error("尺寸格式有误，请重新输入");
          this.$refs.content[index].$el
            .getElementsByTagName("input")[0]
            .focus();
        }
      }
    },
    addCommit() {
      let data = this.drug_data;
      if (data.length == 1) {
        data[0]["art_no"] = this.art_no;
      } else {
        data.forEach((item, index) => {
          item.art_no = this.art_no;
        });
      }
      if (this.isSubmit && this.isCommit) {
        this.$axios
          .post(
            this.URL_API + "/berry/public/index.php/drug/add",
            {
              drug_data: JSON.stringify(data),
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
            } else if (res.data.code == 450) {
              this.$message.success("登录时间过长，请重新登录");
              this.$router.push("/login");
            } else {
              this.$message.error(res.data.message);
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.$message.error("信息有误");
      }
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
  width: 65%;
}
.drug_list li {
  border: 1px solid #ccc;
  border-radius: 10px;
  list-style-type: none;
  padding: 10px;
  margin: 30px 0;
}
</style>


