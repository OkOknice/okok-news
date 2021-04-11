<template>
	<view class="nav-container">
		<view class="nav-fixed">
			<view :style="{height: statusBarHeight + 'px'}"></view>
			<view class="nav-content" :class="{search:isSearch}" :style="{height:navWindowHeight + 'px',width:windowWidth+'px'}">
				<view v-if="isSearch" class="nav-search-icons" @click="back">
					<uni-icons type="back" size="25" color="#fff"></uni-icons>
				</view>
				<view v-else class="nav-search" @click.stop="open">
					<view class="nav-search-icon">
						<text class="iconfont icon-search"></text>
					</view>
					<view class="nav-search-text">uniapp,vue</view>
				</view>
				<view v-if="isSearch" class="nav-search">
					<input 
						type="text" 
						v-model="val" 
						placeholder="请输入搜索的内容..." 
						class="nav-search-text" 
						@input="inputChange"
					/>
				</view>
			</view>
		</view>
		<view :style="{height:statusBarHeight + navWindowHeight + 'px'}"></view>
	</view>
</template>

<script>
	export default {
		name:"navBar",
		props:{
			isSearch:{
				type:Boolean,
				default (){
					return false
				}
			},
			value:{
				type: [String, Number],
				default: ''
			}
		},
		data() {
			return {
				statusBarHeight:20,
				navWindowHeight:45,
				windowWidth: 375,
				val:''
			}
		},
		watch:{
			value (newValue){
				this.val = newValue
			}
		},
		created (){
			//获取手机信息
			this.statusBarHeight  = uni.getSystemInfoSync().statusBarHeight
			//#ifndef H5 || APP-PLUS || MP-ALIPAY
			//获取微信胶囊的位置
			let res = uni.getMenuButtonBoundingClientRect()
			console.log(res)
			this.navWindowHeight = (res.bottom - this.statusBarHeight ) + (res.top - this.statusBarHeight)
			this.windowWidth = res.left
			console.log(this.windowWidth)
			//#endif
			
		},
		methods:{
			open (){
				uni.navigateTo({
					url:"/pages/home-search/home-search"
				})
			},
			back (){
				uni.switchTab({
					url:"/pages/tapbar/index/index"
				})
			},
			inputChange(e){
				let {value} = e.detail
				// console.log(value)
				this.$emit('change',value)
			},
		}
	}
</script>

<style lang="scss">
	@import "../../common/css/icons.css";
	.nav-container{
		.nav-fixed{
			position: fixed;
			top:0;
			left:0;
			z-index:99;
			width:100%;
			background:$mk-base-color;
			.nav-content{
				display:flex;
				height:45px;
				justify-content: center;
				align-items: center;
				padding:0 10px;
				box-sizing: border-box;
				.nav-search{
					display: flex;
					align-items: center;
					padding:0 10px;
					width:100%;
					height:30px;
					border-radius: 30px;
					background:#fff;
					.nav-search-text{
						color:#bbb;
						font-size:14px;
					}
					.nav-search-icon{
						// width:15px;
						// height:15px;
						// border:1px solid red;
						margin-right:10px;
					}					
				}
				&.search{
					padding-left:0;
					.nav-search-icons{
						margin-left:10px;
						margin-right:10px;
					}
					.nav-search{	
						border-radius: 5px;
						.nav-search-text{
							width:100%;
							font-size:14px;
						}
					}
				
				}
			}
		}
	}
</style>
