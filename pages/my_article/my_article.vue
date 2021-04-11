<template>
	<view>
		<uni-load-more
			v-if="articleList.length === 0"
			status="loading"
		></uni-load-more>
		<listCard v-for="item in articleList" :key="item._id" :item="item"></listCard>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				articleList : {}
			}
		},
		onLoad (){
			this.getMyArticle()
		},
		methods: {
			getMyArticle (){
				this.$api.get_my_article().then(res =>{
					console.log(res)
					const {data} = res
					this.articleList = data
				})
			}
		}
	}
</script>

<style>

</style>
