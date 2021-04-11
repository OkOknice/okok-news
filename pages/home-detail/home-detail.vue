<template>
	<view class="detail">
		<view class="detail-title">
			{{format.title}}
		</view>
		<view class="detail-header">
			<view class="detail-header__logo">
				<image :src="'https://images.weserv.nl/?url='+format.author.avatar" mode="aspectFill"></image>
			</view>
			<view class="detail-header__content">
				<view class="detail-header__content-title">
					{{format.author.name}}
				</view>
				<view class="detail-header__content-info">
					<text>{{format.create_time}}</text>
					<text>{{format.browse_count}} 浏览</text>
					<text>{{format.thumbs_up_count}} 赞</text>
				</view>
				<button
					class="detail-header__button"
					type="default"
					@click="follow(format.author.id)"
				>{{format.is_author_like ? '取消关注' : '关注'}}</button>
			</view>
		</view>
		<view class="detail-content">
			<view class="detail-html">
				<u-parse :content="format.content" :noData="noData"></u-parse>
				<!-- {{format.content}} -->
			</view>
			<view class="detail-comment">
				<view class="comment-title">最新评论</view>
				<view 
					class="comment-content"
					v-for="item in commentLists"
					:key="item._id"
				>
					<comment-content :comments="item" @replys="reply"></comment-content>
				</view>
			</view>
			<!-- <view class="detail-comment">
				<view class="comment-title">最新评论</view>
				<view class="comment-content" v-for="item in commentsList" :key="item.comment_id">
					<comments-box :comments="item" @reply="reply"></comments-box>
				</view>
			</view> -->
		</view>
		<view class="detail-bottom">
			<view class="detail-bottom__input" @click="open">
				<text >谈谈你的看法</text>
				<uni-icons type="compose" size="16" color="#F07373"></uni-icons>
			</view>
			<view class="detail-bottom__icons">
				<view class="detail-bottom__icons-box" @click="openAllComment">
					<uni-icons 
					type="chat" 
					size="22" 
					color="#F07373"
				></uni-icons>
				</view>
				<view class="detail-bottom__icons-box" @click="likeTap(format._id)">
					<uni-icons 
						:type="format.is_like ? 'heart-filled' : 'heart'"  
						size="22" 
						color="#F07373"
					></uni-icons>
				</view>
				<view class="detail-bottom__icons-box" @click="thumsup(format._id)">
					<uni-icons 
						:type="format.is_thums_up ?'hand-thumbsup-filled':'hand-thumbsup' " 
						size="22" 
						color="#F07373"
					></uni-icons>
				</view>
			</view>
		</view>
		<release ref="popup" @submit="submit"></release>
		<!-- <uni-popup ref="popup" type="bottom">
			<view class="popup-wrap">
				<view class="popup-header">
					<text class="popup-header__item" @click="close">取消 </text>
					<text class="popup-header__item" @click="submit">发布 </text>
				</view>
				<view class="popup-content">
					<textarea class="popup-textarea" v-model="modelValue" maxlength="200" fixed placeholder="请输入评论内容" />
					<view class="popup-count">{{modelValue.length}}/200</view>
				</view>
			</view>
		</uni-popup> -->
	</view>
</template>

<script>
	import uParse from '@/components/gaoyia-parse/parse.vue'
	export default {
		components:{
			uParse
		},
		data() {
			return {
				format:{},
				noData:"<p></p>",
				modelValue:'',
				commentLists:[],
				//回复的数据
				replysComments:{}
			}
		},
		onLoad (query){
			// console.log(JSON.parse(query.params))
			this.format = JSON.parse(query.params)
			this.getDetail()
			this.getComment()
			// console.log(this.format)
		},
		onReady (){
			// this.$refs.popup.open()
		},
		methods: {
			openAllComment (){
				uni.navigateTo({
					url:'/pages/detail-comment/detail-comment?params='+this.format._id
				})
			},
			//发布评论
			submit (content){
				// console.log('发布')
				// if(!this.modelValue) {
				// 	this.close()
				// 	return
				// }
				this.close()
				console.log(content)
				this.setUpdateComment({content,...this.replysComments})
				// this.modelValue = ''
			},
			//打开评论窗口
			open (){
				this.$refs.popup.open()
			},
			//关闭评论窗口
			close (){
				this.$refs.popup.close()
			},
			//回复评论
			reply (e){
				// console.log(e)
				this.replysComments = {
					"comment_id":e.comments.comment_id,
					"is_reply": e.is_reply
				}
				//如果存在，就是子回复
				if(e.comments.reply_id){
					this.replysComments.reply_id = e.comments.reply_id	
				}
				this.open()
			},
			//关注作者
			follow (author_id){
				// console.log('关注')
				this.setUpdateAuthor(author_id)
				
				console.log(this.format)
			},
			//收藏
			likeTap (article_id){
				this.getLike(article_id)
				console.log(this.format)
			},
			//点赞
			thumsup (article_id){
				// console.log('点赞')
				console.log(this.format)
				this.getUpdateThumsup(article_id)
			},
			
			//更新评论数据
			setUpdateComment (content){
				const formatData = {
					article_id:this.format._id,
					...content
				}
				this.$api.update_comment(formatData).then(res =>{
					console.log(res)
					uni.showToast({
						title:"评论成功",
						icon:'none'
					})
					this.getComment()
					this.replysComments = {}
				})
			},
			//获取详情数据
			getDetail (){
				this.$api.get_detail({
					article_id:this.format._id
				}).then(res =>{
					// console.log(res)
					const {data} = res
					this.format = data
				})
			},
			//获取评论数据
			getComment (){
				this.$api.get_comment({
					article_id:this.format._id
				}).then(res =>{
					// console.log(res)
					const {data} = res
					this.commentLists = data
				})
			},
			//收藏
			getLike (article_id){
				uni.showLoading({})
				this.$api.update_likes({
					article_id
				}).then(res =>{
					uni.hideLoading()
					this.format.is_like = !this.format.is_like
					uni.showToast({
						title: this.format.is_like ? '收藏成功' : '取消收藏',
						icon:'none'
					})
					this.getDetail()
					uni.$emit('updateLike','follow')
				})
			},
			//关注作者数据
			setUpdateAuthor (author_id){
				uni.showLoading({})
				this.$api.update_author({
					author_id
				}).then(res =>{
					// console.log(res)
					this.format.is_author_like = !this.format.is_author_like
					uni.hideLoading()
					uni.showToast({
						title:this.format.is_author_like ? '关注成功' : "取消关注",
						icon:'none'
					})
					this.getDetail()
					uni.$emit('updateAuthor')
				})
			},
			//点赞
			getUpdateThumsup (article_id){
				uni.showLoading({
				})
				this.$api.update_thumsup({
					article_id
				}).then(res =>{
					uni.hideLoading()
					if(!this.format.is_thums_up){
						this.format.thumbs_up_count ++
					}
					this.format.is_thums_up = true
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
					console.log(res)
				})
			}
		}
	}
</script>

<style lang="scss">
	.detail {
		padding: 15px 0;
		padding-bottom: 54px;
	}
	.detail-title {
		padding: 0 15px;
		font-size: 18px;
		font-weight: bold;
		color: #333;
	}

	.detail-header {
		display: flex;
		align-items: center;
		margin-top: 10px;
		padding: 0 15px;

		.detail-header__logo {
			flex-shrink: 0;
			width: 40px;
			height: 40px;
			border-radius: 50%;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.detail-header__content {
			width: 100%;
			padding-left: 10px;
			display: flex;
			// flex-direction: column;
			justify-content: space-between;
			align-items: center;
			font-size: 12px;
			.detail-header__content-title {
				font-size: 14px;
				color: #333;
			}

			.detail-header__content-info {
				color: #999;

				text {
					margin-right: 10px;
				}
			}
			.detail-header__button {
					padding: 0 15px;
					flex-shrink: 0;
					height: 30px;
					line-height: 30px;
					border-radius: 5px;
					font-size: 12px;
					color: #fff;
					background-color: $mk-base-color;
				}
			}
		}
		

	.detail-content {
		margin-top: 20px;
		min-height: 1000px;
		.detail-html {
			padding:0 15px;
		}
		.detail-comment {
			margin-top: 30px;
			.comment-title {
				padding: 10px 15px;
				font-size: 14px;
				color: #666;
				border-bottom: 1px #f5f5ff solid;
			}
			.comment-content {
				padding: 0 15px;
				border-top: 1px #eee solid;
			}
		}
	}

	.detail-bottom {
		position: fixed;
		bottom: 0;
		left: 0;
		display: flex;
		align-items: center;
		width: 100%;
		height: 44px;
		border-top: 1px #f5f5f5 solid;
		background-color: #fff;
		box-sizing: border-box;

		.detail-bottom__input {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-left: 10px;
			padding: 0 10px;
			width: 100%;
			height: 30px;
			border: 1px #ddd solid;
			border-radius: 5px;

			text {
				font-size: 14px;
				color: #999;
			}
		}

		.detail-bottom__icons {
			display: flex;
			flex-shrink: 0;
			padding: 0 10px;

			.detail-bottom__icons-box {
				position: relative;
				display: flex;
				align-items: center;
				justify-content: center;
				width: 44px;
			}
		}
	}
	.popup-wrap {
			background-color: #fff;
			.popup-header {
				display: flex;
				justify-content: space-between;
				font-size: 14px;
				color: #666;
				border-bottom: 1px #F5F5F5 solid;
				.popup-header__item {
					height: 50px;
					line-height: 50px;
					padding: 0 15px;
				}
			}
			.popup-content {
				width: 100%;
				padding: 15px;
				box-sizing: border-box;
				.popup-textarea {
					width: 100%;
					height: 200px;
					
				}
				.popup-count {
					display: flex;
					justify-content: flex-end;
					font-size: 12px;
					color: #999;
				}
			}
		}

</style>
