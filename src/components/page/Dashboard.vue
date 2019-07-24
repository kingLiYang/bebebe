<template>
  <div>
    <div class="loader1 loader">
      <!-- <ul>
      				<li class="issues-add issues-add-wb">
					<div class="iss-account" v-for="(item,index) in weiboList" :key="item.index" >
						<i class="icon-t icon-account" v-show="item.isAccountWb"></i>
						<el-checkbox @change="suer(item,$event,index)" :label="item.screenName" :title="item.screenName" border ></el-checkbox>
					</div>
					<div  @click="toAddPage('1')" :class="{addID:true,issuesFont:true,addActive:false}"><i class="icon icon-issues-add2"></i>添加账号</div>
				</li>
      </ul> -->

      <img src="static/img/home.jpg" style="width:100%;">
        <!-- <span>敬请期待</span>
      <div></div>
      <div></div>
      <div></div> -->
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      // weiboList: [{screenName: '微博1',isAccountWb: false,type: 1},{screenName: '微博2',isAccountWb: false,type: 1},{screenName: '微博3',isAccountWb: false,type: 1}]
    };
  },
  methods: {
		suer(data,event,index){
      if (data.type === 1) { // 微博
      console.log(index);
        // this.weiboList[index].isAccountWb == true ? this.weiboList[index].isAccountWb = false : this.weiboList[index].isAccountWb = true
        this.weiboList[index].isAccountWb = this.weiboList[index].isAccountWb == true ? false : true;
        console.log(this.weiboList);

				// this.isAccountWb =false
			  // let accessToken = data.accessToken
				// let _index = this.wbAccountSum.indexOf(accessToken)
				// if (event) {
				// 	this.isAccountWb = !this.isAccountWb
				// 	this.weiboList[index].isAccountWb = true
				// 	console.log()
				// 	if ( _index === -1) {
				// 		this.wbAccountSum.push(data.accessToken)
				// 	}	
				// } else {
				// 	if (_index !== -1) {
				// 		this.wbAccountSum.splice(_index, 1)
				// 	}	
				// }
			}else if(data.type === '2'){ //微信
				this.isAccountWx =false
				let id = data.id
				let type = this.value
				let params = id+"-"+type
				let _index = this.wxAccountSum.findIndex(item => item === params)
				if (event) {
					this.isAccountWx = !this.isAccountWx
					if ( _index === -1) {
						this.wxAccountSum.push(params)
					}	
				} else {
					if (_index !== -1) {
						this.wxAccountSum.splice(_index, 1)
					}	
				}
			}else { }  //人民号 
		},
  },
  computed: {
    // role() {
    //     return this.name === 'admin' ? '超级管理员' : '普通用户';
    // }
  }
};
</script>


<style scoped>
/* .loader1{
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 30px;
}
.loader1 span{
    float: left;
    
}
@-webkit-keyframes loader1 {
	0% {
		-webkit-transform: scale(1);
		opacity: 1;
	}
	45% {
		-webkit-transform: scale(0.1);
		opacity: 0.7;
	}
	80% {
		-webkit-transform: scale(1);
		opacity: 1;
    }
}
.loader1 div {
	width: 10px;
	height: 10px;
	background: #000;
	border-radius: 50%;
	float: left;
	margin: 2px;
}
.loader1 div:nth-child(1) {
	-webkit-animation: loader1 0.75s -0.12s ease infinite;
}
.loader1 div:nth-child(2) {
	-webkit-animation: loader1 0.75s -0.24s ease infinite;
}
.loader1 div:nth-child(3) {
	-webkit-animation: loader1 0.75s 0s ease infinite;
} */



/* .el-row {
  margin-bottom: 20px;
}

.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 12px;
  color: #999;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}

.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-avator {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 70px;
}

.mgb20 {
  margin-bottom: 20px;
}

.todo-item {
  font-size: 14px;
}

.todo-item-del {
  text-decoration: line-through;
  color: #999;
} */
</style>
