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
                // {
                //     path: '/table',
                //     component: resolve => require(['../components/page/BaseTable.vue'], resolve),
                //     meta: { title: '基础表格' }
                // },
                // {
                //     path: '/tabs',
                //     component: resolve => require(['../components/page/Tabs.vue'], resolve),
                //     meta: { title: 'tab选项卡' }
                // },
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
                        title: '地址管理'
                    }
                },
                {
                    // 试剂管理
                    path: '/drug',
                    component: resolve => require(['../components/page/Drug.vue'], resolve),
                    meta: {
                        title: '试剂管理'
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
                        title: '订单管理'
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
                // 运单管理
                {
                    path: '/InitWayBill',
                    component: resolve => require(['../components/page/Waybill.vue'], resolve),
                    meta: {
                        title: '运单管理'
                    }
                },

                /************************************************************************** */
                {
                    // 图片上传组件
                    path: '/upload',
                    component: resolve => require(['../components/page/Upload.vue'], resolve),
                    meta: {
                        title: '文件上传'
                    }
                },
                {
                    // vue-schart组件
                    path: '/charts',
                    component: resolve => require(['../components/page/BaseCharts.vue'], resolve),
                    meta: {
                        title: 'schart图表'
                    }
                },
                {
                    // 拖拽列表组件
                    path: '/drag',
                    component: resolve => require(['../components/page/DragList.vue'], resolve),
                    meta: {
                        title: '拖拽列表'
                    }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: resolve => require(['../components/page/Permission.vue'], resolve),
                    meta: {
                        title: '权限测试',
                        permission: true
                    }
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        }
        // {
        //     path: '/404',
        //     component: resolve => require(['../components/page/404.vue'], resolve)
        // },
        // {
        //     path: '/403',
        //     component: resolve => require(['../components/page/403.vue'], resolve)
        // },
        // {
        //     path: '*',
        //     redirect: '/404'
        // }
    ]
})
