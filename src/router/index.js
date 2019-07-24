import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [{
            path: '/',
            redirect: '/index'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: {
                title: '自述文件'
            },
            children: [{
                    path: '/index',
                    component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                    meta: {
                        title: '系统首页'
                    }
                },
                {
                    path: '/1',
                    component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                    meta: {
                        title: 'hahaha'
                    }
                },
                {
                    // 用户管理
                    path: '/user',
                    component: resolve => require(['../components/page/BaseForm.vue'], resolve),
                    meta: {
                        title: '用户管理'
                    }
                },
                {
                    // 职务管理
                    path: '/role',
                    component: resolve => require(['../components/page/VueEditor.vue'], resolve),
                    meta: {
                        title: '职务管理'
                    }
                },
                {
                    // 权限管理
                    path: '/oauth',
                    component: resolve => require(['../components/page/Markdown.vue'], resolve),
                    meta: {
                        title: '权限管理'
                    }
                },
                {
                    // 地址管理
                    path: '/address',
                    component: resolve => require(['../components/page/Adress.vue'], resolve),
                    meta: {
                        title: '地址管理',
                        keepAlive: true
                    }
                },
                {
                    // 试剂管理
                    path: '/drug',
                    component: resolve => require(['../components/page/Drug.vue'], resolve),
                    meta: {
                        title: '试剂管理',
                        keepAlive: true
                    }
                },
                {
                    // 试剂 添加 页面
                    path: '/addDrug',
                    component: resolve => require(['../components/page/addDrug.vue'], resolve),
                    meta: {
                        title: '试剂管理添加'
                    }
                },
                // init_order 订单管理
                {
                    path: '/initOrder',
                    component: resolve => require(['../components/page/Order.vue'], resolve),
                    meta: {
                        title: '订单管理',
                        keepAlive: true
                    }
                },
                // init_order 订单添加
                {
                    path: '/add_order',
                    component: resolve => require(['../components/page/addOrder.vue'], resolve),
                    meta: {
                        title: '订单添加'
                    }
                },
                // init_order 订单修改
                {
                    path: '/edit_order',
                    component: resolve => require(['../components/page/orderEdit.vue'], resolve),
                    meta: {
                        title: '订单修改'
                    }
                },
                // init_order 订单详情
                {
                    path: '/details_order',
                    component: resolve => require(['../components/page/orderDetails.vue'], resolve),
                    meta: {
                        title: '订单详情'
                    }
                },
                // 运单管理 11111
                {
                    path: '/InitWayBill',
                    component: resolve => require(['../components/page/Waybill.vue'], resolve),
                    meta: {
                        title: '运单管理',
                        keepAlive: true
                    }
                },
                // init_order 运单详情
                {
                    path: '/WaybillDetails',
                    component: resolve => require(['../components/page/WaybillDetails.vue'], resolve),
                    meta: {
                        title: '运单详情'
                    }
                },

                {
                    path: '/details_order',
                    component: resolve => require(['../components/page/orderDetails.vue'], resolve),
                    meta: {
                        title: '订单详情'
                    }
                },
                //温度监控列表
                {
                    path: '/TemperatureList',
                    component: resolve => require(['../components/page/TemperatureList.vue'], resolve),
                    meta: {
                        title: '温度监控'
                    }
                },
                //温度监控详情
                {
                    path: '/TemperatureDetails',
                    component: resolve => require(['../components/page/TemperatureDetails.vue'], resolve),
                    meta: {
                        title: '温度监控详情'
                    }
                },
                //温度监控详情 1000b的
                {
                    path: '/pdf',
                    component: resolve => require(['../components/page/temPdf.vue'], resolve),
                    meta: {
                        title: '温度监控详情'
                    }
                },
                //轨迹详情
                {
                    path:"/TrajectoryDetails",
                    component:resolve => require(['../components/page/TrajectoryDetails.vue'],resolve),
                    meta:{
                        title: '轨迹详情'
                    }
                },
                //曲线详情
                {
                    path:"/BightDetails",
                    component:resolve => require(['../components/page/BightDetails.vue'],resolve),
                    meta:{
                        title: '曲线详情'
                    }
                },

                {
                    // 费用管理
                    path:"/feiyong",
                    component: resolve => require(['../components/page/cost.vue'],resolve),
                    meta:{
                        title: '费用管理',
                        keepAlive: true
                    }
                },
                //  费用保价
                {
                    path: '/insured',
                    component: resolve => require(['../components/page/insured.vue'],resolve),
                    meta:{
                        title: '费用保价'
                    }
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        }
    ]
})
