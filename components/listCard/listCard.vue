<template>
	<view @click="open">
		<!-- 基础卡片 -->
		<view class="card-content-box" v-if="item.mode === 'base'">
			<view class="card-img">
				<image class="image" :src="'https://images.weserv.nl/?url='+item.cover[0]"></image>
			</view>
			<view class="card-content">
				<view class="content-title">
					<text>{{item.title}}</text>
					<likes :item="item" :type="type"></likes>
				</view>
				<view class="content-label">
					<view class="label-left">
						{{item.classify}}
					</view>
					<view class="label-right">
						{{item.browse_count}}浏览
					</view>
				</view>
			</view>
		</view>
		<!-- 多图卡片 -->
		<view class="card-content-box  mode-column" v-if="item.mode === 'column'">
			<view class="card-content">
				<view class="content-title">
					<text>{{item.title}}</text>
					<likes :item="item" :type="type"></likes>
				</view>
				<view class="card-img-content">
					<view class="card-img" v-for="(item,index) in item.cover" :key="index" v-if="index < 3">
						<image class="image" :src="'https://images.weserv.nl/?url='+item"></image>
					</view>
				</view>
				<view class="content-label">
					<view class="label-left">
						{{item.classify}}
					</view>
					<view class="label-right">
						{{item.browse_count}}浏览
					</view>
				</view>
			</view>
		</view>
		<!-- 大图卡片 -->
		<view class="card-content-box mode-img" v-if="item.mode === 'image'">
			<view class="card-img">
				<image class="image" :src=" 'https://images.weserv.nl/?url='+item.cover[0]"></image>
			</view>
			<view class="card-content">
				<view class="content-title">
					<text>{{item.title}}</text>
					<likes :item="item" :type="type"></likes>
				</view>
				<view class="content-label">
					<view class="label-left">
						{{item.classify}}
					</view>
					<view class="label-right">
						{{item.browse_count}}浏览
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			item:{
				type:Object,
				default (){
					return {
					}
				}
			},
			type:{
				type:String,
				default (){
					return ''
				}
			}
		},
		name:"listCard",
		data() {
			return {
				follow:'follow'
			};
		},
		methods:{
			open (){
				this.$emit('click')
				console.log(this.item)
				const item = this.item
				const params = {
					title:item.title,
					_id:item._id,
					browse_count:item.browse_count,
					author:item.author,
					create_time:item.create_time,
					thumbs_up_count:item.thumbs_up_count
				}
				uni.navigateTo({
					url:"/pages/home-detail/home-detail?params=" + JSON.stringify(params)
				})
			}
		}
	}
</script>

<style lang="scss">
	.card-content-box{
		display: flex;
		padding:10px;
		margin:10px;
		border-radius: 5px;
		box-shadow:0 0 5px 1px rgba($color: #000000, $alpha: 0.1) ;
		box-sizing: border-box;
		.card-img{
			flex-shrink: 0;
			width:60px;
			height:60px;
			border-radius: 5px;
			overflow: hidden;
			.image{
				width:100%;
				height:100%;
			}
		}
		.card-content{
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			padding-left:10px;
			width:100%;
			.content-title{
				position:relative;
				padding-right:30px;
				font-size: 14px;
				font-weight: 400;
				color:#333;
				line-height: 1.2;
				text{
					overflow: hidden;
					text-overflow: ellipsis;
					// 多行省略号样式
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}
				
			}
			.content-label{
				margin-top: 15px;
				display: flex;
				justify-content: space-between;
				font-size:12px;
				.label-left{
					padding: 0 5px;
					margin-right: 5px;
					border: 1px solid $mk-base-color;
					border-radius: 5px;
					color:$mk-base-color;
				}
				.label-right{
					color:#999;
					line-height: 1.5;
				}
			}
		}
		&.mode-column{
			.card-content{
				width: 100%;
				padding-left: 0;
			}
			.card-img-content{
				display: flex;
				margin-top: 10px;
				width: 100%;
				height: 70px;
				.card-img{
					margin-left: 10px;
					margin-top:10px;
					width:210rpx;
					border-radius: 10px;
					overflow: hidden;
					&:first-child {
						margin-left: 0;
					}
					.image{
						width:100%;
						height: 100%;
					}
				}
			}
			.content-label{
				margin-top: 15px;
			}
		}
		&.mode-img{
			flex-direction: column;
			.card-img{
				width:100%;
				height:100px;
			}
			.card-content{
				padding-left: 0;
				margin-top: 15px;
				
			}
			.content-label{
				display: flex;
				align-items: center;
				margin-top: 15px;
			}
		}
	}
</style>
