<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      background-color="#324157"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      unique-opened
      router
    >
      <template v-for="item in items">
        <template v-if="item.son">
          <el-submenu :index="item.controller" :key="item.controller">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.name }}</span>
            </template>
            <el-menu-item
              v-for="(subItem,i) in item.son"
              :key="i"
              :index="subItem.controller"
            >{{ subItem.name }}</el-menu-item>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.controller" :key="item.controller">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.name }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from "../common/bus";
export default {
  data() {
    return {
      collapse: false,
      items: []
      // items: [
      //   {
      //     icon: "el-icon-date",
      //     index: "1",
      //     title: "系统设置",
      //     subs: [
      //       {
      //         index: "form",
      //         title: "用户管理"
      //       },
      //       {
      //         index: "editor",
      //         title: "职务管理"
      //       },
      //       {
      //         index: "markdown",
      //         title: "权限管理"
      //       }
      //     ]
      //   }
      // ]
      // items: [
      //     {
      //         icon: 'el-icon-setting',
      //         index: 'dashboard',
      //         title: '系统首页'
      //     },
      //     {
      //         icon: 'el-icon-tickets',
      //         index: 'table',
      //         title: '基础表格'
      //     },
      //     {
      //         icon: 'el-icon-message',
      //         index: 'tabs',
      //         title: 'tab选项卡'
      //     },
      //     {
      //         icon: 'el-icon-date',
      //         index: '3',
      //         title: '表单相关',
      //         subs: [
      //             {
      //                 index: 'form',
      //                 title: '基本表单'
      //             },
      //             {
      //                 index: 'editor',
      //                 title: '富文本编辑器'
      //             },
      //             {
      //                 index: 'markdown',
      //                 title: 'markdown编辑器'
      //             },
      //             {
      //                 index: 'upload',
      //                 title: '文件上传'
      //             }
      //         ]
      //     },
      //     {
      //         icon: 'el-icon-star-on',
      //         index: 'charts',
      //         title: 'schart图表'
      //     },
      //     {
      //         icon: 'el-icon-rank',
      //         index: 'drag',
      //         title: '拖拽列表'
      //     },
      //     {
      //         icon: 'el-icon-warning',
      //         index: 'permission',
      //         title: '权限测试'
      //     },
      //     {
      //         icon: 'el-icon-error',
      //         index: '404',
      //         title: '404页面'
      //     }
      // ]
    };
  },
  beforeCreate(){
    let token = window.sessionStorage.getItem("token");
    
    this.$axios.post('http://www.zjcoldcloud.com/berry/public/index.php/index/getMenu',{token: token},{transformRequest:[
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
        ]},{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(res=>{

      // console.log(res.data);
      
      if(res.data.code == 0){
        this.items = res.data.data;
      }else if(res.data.code == 450){
            this.$message.success("登录时间过长，请重新登录");
            this.$router.push("/login");
          }

    }).catch(err=>{
      this.$message.error('服务器错误，请稍后再试');
    })
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace("/", "");
    }
  },
  created() {
    
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on("collapse", msg => {
      this.collapse = msg;
    });
  }
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 200px;
}
.sidebar > ul {
  height: 100%;
}
</style>
