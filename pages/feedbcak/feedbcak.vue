<template>
	<view>
		<view class="feedback-title">意见反馈：</view>
		<view class="feedback-content">
			<textarea class="feedback-textarea" v-model="content" placeholder="请输入您要反馈的问题" />
			</view>
		<view class="feedback-title">反馈图片：</view>
		<view class="feedback-image-box">
			<view 
				class="feedback-image-item"
				v-for="(item,index) in imageLists"
				:key="index"
			>
				<view class="close-icon" @click="delImage(index)">
					<uni-icons type="closeempty" size="18" color="#fff"></uni-icons>
				</view>
				<view class="image-box">
					<image :src="item.url" mode="aspectFill"></image>
				</view>
			</view>
			<view  class="feedback-image-item">
				<view 
					class="image-box" 
					v-if="imageLists.length < 5"
					@click="addImage"
				>
					<uni-icons type="plusempty" size="50" color="#eee"></uni-icons>
				</view>
			</view>
		</view>
		<button class="feedback-button" type="primary" @click="submit">提交反馈意见 </button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				content:'',
				imageLists:[]
			}
		},
		methods: {
			//删除图片
			delImage (index){
				this.imageLists.splice(index,1)
			},
			//添加图片
			addImage (){
				let that = this
				const count = 5 - that.imageLists.length
				uni.chooseImage({
					count,
					success (res){
						console.log(res)
						const tempFilePaths = res.tempFilePaths
						tempFilePaths.forEach((item,index) =>{
							if(index < count){
								that.imageLists.push({
									url:item
								})
							}
							
						})
					}
				})
			},
			//提交反馈信息
			async submit (){
				// console.log(this.imageLists)
				let imageFiles = []
				uni.showLoading()
				for(let i = 0; i < this.imageLists.length; i++){
					// console.log(this.imageLists[i].url)
					let filePath = this.imageLists[i].url
					filePath = await this.uploadFiles(filePath)
					imageFiles.push(filePath)
				}
				this.setUpdateFeedback({
					content:this.content,
					imageFiles:imageFiles
				})
			},
			async uploadFiles(filePath){
				let result = await uniCloud.uploadFile({
					cloudPath:filePath
				})
				console.log(result);
				return result.fileID
			},
			setUpdateFeedback ({content,imageFiles}){
				this.$api.update_feedback({
					content,
					imageFiles
				}).then(res =>{
					// console.log(res)
					uni.hideLoading()
					uni.showToast({
						title:"反馈提交成功",
						icon:'none'
					})
					setTimeout(()=>{
						uni.switchTab({
							url:'/pages/tapbar/my/my'
						})
					},2000)
				}).catch(() =>{
					uni.hideLoading()
					uni.showToast({
						title:"反馈提交失败 ",
						icon:"none"
					})
				})
			}
		}
	}
</script>

<style lang="scss">
.feedback-title {
	margin: 15px;
	margin-top:30px;
	margin-bottom: 0;
	font-size: 14px;
	color: #666;
}

.feedback-content {
	margin: 15px;
	padding: 10px;
	box-sizing: border-box;
	border: 1px #eee solid;
	.feedback-textarea {
		font-size: 12px;
		width: 100%;
		height: 100px;
	}
}
.feedback-image-box {
	display: flex;
	flex-wrap: wrap;
	padding: 10px;
	.feedback-image-item {
		position: relative;
		width: 33.33%;
		height: 0;
		padding-top: 33.33%;
		box-sizing: border-box;
		.close-icon {
			display: flex;
			justify-content: center;
			align-items: center;
			position: absolute;
			right: 0;
			top: 0;
			width: 22px;
			height: 22px;
			border-radius: 50%;
			background-color: #ff5a5f;
			z-index: 2;
		}
		.image-box  {
			display: flex;
			justify-content: center;
			align-items: center;
			position: absolute;
			top: 5px;
			right: 5px;
			bottom: 5px;
			left: 5px;
			border: 1px #eee solid;
			border-radius: 5px;
			overflow: hidden;
			image {
				width: 100%;
				height: 100%;
			}
		}
	}
}
.feedback-button {
	margin: 0 15px;
	background-color: $mk-base-color;
}
</style>

