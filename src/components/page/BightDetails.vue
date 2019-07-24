<template>
    <div>
        <div class="crumbs">
            <el-row :gutter="20">
                <el-col>
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>
                            <i class="el-icon-tickets"></i> 温度曲线详情
                        </el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
            </el-row>
        </div>

        <div id="myChart" :style="{width: '1400px', height: '600px'}" v-loading="loading"></div>
        </div>

</template>

<script>
    export default {
        name: 'hello',
        data () {
            return {
                loading: true,
                token: ""
            }
        },
        created(){
            this.token = window.sessionStorage.getItem("token");
        },
        mounted(){
            this.drawLine();
        },
        methods: {
            drawLine(){
                let that = this;
                let EndTime = window.localStorage.getItem('EndTime');
                let StartTime = window.localStorage.getItem('StartTime');
                let SheBeiHao = JSON.parse(window.localStorage.getItem('SheBeiHao'));
                let  BillNumber = JSON.parse(window.localStorage.getItem('BillNumber'));
                that.EndTime = EndTime;
                that.StartTime = StartTime;

                that.SheBeiHao =SheBeiHao;
                that.BillNumber =BillNumber;
                that.$axios({
                    url: "http://www.zjcoldcloud.com/berry/public/index.php/Init_way_bill/details",
                    method: "post",
                    data: {
                        SheBeiHao :      that.SheBeiHao,
                        BillNumber  :   that.BillNumber,
                        state:"quxian",
                        EndTime:that.EndTime||"",
                        StartTime:that.StartTime||"",
                        token: that.token

                    },
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
                    that.loading = false;
                    var arrX = [];
                    var arrY = [];
                    var num = Math.ceil(res.data.data.length / 20);
                    for (var k = 0; k < res.data.data.length; k ++) {
                        if(k % num == 0 || k == 0 || k == res.data.data.length - 1){
                            arrX.push(res.data.data[k].time);
                            arrY.push(res.data.data[k].temperature01);
                        }
                    }

                    // 基于准备好的dom，初始化echarts实例
                    let myChart = that.$echarts.init(document.getElementById('myChart'))
                    // 绘制图表
                    myChart.setOption({

                        backgroundColor: "#fff",
                        color: ["#37A2DA"],

                        toolbox: {
                            left: 'right',
                            feature: {


                                dataZoom: {
                                    yAxisIndex: 'none'
                                },
                                dataView: {readOnly: false},
                                magicType: {type: ['line', 'bar']},
                                restore: {},
                                saveAsImage: {}
                            }
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            data: arrX
                        },
                        yAxis: {
                            x: 'center',
                            type: 'value',
                            axisLabel: {
                                formatter: '{value} °C'
                            }
                        },
                        series: [{
                            name: '温度',
                            type: 'line',
                            data: arrY
                        }]


                    });

                });

            }
        }
    }
</script>

<style scoped>
    .schart{
        width: 600px;
        display: inline-block;
    }
    .content-title{
        clear: both;
        font-weight: 400;
        line-height: 50px;
        margin: 10px 0;
        font-size: 22px;
        color: #1f2f3d;
    }

</style>
