<template>
	<view class="tabList-wrapper">
		<scroll-view scroll-x class="tab-scroll-view">
			<view class="tab-box">
				<view 
					class="tab-item" 
					v-for="(item,index) in tabList" 
					:key="index"
					:class="{active:activeIndex === index}"
					@click="clickTab(item,index)"
				>{{item.name}}
				</view>
			</view>
		</scroll-view>
		<view class="tab-icons">
			<view class="iconfont icon-shezhi tab-icons-item" @click="goTo"></view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"tabList",
		props:{
			tabList:{
				type:Array,
				default (){
					return []
				}
			},
			currentIndex:{
				type:Number,
				default (){
					return 0
				}
			}
		},
		watch:{
			//监听current值的变化，让tablist的值与activeIndex的值相对应
			currentIndex (newValue){
				this.activeIndex = newValue
			}
		},
		data() {
			return {
				activeIndex:0
			};
		},
		methods:{
			clickTab (item,index){
				// console.log(item,index)
				this.activeIndex = index
				this.$emit('tab',{
					data:item,
					index
				})
			},
			goTo (){
				uni.navigateTo({
					url:"/pages/home-label/home-label"
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "../../common/css/icons.css";
	.tabList-wrapper{
		display: flex;
		align-items: center;
		border-bottom:1px solid #f5f5f5;
		.tab-scroll-view{
			flex:1;
			overflow: hidden;
			.tab-box{
				display:flex;
				justify-content: flex-start;
				align-items: center;
				flex-wrap: nowrap;
				height:45px;
				box-sizing: border-box;
				.tab-item{
					flex-shrink: 0;
					padding:0 10px;
					font-size:14px;
					color:#333;
					box-sizing: border-box;
					&.active{
						color:$mk-base-color;
					}
				}
			}
		}
		.tab-icons{
			position:relative;
			width:45px;
			height:45px;
			display: flex;
			justify-content: center;
			align-items: center;
			&::after{
				content:' ';
				position:absolute;
				left:0;
				top:12px;
				bottom:12px;
				width:1px;
				background-color: #ddd;
			}
		}
	}
</style>
