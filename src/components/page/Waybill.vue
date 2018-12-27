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
                <el-button type="primary" @click="temperatureInformation()">温度信息</el-button>
                <el-button type="primary" @click="NodeInformation()">节点信息</el-button>
                <el-button type="primary" @click="SignPictures()">资料&签收图</el-button>
                <el-button type="primary" @click="WaybillTrajectory()">运单轨迹</el-button>
                <el-form :inline="true" style="margin: 20px 0 0 0;">
                    <el-row>
                        <el-col style="width:max-content;">
                            <el-form-item label="运单编号">
                                <el-input v-model="Waybill_number"></el-input>
                            </el-form-item>
                            <el-form-item label="温度计编号">
                                <el-input v-model="Thermometer_number"></el-input>
                            </el-form-item>
                            <el-form-item label="运单状态">
                                <el-select v-model="select_cate" placeholder="请选择" class="handle-select mr10">
                                    <el-option key="0" label="未完成" value="1"></el-option>
                                    <el-option key="1" label="已完成" value="0"></el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="时间">
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
                <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
                <el-table-column prop="order_code" label="温度计编号" align="center"></el-table-column>

                <el-table-column prop="place_order_admin" label="运单编号" align="center"></el-table-column>
                <el-table-column prop="check_order_admin" label="起始城市" align="center"></el-table-column>

                <el-table-column prop="send_goods_address" label="目的城市" align="center"></el-table-column>
                <el-table-column prop="get_goods_address" label="取件地址" align="center"></el-table-column>
                <el-table-column prop="get_goods_address" label="签收地址" align="center"></el-table-column>

                <el-table-column prop="support_value" label="温度区间" align="center"></el-table-column>
                <el-table-column prop="support_value" label="服务网络" align="center"></el-table-column>
                <el-table-column prop="get_goods_address" label="发件公司" align="center"></el-table-column>
                <el-table-column prop="type" label="完成情况" align="center" :formatter="formatter"></el-table-column>
                <el-table-column prop="time_limit" label="时限" align="center"></el-table-column>
                <el-table-column prop="send_goods_time" label="取件时间" align="center" :formatter="addtimesta"></el-table-column>
                <el-table-column prop="addtime" label="签收时间" align="center" :formatter="addtimesta"></el-table-column>
                <el-table-column prop="send_goods_time" label="是否投保" align="center" :formatter="formatter"></el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    @current-change="handleCurrentChange"
                    layout="prev, pager, next"
                    :page-size="2"
                    :total="ccc"
                ></el-pagination>
            </div>
        </div>
        <!-- 温度信息弹出框 -->
        <el-dialog :title="title" :visible.sync="editVisible" width="50%"  >
            <el-form ref="form" :model="form">
                    <el-input v-model="company" style="width: 60px;"></el-input>
            </el-form>

            <span slot="footer" class="dialog-footer">

            <el-button @click="editVisible = false">返 回</el-button>
            <el-button type="primary" @click="saveEdit">提 交</el-button>
           </span>
        </el-dialog>


        <!-- 资料签收弹出框 -->
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
            <el-button type="primary" @click="saveEdit">提 交</el-button>
           </span>
        </el-dialog>



    </div>
</template>

<script>
    export default {
        data() {
            return {
                // url: './static/vuetable.json',
                Waybill_number: "",
                Thermometer_number:"",
                select_cate: "",
                tableData: [],
                TMSorder:"",
                editVisible:false,
                title: "温度信息",
                qianshouVisible:false,

                company:'ee',
                form: {
                    Waybill_number: "",
                    Thermometer_number:"",

                },
                u_id: "",
                cur_page: 1,
                ccc: 0,
                token: "",
                value4: [],

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
                // // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
                // if (process.env.NODE_ENV === 'development') {
                //     this.url = '/ms/table/list';
                // };
                if(this.value4 == null){
                    this.value4 = ["",""];
                }

                this.$axios
                    .post(
                        this.URL_API + "/berry/public/index.php/init_order/index",
                        {
                            page: this.cur_page,
                            Waybill_number:this.Waybill_number,
                            status: this.select_cate, // 0 未完成 1 已完成
                            Thermometer_number:this.Thermometer_number,
                            start_addtime: this.value4[0] || '', // 下单开始时间
                            end_addtime: this.value4[1] || '', // 下单结束时间

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
                        } else {
                            this.tableData = [];
                            this.ccc = 1;
                            this.$message.error(res.data.message);
                        }
                    });
            },
            formatter(row, column) {
                return row.status == 1 ? "启用" : "禁用";
            },
            temperatureInformation() {
                this.title = "温度信息";
                this.editVisible = true;
            },
            saveEdit(){

            },
            NodeInformation(){

            },

            SignPictures(){

                this.title = "资料&签收图";
                this.qianshouVisible = true;
            },
            WaybillTrajectory(){

            },
            addtimesta(row, colume) {
                if (row.addtime == null) {
                    return "暂无";
                } else {
                    let date = new Date(parseInt(row.addtime) * 1000);
                    let Y = date.getFullYear() + "-";
                    let M =
                        date.getMonth() + 1 < 10
                            ? "0" + (date.getMonth() + 1) + "-"
                            : date.getMonth() + 1 + "-";
                    let D =
                        date.getDate() < 10
                            ? "0" + date.getDate() + " "
                            : date.getDate() + " ";
                    let h =
                        date.getHours() < 10
                            ? "0" + date.getHours() + ":"
                            : date.getHours() + ":";
                    let m =
                        date.getMinutes() < 10
                            ? "0" + date.getMinutes() + ":"
                            : date.getMinutes() + ":";
                    let s =
                        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
                    return Y + M + D + h + m + s;
                }
            },
            timesta(row, column) {
                let date = new Date(parseInt(row.send_goods_time) * 1000);
                let Y = date.getFullYear() + "-";
                let M =
                    date.getMonth() + 1 < 10
                        ? "0" + (date.getMonth() + 1) + "-"
                        : date.getMonth() + 1 + "-";
                let D =
                    date.getDate() < 10 ? "0" + date.getDate() + " " : date.getDate() + " ";
                let h =
                    date.getHours() < 10
                        ? "0" + date.getHours() + ":"
                        : date.getHours() + ":";
                let m =
                    date.getMinutes() < 10
                        ? "0" + date.getMinutes() + ":"
                        : date.getMinutes() + ":";
                let s =
                    date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
                return Y + M + D + h + m + s;
            },



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
