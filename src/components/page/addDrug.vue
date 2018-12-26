<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 试剂添加
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="container">
      <div class="handle-box">
        <el-form label-width="100px" :gutter="20">
          <el-col :span="5" :pull="1">
            <el-form-item label="货号">
              <el-input v-model="art_no"></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </div>
      <div style="margin-top: 60px;">
        <ul class="drug_list">
          <li v-for="(item,index) in drug_data" :key="index">
            <div style="width:max-content;margin-top:-24px;background:#fff;padding:0 5px;">
              <span style="font-weight:800;">药品信息</span>
              <span @click="add_drug" style="color:blue;cursor:pointer;">添加</span>
              <span @click="del_drug(index)" style="color:blue;cursor:pointer;">删除</span>
            </div>
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
              <el-form-item label="放置方式">
                <el-input v-model="item.placement_mode"></el-input>
              </el-form-item>
              <el-form-item label="品名">
                <el-col style="width:180%;">
                  <el-input v-model="item.trade_name"></el-input>
                </el-col>
              </el-form-item>

              <el-form-item label="尺寸">
                <el-input
                  v-model="item.size"
                  @blur="chicun(item.size,index)"
                  ref="content"
                  placeholder="分隔符必须为*"
                ></el-input>
              </el-form-item>
              <el-form-item label="规格">
                <el-col style="width:180%;">
                  <el-input v-model="item.standard"></el-input>
                </el-col>
              </el-form-item>
            </el-form>
            <p
              style="font-size:12px;line-height:30px;color:#999;margin-top:-15px;padding-left:60px;"
            >Tips : 格式为5*8*8，分隔符必须为*，单位默认为mm</p>
          </li>
        </ul>
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
      art_no: "",
      isSubmit: false,
      drug_data: [
        {
          art_no: "", // 货号
          model: "", // 型号
          trade_name: "", // 品名
          temperature: "", // 储存温度
          standard: "", // 规格
          support: "", // 保价金额
          placement_mode: "", // 放置方式
          size: "" // 尺寸
        }
      ],
      token: ""
    };
  },
  created() {
    this.token = window.sessionStorage.getItem("token");
  },
  methods: {
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
      this.$router.push("/drug");
    },
    chicun(aaa,index) {
      // 尺寸 正则
      let reg = /^((\d+\.\d+)|\d+)\*((\d+\.\d+)|\d+)\*((\d+\.\d+)|\d+)$/;
      if (aaa != "") {
        if (reg.test(aaa)) {
          // console.log("true");
          this.isSubmit = true;
        } else {
          this.isSubmit = false;
          this.$message.error("尺寸格式有误，请重新输入");
          this.$refs.content[index].$el.getElementsByTagName("input")[0].focus();
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
      if(this.isSubmit){
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
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
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
  width: 60%;
}
.drug_list li {
  border: 1px solid #ccc;
  border-radius: 10px;
  list-style-type: none;
  padding: 10px;
  margin: 30px 0;
}
</style>


