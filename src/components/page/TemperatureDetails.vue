<template>
    <div>
        <div class="crumbs">
            <el-row :gutter="20">
                <el-col>
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>
                            <i class="el-icon-tickets"></i> 温度监控详情页
                        </el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
            </el-row>
        </div>
        <div class="container">
            <div>
                <el-row >
                    <table>
                        <tr >
                            <td colspan="6" style="background: #f0f0f0;color: rgb(255, 255, 255);">
                                <span style="float: left;margin-left: 10px;font-family: cursive;font-weight: 700;color:deepskyblue">温度概况</span >
                                <span style="float: right;margin-right: 20px;font-family: cursive;font-weight: 700;color:deepskyblue">设备编号：{{SheBeiHao}}</span>
                            </td>

                        </tr>
                        <tr>

                            <td class="table_td">采集间隔</td>
                            <td>{{interval}}</td>
                            <td class="table_td">温度最大值</td>
                            <td>{{Tem_H}}℃</td>
                            <td class="table_td">报警上限</td>
                            <td>{{Police_H}}℃</td>
                        </tr>
                        <tr>

                            <td class="table_td">开始时间</td>
                            <td>{{StartTime}}</td>
                            <td class="table_td">温度最小值</td>
                            <td>{{Tem_L}}℃</td>
                            <td class="table_td">报警下限</td>
                            <td>{{Police_L}}℃</td>
                        </tr>
                    </table>
                </el-row>
                <el-row style="margin-bottom: 20px;border:1px solid #cccccc;padding: 30px 20px;">
                    <el-form :inline="true" style="margin: 20px 0 0 0;">
                        <el-row>
                            <el-col style="width:max-content;">
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
                                <el-button type="primary" icon="search" @click="getData()" >搜索</el-button>

                            </el-col>
                        </el-row>
                    </el-form>
                    <div style="margin-bottom: 20px;">

                        <el-button type="success" @click="excelDetails()">excel</el-button>
                        <el-button type="primary" @click="PdfDetails()">PDF</el-button>
                        <el-button type="primary" @click="curve()">曲线</el-button>
                        <el-button type="primary" @click="trackDetails()">轨迹</el-button>
                    </div>

                    <el-table
                        border
                        style="width: 100%"
                        :data="tableData"
                    >

                        <el-table-column type="index" width="70" label="序号" align="center"></el-table-column>
                        <el-table-column prop="id" label="设备号" align="center"></el-table-column>
                        <el-table-column prop="temperature01" label="温度" align="center"  :formatter="timesta2"></el-table-column>
                        <el-table-column prop="strong" label="信号强弱" align="center"></el-table-column>
                        <el-table-column prop="aaa" label="地理位置" align="center"   :show-overflow-tooltip="true"  :formatter="timesta"></el-table-column>
                        <el-table-column prop="time" label="采集时间" align="center" ></el-table-column>
                        <el-table-column prop="power" label="电量" align="center"  :formatter="timesta3"></el-table-column>

                    </el-table>
                    <div class="pagination">
                        <el-pagination
                            @current-change="handleCurrentChange"
                            layout="prev, pager, next"
                            :page-size="10"
                            :total="ccc"

                        ></el-pagination>
                    </div>

                </el-row>



            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                tableData:[],
                token: "",
                cur_page: 1,
                ccc: 0,//总页数
                value4: [],//发货时间
                aaa:'',
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
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            getData() {
                if(this.value4 == null){
                    this.value4 = ["",""];
                }
                let data = JSON.parse(window.localStorage.getItem('data'));

                this.interval = data.interval||"0";
                this.StartTime = data.StartTime||"0";
                this.Tem_H = data.Tem_H||"0";
                this.Tem_L = data.Tem_L||"0";
                this.Police_L = data.Police_L||"0";
                this.Police_H = data.Police_H||"0";
                let SheBeiHao = JSON.parse(window.localStorage.getItem('SheBeiHao'));
                let BillNumber = JSON.parse(window.localStorage.getItem('BillNumber'));
                this.SheBeiHao = SheBeiHao;
                this.BillNumber = BillNumber;
                this.$axios.post(
                    this.URL_API + "/berry/public/index.php/Init_way_bill/details",
                    {
                        page: this.cur_page,   //当前页
                        BillNumber: this.BillNumber, //运单号
                        SheBeiHao: this.SheBeiHao,  //设备编号
                        StartTime: this.value4[0] || '', // 下单开始时间
                        EndTime: this.value4[1] || '', // 下单结束时间


                    },
                    {
                        transformRequest: [
                            function (data) {
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
            timesta(row, column) {
               return  this.aaa = "纬度" +row.weidu+","+"经度"+row.jingdu


            },
            timesta2(row,column){
                return  this.temperature01= row.temperature01+"℃"
            },
            timesta3(row,column){
                return  this.power= row.power+"%"
            },

            excelDetails(){
                window.location.href="http://www.zjcoldcloud.com/berry/public/index.php/Init_way_bill/details?BillNumber="+this.BillNumber+"&SheBeiHao="+this.SheBeiHao+"&state=excel"
            },
            PdfDetails(){
                window.location.href="http://www.zjcoldcloud.com/berry/public/index.php/Init_way_bill/details?BillNumber="+this.BillNumber+"&SheBeiHao="+this.SheBeiHao+"&state=pdf"

            },
            //曲线
            curve(){
                this.$router.push({path:"/BightDetails"})
            },
            //轨迹
            trackDetails(){
                this.$router.push({path:"/TrajectoryDetails"})
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


