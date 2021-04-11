<template>
	<view>
		<view class="comments-content" v-for="item in commentList" :key="item.comment_id">
			<comment-content :comments="item" @replys="reply"></comment-content>
		</view>
		<uni-load-more v-if="commentList.length === 0 || commentList.length > 5" iconType="snow" :status="loading"></uni-load-more>
		<release ref="popup" @submit="submit"></release>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				article_id:'',
				commentList:[],
				page:1,
				pageSize:5,
				loading:'loading'
			}
		},
		onLoad (query){
			console.log(query.params)
			this.article_id = query.params
			this.getComment()
		},
		onReachBottom (){
			console.log('onReachBottom')
			this.page ++
			this.getComment()
		},
		methods: {
			getComment (){
				this.$api.get_comment({
					article_id:this.article_id,
					page:this.page,
					pageSize:this.pageSize
				}).then(res =>{
					console.log(res)
					const {data} = res
					if(data.length === 0){
						this.loading = 'noMore'
						return
					}
					let oldCommentList = JSON.parse(JSON.stringify(this.commentList))
					oldCommentList.push(...data)
					this.commentList = oldCommentList
				})
			},
			//发布评论
			submit (content){
				this.close()
				console.log(content)
				this.setUpdateComment({content,...this.replysComments})
			},
			//打开评论窗口
			open (){
				this.$refs.popup.open()
			},
			//关闭评论窗口
			close (){
				this.$refs.popup.close()
			},
			//更新评论数据
			setUpdateComment (content){
				console.log('1111')
				const formatData = {
					article_id:this.article_id,
					...content
				}
				this.commentList = []
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
			reply (e){
				// console.log(e)
				console.log('1111')
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
		}
	}
</script>

<style lang="scss">
	.comments-content {
		padding: 0 15px;
	}
</style>
