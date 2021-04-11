<template>
	<view class="label">
		<view class="label-box">
			<view class="label-header">
				<view class="label-title">我的标签</view>
				<view class="label-edit" @click="clickEdit">{{isEditing ? '完成' : '编辑'}}</view>
			</view>
			<uni-load-more v-if="isLoading" status="loading" iconType="snow"></uni-load-more>
			<view v-if="!isLoading" class="label-content">
				<view 
					class="label-content__item" 
					v-for="(item,index) in labelList" 
					:key="index"
				>
					{{item.name}}
					<uni-icons 
						class="icons-close" 
						type="clear" 
						size="20" 
						color="red" 
						v-if="isEditing"
						@click="del(index)"
					></uni-icons>
				</view>
				<view v-if="labelList.length === 0 && !isLoading" class="no-data">
					当前没有数据
				</view>
			</view>

		</view>
		<view class="label-box">
			<view class="label-header">
				<view class="label-title">标签推荐</view>
			</view>
			<uni-load-more v-if="isLoading" status="loading" iconType="snow"></uni-load-more>
			<view v-if="!isLoading" class="label-content">
				<view 
					class="label-content__item" 
					v-for="(item,index) in list" 
					:key="index"
					@click="add(index)"
				>{{item.name}}</view>
				<view v-if="list.length === 0 && !isLoading" class="no-data">
					当前没有数据
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				isEditing: false,
				labelList:[],
				list:[],
				isLoading:true
			}
		},
		onLoad (){
			console.log(this.labelList)
			this.getLabel()	
		},
		methods: {
			//点击编辑标签数据
			clickEdit (){
				// this.isEditing = !this.isEditing
				if(this.isEditing){
					this.isEditing = false
					// console.log(this.labelList)
					//点击编辑，将编辑好的数据在数据库进行刷新
					this.setUpdateLabel(this.labelList)
				} else {
					this.isEditing = true
				}
			},
			//将推荐标签的数据添加到我的标签中
			add(index){
				if(!this.isEditing) return
				this.labelList.push(this.list[index])
				this.list.splice(index,1)
			},
			//将删除的标签添加到推荐标签当中
			del(index){
				this.list.push(this.labelList[index])
				this.labelList.splice(index,1)
			},
			//更新标签的数据
			setUpdateLabel (label){
				let newLabel = []
				label.forEach(item =>{
					newLabel.push(item._id)
				})
				console.log(newLabel)
				uni.showLoading({
				})
				this.$api.update_label({
					label:newLabel
				}).then(res =>{
					uni.hideLoading()
					uni.showToast({
						title:"更新完成",
						icon:"none"
					})
					console.log(res)
					//自定义事件，目的是为了更新标签之后，首页的tab栏的数据也会及时更新
					//该事件是向 index 发送
					uni.$emit('labelchange')
				})
			},
			//获取标签的数据
			getLabel (){
				this.isLoading = true
				this.$api.get_label({
					type:'all'
				}).then(res =>{
					this.isLoading = false
					console.log(res)
					const {data} = res
					this.labelList = data.filter(item => item.current)
					this.list = data.filter(item => !item.current)
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f5f5f5;
	}

	.label {
		.label-box {
			background-color: #fff;
			margin-bottom: 10px;

			.label-header {
				display: flex;
				justify-content: space-between;
				padding: 10px 15px;
				font-size: 14px;
				color: #666;
				border-bottom: 1px #f5f5f5 solid;

				.label-edit {
					color: #30b33a;
					font-weight: bold;
				}
			}

			.label-content {
				display: flex;
				flex-wrap: wrap;
				padding: 15px;
				padding-top: 0;

				.label-content__item {
					position: relative;
					padding: 2px 5px;
					margin-top: 12px;
					margin-right: 10px;
					border-radius: 5px;
					border: 1px #666 solid;
					font-size: 14px;
					color: #666;

					.icons-close {
						position: absolute;
						right: -8px;
						top: -8px;
						background-color: #fff;
						border-radius: 50%;
					}
				}
			}
		}
	}

	.no-data {
		width: 100%;
		text-align: center;
		padding: 50px 0;
		color: #999;
		font-size: 14px;
	}
</style>
