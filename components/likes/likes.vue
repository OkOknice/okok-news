<template>
	<view class="icons" @click.stop="clickLikes">
		<uni-icons size="20" color="#f07373" :type="likes ? 'heart-filled' : 'heart'"></uni-icons>
	</view>
</template>

<script>
	export default {
		name:"likes",
		props:{
			item:{
				type:Object,
				default (){
					return {}
				}
			},
			type:{
				type:String,
				default (){
					return ""
				}
			}
		},
		data() {
			return {
				likes:false
			};
		},
		watch:{
			item (newValue){
				this.likes = this.item.is_like
			}
		},
		created (){
			this.likes = this.item.is_like
		},
		methods:{
			clickLikes (){
				console.log(this.item)
				this.likes = !this.likes
				// console.log('点击成功')
				this.setUpdate_likes()
			},
			setUpdate_likes (){
				uni.showLoading({
					
				})
				this.$api.update_likes({
					article_id:this.item._id
				}).then(res =>{
					console.log(res)
					uni.hideLoading()
					uni.showToast({
						title:this.likes ? "收藏成功" : "取消收藏",
						icon:'none'
					})
					uni.$emit('updateLike',this.type)
				}).catch(() =>{
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style lang="scss">
	.icons{
		position:absolute;
		right:0;
		top:0;
		width:20px;
		height:20px;
		display: flex;
		justify-content: center;
		align-items: center; 
	}
</style>
