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
                        state:"guiji",
                        EndTime:that.EndTime||"",
                        StartTime:that.StartTime||"",
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

                    var pointArr = [];

                    var num = Math.ceil(res.data.data.length / 20);
                    for (var k = 0; k < res.data.data.length; k ++) {
                        if(k % num == 0 || k == 0 || k == res.data.data.length - 1){
                            pointArr.push({
                                lng: res.data.data[k].jingdu,
                                lat: res.data.data[k].weidu
                            });

                        }
                    }
                    var trackPoint = [];
                    for (var i = 0, j = pointArr.length; i < j; i++) {
                        trackPoint.push(new BMap.Point(pointArr[i].lng, pointArr[i].lat));
                    }
                    map.centerAndZoom(trackPoint[0], 15);

                    // ����
                    var polyline = new BMap.Polyline(trackPoint, {
                        strokeColor: "#ad0e21",
                        strokeWeight: 3,
                        setStrokeStyle:"dashed",
                        strokeOpacity: 1
                    });
                    map.addOverlay(polyline);
                    // ����ͼƬ
                    var size = new BMap.Size(22, 22);
                    var offset = new BMap.Size(0, 0);
                    var imageSize = new BMap.Size(20, 20);
                    var icon = new BMap.Icon("static/img/marker.svg", size, {
                        imageSize: imageSize,
                        infoWindowAnchor:new BMap.Size(0, -3)
                    });
                    var start = new BMap.Icon("static/img/start.svg", size, {
                        imageSize: imageSize,
                        infoWindowAnchor:new BMap.Size(0, -3)
                    });
                    var end = new BMap.Icon("static/img/end.svg", size, {
                        imageSize: imageSize,
                        infoWindowAnchor:new BMap.Size(0, -3)
                    });


                    // ��ͼ��
                    for (var i = 0, j = trackPoint.length; i < j; i++) {
                        if(i == 0){
                            var marker = new BMap.Marker(trackPoint[i], {
                                icon: start,
                                offset: offset
                            }); // ������ע
                            map.addOverlay(marker);
                            marker.addEventListener("click",function () {
                                // alert(this.getPosition())
                                var point=this.getPosition();
                                // <!-- alert("���ȣ�"+point.lng+"\n"+"γ�ȣ�"+point.lat) -->
                            })
                        }else if(i == j-1){
                            var marker = new BMap.Marker(trackPoint[i], {
                                icon: end,
                                offset: offset
                            }); // ������ע
                            map.addOverlay(marker);
                            marker.addEventListener("click",function () {
                                // alert(this.getPosition())
                                var point=this.getPosition();
                                // <!-- alert("���ȣ�"+point.lng+"\n"+"γ�ȣ�"+point.lat) -->
                            })
                        }else{
                            var marker = new BMap.Marker(trackPoint[i], {
                                icon: icon,
                                offset: offset
                            }); // ������ע
                            map.addOverlay(marker);
                            marker.addEventListener("click",function () {
                                // alert(this.getPosition())
                                var point=this.getPosition();
                                // <!-- alert("���ȣ�"+point.lng+"\n"+"γ�ȣ�"+point.lat) -->
                            })
                        }


                    }

                    //���ݾ�γ��ֵ�������ż��� (�����ϸ���)
                    function getZoom(maxLng, minLng, maxLat, minLat) {
                        var zoom = ["50", "100", "200", "500", "1000", "2000", "5000", "10000", "20000", "25000", "50000", "100000", "200000", "500000", "1000000", "2000000"]; // ����18��3��
                        var pointA = new BMap.Point(maxLng, maxLat); // ����������A
                        var pointB = new BMap.Point(minLng, minLat); // ����������B
                        var distance = map.getDistance(pointA, pointB).toFixed(1); //��ȡ�������,����С�������λ
                        for (var i = 0, zoomLen = zoom.length; i < zoomLen; i++) {
                            if (zoom[i] - distance > 0) {
                                return 18 - i + 3; //֮���Ի��3������Ϊ��ͼ��Χ�����Ǳ����߾����10�����ϡ����Լ��������3��
                            }
                        }
                    }

                    //  (�����ϸ���)
                    function setZoom(points) {
                        if (points.length > 0) {
                            var maxLng = points[0].lng;
                            var minLng = points[0].lng;
                            var maxLat = points[0].lat;
                            var minLat = points[0].lat;
                            var res;
                            for (var i = points.length - 1; i >= 0; i--) {
                                res = points[i];
                                if (res.lng > maxLng) maxLng = res.lng;
                                if (res.lng < minLng) minLng = res.lng;
                                if (res.lat > maxLat) maxLat = res.lat;
                                if (res.lat < minLat) minLat = res.lat;
                            }
                            var cenLng = (parseFloat(maxLng) + parseFloat(minLng)) / 2;
                            var cenLat = (parseFloat(maxLat) + parseFloat(minLat)) / 2;
                            var zoom = getZoom(maxLng, minLng, maxLat, minLat);
                            map.centerAndZoom(new BMap.Point(cenLng, cenLat), zoom);
                        } else {
                            map.centerAndZoom(new BMap.Point(103.388611, 35.563611), 5);
                        }
                    }

                    setZoom(pointArr)

                });
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
