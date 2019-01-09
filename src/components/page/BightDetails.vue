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

            <div class="schart">

                <schart canvasId="line" width="1400px" height="600" :data="data1" type="line" :options="options1"></schart>
            </div>
        </div>

</template>

<script>
    import Schart from 'vue-schart';
    export default {

        components: {
            Schart
        },
        data: () => ({
            
            data1:[
                {name:'2012',value:1141},
                {name:'2013',value:1499},
                {name:'2014',value:2260},
                {name:'2015',value:1170},
                {name:'2016',value:970},
                {name:'2017',value:1450}
            ],
            data2 : [
                {name:'短袖',value:1200},
                {name:'休闲裤',value:1222},
                {name:'连衣裙',value:1283},
                {name:'外套',value:1314},
                {name:'羽绒服',value:2314}
            ],
            options1: {
                title: '某商店近年营业总额',
                bgColor: '#009688',
                titleColor: '#ffffff',
                fillColor: '#e0f2f1',
                axisColor: '#ffffff',
                contentColor: '#999'
            },
            options2: {
                title: '某商店各商品年度销量',
                bgColor: '#607d8b',
                titleColor: '#ffffff',
                legendColor: '#ffffff'
            }
        })
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
