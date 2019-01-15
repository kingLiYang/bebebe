<template>
    <div>
        <div style="padding-bottom: 50px;">
            <el-col>
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item>
                        <i class="el-icon-tickets"></i> 运单详情
                    </el-breadcrumb-item>
                </el-breadcrumb>
            </el-col>
        </div>
      <!--  <div v-if="showPrise">暂无数据</div>-->
        <div v-for='(item,index) in datailsWabill ' :key="index" style="margin-bottom: 50px" >

            <div class="crumbs">
                <el-row >
                    <el-col style="display:flex;"  >
                        <div style="margin: 0 20px 0 0;"><span style="color:blue;">tms订单号：</span>{{item.tms_order_code}}</div>
                        <div><span style="color:blue;">保价金额：</span>{{item.support_value}}</div>
                        <div style="margin: 0 20px;"><span style="color:blue;">发货时间：</span>{{item.send_goods_time}}</div>
                        <div style="margin: 0 20px 0 0;"><span style="color:blue;">时限：</span>{{item.time_limit}}</div>
                        <div><span style="color:blue;">审核状态：</span>{{item.status}}</div>
                    </el-col>
                </el-row>
            </div>
            <div class="container">
                <h4 style="padding: 0 0 10px 0;">订单信息</h4>
                <el-collapse v-model="activeNames">
                    <el-collapse-item
                        :title="'货号：'+K.art_no+'\xa0\xa0\xa0数量：'+K.art_num+'\xa0\xa0\xa0温度计使用：'+K.is_thermometer"
                        :name="index"
                        v-for="(K,index) in item.drug"
                        :key="index"
                    >
                        <el-row>
                            <table v-for="(S,index) in K.drug" :key="index">
                                <tr>
                                    <td rowspan="4" style="background: rgb(32, 160, 255);color:#fff;">药品信息</td>
                                    <td class="table_td">型号</td>
                                    <td>{{S.model}}</td>
                                    <td class="table_td">品名</td>
                                    <td>{{S.trade_name}}</td>
                                </tr>
                                <tr>

                                    <td class="table_td">规格</td>
                                    <td>{{S.standard}}</td>
                                    <td class="table_td">储运温度</td>
                                    <td>{{S.temperature}}</td>
                                </tr>
                                <tr>

                                    <td class="table_td">尺寸</td>
                                    <td>{{S.size}}</td>
                                    <td class="table_td">放置方式</td>
                                    <td>{{S.placement_mode}}</td>
                                </tr>
                                <tr>

                                    <td class="table_td">保价金额</td>
                                    <td>{{S.support}}</td>
                                </tr>
                            </table>
                        </el-row>
                    </el-collapse-item>
                </el-collapse>
                 <div >
                     <h4 style="padding: 10px 0;">货物信息</h4>
                     <el-row v-model="item.send_goods_address">
                         <table>
                             <tr>
                                 <td rowspan="2" style="background: rgb(32, 160, 255);color:#fff;">发货信息</td>
                                 <td class="table_td">发货人</td>
                                 <td>{{item.send_goods_address.username}}</td>
                                 <td class="table_td">联系电话</td>
                                 <td>{{item.send_goods_address.phone}}</td>
                             </tr>

                             <tr>

                                 <td class="table_td">发货公司</td>
                                 <td>{{item.send_goods_address.company}}</td>
                                 <td class="table_td">发货地址</td>
                                 <td>{{item.send_goods_address.province+item.send_goods_address.city+item.send_goods_address.district+item.send_goods_address.address}}</td>
                             </tr>
                         </table>
                     </el-row>
                     <el-row v-model="item.get_goods_address">
                         <table>
                             <tr>
                                 <td rowspan="2" style="background: rgb(32, 160, 255);color:#fff;">收货信息</td>
                                 <td class="table_td">收货人</td>
                                 <td>{{item.get_goods_address.username}}</td>
                                 <td class="table_td">联系电话</td>
                                 <td>{{item.get_goods_address.phone}}</td>
                             </tr>

                             <tr>

                                 <td class="table_td">收货公司</td>
                                 <td>{{item.get_goods_address.company}}</td>
                                 <td class="table_td">收货地址</td>
                                 <td>{{item.get_goods_address.province+item.get_goods_address.city+item.get_goods_address.district+item.get_goods_address.address}}</td>
                             </tr>
                         </table>
                     </el-row>

                 </div>
            </div>
        </div>

    </div>
</template>
<script>
    export default {
        data() {
            return {
                activeNames: [],
                detailsID: "",
                token: "",
                order_code: "",
                oneTitle: "",
                drugmsg: [],
                sendData:{},
                datailsWabill:[],
                support_value:"",
                limit:"",
                sendTime:"",
                status:"",
                getDatamsg:"",
                //showPrise: false,
            };
        },
        created() {

            this.token = window.sessionStorage.getItem("token");
            this.getData();
        },
        methods: {
            getData() {
                this.detailsID = JSON.parse(window.localStorage.getItem('detailsID'));

                this.$axios
                    .post(
                        this.URL_API + "/berry/public/index.php/init_way_bill/way_default",
                        {
                            o_id: this.detailsID,
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

                        if( res.data.code == 0){
                            //this.showPrise = false
                            this.datailsWabill = res.data.data;
                            this.datailsWabill.forEach((item,index)=>{
                                item.send_goods_time = this.dateFormat(item.send_goods_time,'yyyy-mm-dd hh:ii:ss');
                                switch (item.status) {
                                    case 0 :
                                        item.status = "待审核";
                                        break;
                                    case 1 :
                                        item.status = "通过";
                                        break;
                                    case 2 :
                                        item.status = "驳回";
                                        break;
                                    case 3 :
                                        item.status = "完成";
                                        break;
                                }

                                item.drug.forEach((item,index)=>{
                                    if (item.is_thermometer == 0) {
                                        item.is_thermometer = "否";
                                    } else {
                                        item.is_thermometer = "是";
                                    }

                                })
                            })

                        }else if(res.data.code==1){

                            this.$message.error(res.data.message);
                            this.$router.push({ path: "/InitWayBill" });
                        }




                    });
            },
            dateFormat:function(time,fmt = 'yyyy-mm-dd hh:ii:ss') {
                time = parseInt(time)*1000;
                let date=new Date(time);
                let year=date.getFullYear();
                let month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
                let day=date.getDate()<10 ? "0"+date.getDate() : date.getDate();
                let hours=date.getHours()<10 ? "0"+date.getHours() : date.getHours();
                let minutes=date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
                let seconds=date.getSeconds()<10 ? "0"+date.getSeconds() : date.getSeconds();
                // 拼接
                switch (fmt) {
                    case 'yyyy-mm-dd hh:ii:ss':
                        return year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds;
                        break;
                    default :
                        return year+"-"+month+"-"+day;
                }
            }



        }
    };
</script>
<style>
    .el-collapse-item__header{
        background: rgba(0,0,0,0.2)
    }
</style>

<style scoped>
    td,
    th {
        border: solid #ccc;
        border-width: 0px 1px 1px 0px;
        padding: 10px 0px;
        text-align: center;
    }

    table {
        border: solid #ccc;
        border-width: 1px 0px 0px 1px;
        border-collapse: collapse;
        width: 100%;
        margin: 0 0 20px 0;
    }
    .table_td {
        background-color: #eff4f6;
    }
</style>


