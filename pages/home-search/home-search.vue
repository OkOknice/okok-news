<template>
	<view class="home">
		<navBar :isSearch="true" v-model="value" @change="change"></navBar>
		<view class="search-label">
			<view v-if="is_history" class="search-label-box">
				<view class="search-header">
					<view class="search-history">
						搜索历史
					</view>
					<view class="search-clear" @click="clearHistory">
						清空
					</view>
				</view>
				<view class="search-content" v-if="historyLists.length > 0">
					<view 
						class="search-content-label" 
						v-for="(item,index) in historyLists" 
						:key="index"
						@click="openSearch(item)"
					>{{item.name}}</view>
				</view>
				<view v-else class="no-data">
					没有搜索历史
				</view>
			</view>
			<!-- <button @click="testBtn">点击测试</button> -->
			<listDetail v-else>
				<uni-load-more v-if="isLoading" status="loading"></uni-load-more>
				<listCard
					@click="clickBtn"
					v-for="item in searchList" 
					:key="item._id" 
					:item="item"
				></listCard>
				<view v-if="searchList.length === 0 && !isLoading"  class="no-data">
					没有搜索相关数据
				</view>
			</listDetail>
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
				// historyLists:[]
				searchList:[],
				value:'',
				is_history:true,
				isLoading:false
			}
		},
		computed:{
			...mapState(['historyLists'])
		},
		onLoad (){
			console.log(this.historyLists.length)
		},
		methods: {
			//设置历史记录
			clickBtn (){
				console.log(this.value)
				this.$store.dispatch('set_historyLists',{
					name:this.value
				})
			},
			//清楚搜索记录
			clearHistory (){
				this.$store.dispatch('clear_history')
				uni.showToast({
					title:'清除完成'
				})
				
			},
			//根据历史记录实现再搜索
			openSearch (item){
				console.log('111')
				this.value = item.name
				this.getSearchLists(this.value)
			},
			
			//搜索
			change (value){
				// console.log(value)
				// this.value = val
				this.value = value
				if(!value){
					clearTimeout(this.timer)
					this.mark = false
					this.getSearchLists(value)
					return
				}
				
				//节流防抖
				if(!this.mark){
					this.mark = true
					 this.timer = setTimeout(() =>{
							this.mark = false
							this.getSearchLists(value)
					 },1500)
				}
			},
			
			//获取搜索记录
			getSearchLists (value){
				if(!value){
					this.is_history = true
					this.searchList = []
					return
				}
				this.is_history = false
				this.isLoading = true
				this.$api.get_searchLists({
					value,
				})
				.then(res =>{
					console.log(res)
					this.isLoading = false
					this.searchList = res.data
				}).catch(() =>{
					this.isLoading = false
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
		display: flex;
		background-color: #f5f5f5;
	}
	.home{
		display: flex;
		flex-direction: column;
		flex: 1;
		.search-label-box{
			background-color: #fff;
			margin-bottom: 10px;
			.search-header{
				display: flex;
				justify-content: space-between;
				font-size: 14px;
				color: #666;
				padding: 10px 15px;
				border-bottom: 1px #f5f5f5 solid;
				.search-history{
					color:$mk-base-color;
				}
				.search-clear{
					color: #30b33a;
					font-weight: bold;
				}
			}
			.search-content{
				display: flex;
				flex-wrap: wrap;
				padding:15px;
				padding-top:0;
				.search-content-label{
					padding:2px 10px;
					margin-top: 12px;
					margin-right: 10px;
					border-radius: 5px;
					border: 1px #666 solid;
					font-size: 14px;
					color: #666;
				}
			}
			
		}
		.no-data{
			height: 200px;
			line-height: 200px;
			width: 100%;
			text-align: center;
			font-size: 14px;
			color: #666;
		}
	}
</style>
