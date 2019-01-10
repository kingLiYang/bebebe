<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-tickets"></i> 运单列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">

            <div class="handle-box">
                <el-button type="primary" @click="temperatureInformation()">导出</el-button>

                <el-form :inline="true" style="margin: 20px 0 0 0;">
                    <el-row>
                        <el-col style="width:max-content;">

                            <el-form-item label="订单号" >
                                <el-input v-model="Order_number"  type="number" placeholder="只能输入数字"></el-input>
                            </el-form-item>
                            <el-form-item label="运单号">
                                <el-input v-model="Waybill_number"></el-input>
                            </el-form-item>
                            <el-form-item label="运单状态">
                                <el-select v-model="select_cate" placeholder="请选择" class="handle-select mr10">
                                    <el-option key="0" label="代取件" value="0"></el-option>
                                    <el-option key="1" label="已取件" value="1"></el-option>
                                    <el-option key="2" label="已入库" value="2"></el-option>
                                    <el-option key="3" label="已出港" value="3"></el-option>
                                    <el-option key="4" label="已入港" value="4"></el-option>
                                    <el-option key="5" label="签收完成!" value="签收完成!"></el-option>
                                    <el-option key="6" label="配载完成" value="配载完成"></el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="发货时间">
                                <!-- <el-input v-model="name"></el-input> -->
                                <el-date-picker
                                    v-model="value4"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    type="datetimerange"
                                    :picker-options="pickerOptions2"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                ></el-date-picker>
                            </el-form-item>
                            <el-button type="primary" icon="search" @click="getData">搜索</el-button>

                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <el-table
                :data="tableData"
                border
                style="width: 100%"
                ref="multipleTable"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="60" align="center"></el-table-column>
                <el-table-column type="index" width="70" label="序号" align="center"></el-table-column>
                <el-table-column prop="ID" label="订单号" align="center"></el-table-column>
                <el-table-column prop="Condition" label="运单状态" align="center" :formatter="formatter"></el-table-column>
                <el-table-column prop="BillNUmber" label="运单号" align="center"></el-table-column>
                <el-table-column prop="TakeTime" label="运单生成时间" align="center"></el-table-column>
                <el-table-column prop="SendsAddress" label="发货地址" align="center"   :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="GetsTime" label="收货时间" align="center" ></el-table-column>
                <el-table-column prop="GetAddress" label="收货地址" align="center" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button size="small" type="primary" @click.native.prevent="details(scope.row)">详情</el-button>
                        <el-button size="small" type="warning" @click.native.prevent="TemperatureList(scope.row)">温度</el-button>
                    </template>
                </el-table-column>
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
       <!-- &lt;!&ndash; 温度信息弹出框 &ndash;&gt;
        <el-dialog :title="title" :visible.sync="editVisible" width="50%"  >
            <el-form ref="form" :model="form">
                    <el-input v-model="company" style="width: 60px;"></el-input>
            </el-form>

            <span slot="footer" class="dialog-footer">

            <el-button @click="editVisible = false">返 回</el-button>

           </span>
        </el-dialog>


        &lt;!&ndash; 资料签收弹出框 &ndash;&gt;
        <el-dialog :title="title" :visible.sync="qianshouVisible" width="50%" >
            <table v-model="TMSorder">
                <tr>
                    <td class='table_td'>运单号</td>
                    <td>111111111</td>
                    <td class='table_td'>实际重量</td>
                    <td>111111111</td>

                </tr>
                <tr>
                    <td class='table_td'>货物名称</td>
                    <td>1</td>
                    <td class='table_td'>计费重量</td>
                    <td>1</td>

                </tr>
                <tr>
                    <td class='table_td'>始发城市</td>
                    <td>1</td>
                    <td class='table_td'>目的城市</td>
                    <td>1</td>

                </tr>
                <tr>
                    <td class='table_td'>温度计使用</td>
                    <td>1</td>

                    <td class='table_td'>件数</td>
                    <td>1</td>
                </tr>
                <tr>
                    <td class='table_td'>签收人</td>
                    <td>1</td>

                    <td class='table_td'>温度区间</td>
                    <td>1</td>
                </tr>
                <tr>
                    <td class='table_td'>签收时间</td>
                    <td>1</td>

                    <td class='table_td'>委托时间</td>
                    <td>1</td>
                </tr>
            </table>

            <span slot="footer" class="dialog-footer">

            <el-button @click="qianshouVisible = false">返 回</el-button>

           </span>
        </el-dialog>-->
    </div>
</template>

<script>
    export default {
        data() {
            return {
                Waybill_number: "",//运单号
                Order_number:"",//订单号
                select_cate: "",//运单状态
                tableData: [],
                GetsTime:"",
                form: {
                    Waybill_number: "",
                    Order_number:"",
                },
                cur_page: 1,
                ccc: 0,//总页数
                token: "",
                value4: [],//发货时间
                multipleSelection: [],
                pickerOptions2: {
                    shortcuts: [
                        {
                            text: "最近一周",
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                picker.$emit("pick", [start, end]);
                            }
                        },
                        {
                            text: "最近一个月",
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                picker.$emit("pick", [start, end]);
                            }
                        },
                        {
                            text: "最近三个月",
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                                picker.$emit("pick", [start, end]);
                            }
                        }
                    ]
                }
            };
        },
        created() {
            this.token = window.sessionStorage.getItem("token");
            this.getData();
        },
        methods: {
            // 分页导航
            handleSelectionChange(val) {
                // 选中的  当前条 数据
                this.multipleSelection = val;
            },
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            getData() {
                if(this.value4 == null){
                    this.value4 = ["",""];
                }
                this.$axios.post(
                        this.URL_API + "/berry/public/index.php/Init_way_bill/index",
                        {
                            page: this.cur_page,   //当前页
                            BillNumber:this.Waybill_number, //运单号
                            Condition: this.select_cate, // 0 未完成 1 已完成
                            ID:this.Order_number,        //订单号
                            TakeTime: this.value4[0] || '', // 下单开始时间
                            GetsTime: this.value4[1] || '', // 下单结束时间
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
                            this.tableData = res.data.data;
                            this.ccc = res.data.sum;

                        } else {
                            this.tableData = [];
                            this.ccc = 1;
                            this.$message.error(res.data.message);
                        }
                    });
            },
            //过滤运单状态
            formatter(row, column) {
                switch (row.Condition){
                    case '配载完成':
                        return '配载完成';
                        break;
                    case '签收完成!':
                        return '签收完成!';
                        break;
                    case  null:
                        return '暂无';
                        break;
                    case '已取货':
                        return '已取货';
                        break;
                    case '已签收':
                        return '已签收';
                        break;
                    case '已返箱':
                        return '已返箱';
                        break;
                    case '已拒单':
                        return '已拒单';
                        break;
                    case '已完成':
                        return '已完成';
                        break;
                }


            },


            temperatureInformation() {
                let len = this.multipleSelection;
                if (len.length == 1) {
                    this.id = len[0].id;
                    // 获取温度信息数据
                } else if (len.length == 0) {
                    this.$message.error("请选择导出信息");
                } else {
                    this.$message.error("请选择单个数据");
                }
            },





//详情
          /*  details(rows){
                let id = rows.order_id;
                // 详情
                let that = this;
                this.$axios({
                    url: "http://www.zjcoldcloud.com/bqs/backend/web/index.php/order/details",
                    method: "post",
                    data: { order_id: id,token: window.sessionStorage.getItem("token") },
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
                    ],
                    headers: { "Content-Type": "application/x-www-form-urlencoded" }
                }).then(function(res) {
                    if(res.data.code == '0'){

                        that.$router.push({path:"/billDetails"});
                        window.localStorage.setItem('data',JSON.stringify(res.data));
                        // that.options = res.data.data;
                    }else if(res.data.code == '450'){
                        that.$message("暂无权限");
                    }

                });
            },*/


          //温度详情页
            TemperatureList(rows){
                let BillNumber = rows.BillNUmber,
                      TakeTime =    rows.TakeTime,
                       GetsTime  =rows.GetsTime;
                window.localStorage.setItem('TakeTime',TakeTime);
                window.localStorage.setItem('GetsTime',GetsTime);
                this.$axios.post(
                    this.URL_API + "/berry/public/index.php/Init_way_bill/temperature",
                    {
                        BillNumber:BillNumber,
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
                ).then(res => {
                    if(res.data.code == '0'){

                    this.$router.push({path:"/TemperatureList"});
                    window.localStorage.setItem('data',JSON.stringify(res.data));
                    window.localStorage.setItem('BillNumber',BillNumber);
                }else if(res.data.code == '450'){
                    this.$message("暂无权限");
                }
                });
            }

        }
    };
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }


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
    }
    .table_td {
        background-color: #eff4f6;
    }
</style>
