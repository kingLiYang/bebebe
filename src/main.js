import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import ElementUI from 'element-ui';
import echarts from 'echarts'
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
import '../static/css/table.css'
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import "babel-polyfill";

Vue.use(ElementUI, { size: 'small' });
Vue.prototype.$axios = axios;
Vue.prototype.$echarts = echarts;
if (process.env.NODE_ENV !== 'development') {
    Vue.prototype.URL_API = 'http://www.zjcoldcloud.com';
  } else {
    Vue.prototype.URL_API = 'api/';
}




// 全局路由守护 路由跳转时  判断是否登录  路由拦截
router.beforeEach((to, from, next) => {
  // 已登录,直接进入目标页面
  let token = window.sessionStorage.getItem('token');
  if(token == ''|| token == undefined){
      if(to.path=='/login'){//如果是登录页面路径，就直接next()
          next();
        }else{//不然就跳转到登录；
          next('/login');
        }

  }else{
      next();
  }
})

// http response 拦截
// axios.interceptors.response.use(
//   response => {
//     console.log(response,111111);
//     if(response.data.code == 400){
//       alert("暂无权限，请联系管理员");
//     }
//     return response;
//   },
//   error => {
//     if(error.response) {

//     }
//     return Promise.reject(error.response.message) // 返回接口返回的错误信息
//   }
// )


new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
