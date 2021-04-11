<template>
	<scroll-view scroll-y="true" class="detail-scroll-view" @scrolltolower="loadMore">
		<slot></slot>
	</scroll-view>
</template>

<script>
	export default {
		name:"listDetail",
		data() {
			return {
				
			};
		},
		methods:{
			loadMore (){
				// console.log("向上拉动~~~")
				this.$emit('loadMore')
			}
		}
	}
</script>

<style>
	.detail-scroll-view{
		height: 100%;
	}
</style>
