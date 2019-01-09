<template>
    <div>
        <div class="crumbs">
            <el-row :gutter="20">
                <el-col>
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>
                            <i class="el-icon-tickets"></i> 运单轨迹详情
                        </el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
            </el-row>
        </div>
        <div class="container">
        <div id="allmap" ref="allmap"></div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {

            };
        },
        methods: {
            map() {
                let map = new BMap.Map(this.$refs.allmap); // 创建Map实例
                map.centerAndZoom(new BMap.Point(116.404, 39.915), 11); // 初始化地图,设置中心点坐标和地图级别
                map.addControl(
                    new BMap.MapTypeControl({
                        //添加地图类型控件
                        mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP]
                    })
                );
                map.setCurrentCity("北京"); // 设置地图显示的城市 此项是必须设置的
                map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
            }
        },
        computed: {
            // role() {
            //     return this.name === 'admin' ? '超级管理员' : '普通用户';
            // }
        },
        mounted() {
            this.map();
        }
    };
</script>


<style scoped>
    #allmap {
        height: 650px;
        overflow: hidden;
    }


</style>
