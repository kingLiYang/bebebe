<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <div class="collapse-btn" @click="collapseChage">
      <i class="el-icon-menu"></i>
    </div>
    <div class="logo">贝瑞基因冷链物流系统管理平台</div>
    <div class="header-right">
      <div class="header-user-con">
        <!-- 全屏显示 -->
        <div class="btn-fullscreen" @click="handleFullScreen">
          <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
            <i class="el-icon-rank"></i>
          </el-tooltip>
        </div>
        <!-- 消息中心 -->
        <div class="btn-bell">
          <el-tooltip effect="dark" :content="message?`有${message}条未读消息`:`消息中心`" placement="bottom">
            <router-link to="/tabs">
              <i class="el-icon-bell"></i>
            </router-link>
          </el-tooltip>
          <span class="btn-bell-badge" v-if="message"></span>
        </div>
        <!-- 用户头像 -->
        <div class="user-avator">
          <img src="static/img/img.jpg">
        </div>
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name" trigger="click">
          <span class="el-dropdown-link">
            {{username}}
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <!-- <a href="http://blog.gdfengshuo.com/about/" target="_blank">
                            <el-dropdown-item>关于作者</el-dropdown-item>
            </a>-->
            <a>
              <el-dropdown-item @click.native=" checkVisible = true">修改密码</el-dropdown-item>
            </a>
            <el-dropdown-item divided @click.native="handleCommand">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span>{{zhiwu}}</span>
      </div>
    </div>
    <!-- 修改密码 弹框 -->
    <el-dialog title="修改密码" ref="content" :visible.sync="checkVisible" width="30%">
      <el-form :inline="true" label-width="100px">
        <el-form-item label="新密码">
          <el-input type="password" v-model="pwdone" style="width: 300px;" @blur="newpwd" placeholder="密码格式为6-18为的字母数字符号组合"></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input type="password" v-model="pwdtwo" style="width: 300px;" @blur="oldpwd"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="check_remark()">提交</el-button>
        <el-button  @click="checkVisible = false">返回</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import bus from "../common/bus";
export default {
  data() {
    return {
        pwdone:"",
        pwdtwo:"",
        isCommit: false,
      collapse: false,
      fullscreen: false,
      checkVisible: false,
      name: "linxin",
      message: 2,
      zhiwu: ""
    };
  },
  computed: {
    username() {
      this.zhiwu = window.sessionStorage.getItem("role_name") =="null" ? '超级管理员' : window.sessionStorage.getItem("role_name");
      let username = sessionStorage.getItem("username");
      return username ? username : this.name;
    }
  },
  methods: {
      newpwd(){
          // 验证密码格式
          let reg = /^[0-9A-Za-z]{6,18}$/;
          if(this.pwdone != ""){
            if(!reg.test(this.pwdone)){
                this.isCommit = false;
                this.$message.error("密码格式有误!");
                this.$refs.content.$el.getElementsByTagName("input")[0].focus();
            }
          }else{
              this.isCommit = false;
              this.$message.error("请输入密码!");
              this.$refs.content.$el.getElementsByTagName("input")[0].focus();
          }

      },
      oldpwd(){
          // 二次确认
          if(this.pwdone == this.pwdtwo){
            this.isCommit = true;
          }else{
              this.isCommit = false;
              this.$message.error("两次密码输入不一致!");
             
          }
      },
    check_remark(){
        // 修改密码  提交
        if(this.isCommit){
      let token = sessionStorage.getItem("token");
      this.$axios
        .post(
          "http://www.zjcoldcloud.com/berry/public/index.php/user/check_pwd",
          { token: token ,pwd: this.pwdone},
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
            this.$message.success("修改成功");
            this.$router.push("/login");
          }else if(res.data.code == 450){
            this.$message.success("登录时间过长，请重新登录");
            this.$router.push("/login");
          }
        });

        }
    },
    // 用户名下拉菜单选择事件  退出登录
    handleCommand() {
      let token = sessionStorage.getItem("token");
      this.$axios
        .post(
          "http://www.zjcoldcloud.com/berry/public/index.php/login/logout",
          { token: token },
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
            window.sessionStorage.clear();
            this.$router.push("/login");
          }
        });
    },
    // 侧边栏折叠
    collapseChage() {
      this.collapse = !this.collapse;
      bus.$emit("collapse", this.collapse);
    },
    // 全屏事件
    handleFullScreen() {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    }
  }
};
</script>
<style scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: #fff;
}
.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 70px;
}
.header .logo {
  float: left;
  line-height: 70px;
}
.header-right {
  float: right;
  padding-right: 50px;
}
.header-user-con {
  display: flex;
  height: 70px;
  align-items: center;
}
.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}
.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}
.btn-bell .el-icon-bell {
  color: #fff;
}
.user-name {
  margin-left: 10px;
}
.user-avator {
  margin-left: 20px;
}
.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}
.el-dropdown-menu__item {
  text-align: center;
}
</style>
