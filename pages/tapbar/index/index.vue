<template>
	<view class="home">
		<navBar></navBar>
		<tabList :tabList="tabList" @tab="tab" :currentIndex="currentIndex"></tabList>
		<view class="home-list">
			<list @change="change" :tabList="tabList" :activeIndex="activeIndex"></list>
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		data() { 
			return {
				tabList:[],
				currentIndex:0,
				activeIndex:0
			}
		},
		computed:{
			...mapState(['userInfo'])
		},
		watch:{
			userInfo (newVal){
				this.getLabel()
			}
		},
		onLoad() {
			//接受用home-label传过来的自定义事件，目的是为了更新标签之后，首页的tab栏的数据也会及时更新
			uni.$on('labelchange',() =>{
				this.tabList = []
				this.currentIndex = 0
				this.activeIndex = 0
				this.getLabel() 
			})
			this.getLabel()
		},
		// onShow (){
		// 	this.getLabel()
		// 	console.log("show")
		// },
		methods: {
			//内容切换
			change (current){
				this.currentIndex = current
				this.activeIndex = current
			},
			//点击切换选项卡
			tab ({data,index}){
				// console.log(data,index)
				this.activeIndex = index
			},
			// 获取数据库的数据
			getLabel (){
				let self = this
				//用云函数api获得从get_label请求回来的数据
				this.$api.get_label().then(res =>{
					// console.log(res)
					let {data} = res
					data.unshift({
						name:"全部"
					})
					self.tabList = data
				})
				// uniCloud.callFunction({ 
				// 	name:"get_label" //与请求的云函数的名字相对应
				// }).then(res =>{
				// 	let {result} = res
				// 	// console.log(result)
				// 	result.data.unshift({
				// 		name:"全部"
				// 	})
				// 	self.tabList = result.data
				// })
			}
		}
	}
</script>

<style lang="scss">
	page{
		height:100%;
		display: flex;
	}
	.home{
		display: flex;
		flex-direction: column;
		flex:1;
		overflow: hidden;
		.home-list{
			flex:1;
			box-sizing: border-box;
			overflow:hidden;
		}
	}
	
</style>
