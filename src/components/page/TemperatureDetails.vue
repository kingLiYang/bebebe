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
                                <span style="float: right;margin-right: 20px;font-family: cursive;font-weight: 700;color:deepskyblue">设备编号：111111</span>
                            </td>

                        </tr>
                        <tr>

                            <td class="table_td">采集间隔</td>
                            <td>5</td>
                            <td class="table_td">温度最大值</td>
                            <td>1</td>
                            <td class="table_td">报警上限</td>
                            <td>2</td>
                        </tr>
                        <tr>

                            <td class="table_td">开始时间</td>
                            <td>5</td>
                            <td class="table_td">温度最小值</td>
                            <td>1</td>
                            <td class="table_td">报警下限</td>
                            <td>2</td>
                        </tr>
                    </table>
                </el-row>
                <el-row style="margin-bottom: 20px;border:1px solid #cccccc;padding: 30px 20px;">
                    <el-form :inline="true" style="margin: 20px 0 0 0;">
                        <el-row>
                            <el-col style="width:max-content;">
                                <el-form-item label="采集时间">
                                    <!-- <el-input v-model="name"></el-input> -->
                                    <el-date-picker

                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        type="datetimerange"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                    ></el-date-picker>
                                </el-form-item>
                                <el-button type="primary" icon="search" >搜索</el-button>

                            </el-col>
                        </el-row>
                    </el-form>
                    <div style="margin-bottom: 20px;">
                        <el-button type="primary" @click="temperatureInformation()">导出</el-button>
                        <el-button type="success" @click="excelDetails()">excel</el-button>
                        <el-button type="primary" @click="PdfDetails()">PDF</el-button>
                        <el-button type="info" @click="curveDetails()">曲线</el-button>
                        <el-button type="primary" @click="trackDetails()">轨迹</el-button>
                    </div>

                    <el-table
                        border
                        style="width: 100%"

                    >
                        <el-table-column type="selection" width="60" align="center"></el-table-column>
                        <el-table-column type="index" width="70" label="序号" align="center"></el-table-column>
                        <el-table-column prop="ID" label="订单号" align="center"></el-table-column>
                        <el-table-column prop="Condition" label="运单状态" align="center" ></el-table-column>
                        <el-table-column prop="BillNUmber" label="运单号" align="center"></el-table-column>
                        <el-table-column prop="TakeTime" label="运单生成时间" align="center"></el-table-column>
                        <el-table-column prop="SendsAddress" label="发货地址" align="center"   :show-overflow-tooltip="true"></el-table-column>
                        <el-table-column prop="GetsTime" label="收货时间" align="center" ></el-table-column>
                        <el-table-column prop="GetAddress" label="收货地址" align="center" :show-overflow-tooltip="true"></el-table-column>

                    </el-table>
                    <div class="pagination">
                        <el-pagination

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

                token: "",

            };
        },
        created() {

            this.token = window.sessionStorage.getItem("token");

        },
        methods: {
            excelDetails(){

            },
            PdfDetails(){

            },
            curveDetails(){

            },
            trackDetails(){

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


