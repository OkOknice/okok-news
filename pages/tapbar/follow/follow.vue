<template>
	<view class="follow">
		<!-- 导航切换  -->
		<view class="follow-tab">
			<view class="follow-tab__box">
				<view class="follow-tab__item" :class="{active:activeIndex === 0}" @click="tab(0)">文章</view>
				<view class="follow-tab__item" :class="{active:activeIndex === 1}" @click="tab(1)">作者</view>
			</view>
		</view>
		<view class="follow-list">
			<swiper class="follow-list__swiper" :current="activeIndex" @change="change">
				<swiper-item>
					<listDetail>
						<uni-load-more 
							v-if="followList.length === 0 && !articleShow" 
							iconType="snow" 
							status="loading"
						></uni-load-more>
						<listCard 
							v-for="item in followList" 
							:key="item._id" 
							:item="item"
							type="follow"
						></listCard>
						<view class="no-data" v-if="articleShow">没有收藏的文章</view>
					</listDetail>
				</swiper-item>
				<swiper-item class="swiper-item">
					<list-author v-for="item in authorList" :key="item.id" :item="item"></list-author>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				activeIndex :0,
				followList:[],
				articleShow:false,
				authorList:[]
			}
		},
		onLoad (){
			uni.$on('updateLike',() =>{
				// console.log('页面刷新')
				this.getFollow()
			})
			uni.$on('updateAuthor',() =>{
				this.getAuthor()
			})
			this.getFollow()
			this.getAuthor()
		},
		methods: {
			//滑动切换
			change (e){
				console.log(e)
				this.activeIndex = e.detail.current
			},
			//点击切换
			tab (index) {
				this.activeIndex = index
			},
			//获取文章收藏
			getFollow (){
				this.$api.get_follow().then(res =>{
					const {data} = res
					this.followList = data
					// console.log(res)
					this.articleShow = this.followList.length === 0 ? true : false
				})
			},
			//获取关注作者
			getAuthor (){
				this.$api.get_author().then(res =>{
					console.log(res)
					const {data} = res
					this.authorList = data
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
		display: flex;
	}

	.follow {
		// height: 100%;
		display: flex;
		flex-direction: column;
		flex: 1;
		box-sizing: border-box;

		.follow-tab {
			height: 30px;
			padding: 10px 20px;
			border-bottom: 1px #f5f5f5 solid;

			.follow-tab__box {
				display: flex;
				width: 100%;
				height: 100%;
				border-radius: 5px;
				border: 1px $mk-base-color solid;

				.follow-tab__item {
					display: flex;
					justify-content: center;
					align-items: center;
					color: #666;
					font-size: 14px;
					width: 100%;

					&:first-child {
						border-right: 1px $mk-base-color solid;
					}

					&.active {
						color: $mk-base-color;
					}

				}
			}
		}
		.follow-list {
			flex: 1;

			.follow-list__swiper {
				height: 100%;

				.swiper-item {
					height: 100%;
				}
			}
		}
	}

	.no-data {
		padding: 50px;
		font-size: 14px;
		color: #999;
		text-align: center;
	}
</style>
