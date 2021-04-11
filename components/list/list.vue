<template>
	<swiper class="list-swiper" @change="change" :current="activeIndex">
		<swiper-item class="list-swiper-item" v-for="(item,index) in tabList" :key="index">
			<listDetail @loadMore="loadMore">
				<listCard v-for="item in listCatch[index]" :key="item._id" :item="item"></listCard>
				<uni-load-more :status="loading"></uni-load-more>
			</listDetail>
		</swiper-item>
	</swiper>
</template>

<script>
	export default {
		name:"list",
		props:{
			tabList:{
				type:Array,
				default (){
					return []
				}
			},
			activeIndex:{
				type:Number,
				default (){
					return 0
				}
			}
		},
		data() {
			return {
				listData:[],
				listCatch:{},
				//为什么把page放进对象里面，因为此时的page是个共有变量，但是在loadMore函数里面 ++ 是私有变量
				// page:1, 
				load:{
					page:1,//当前第几页
				},
				loading:'loading',
				pageSize:10 // 一页显示多少内容
			};
		},
		created (){
			// this.getList(this.activeIndex)
			uni.$on('updateLike',(res) =>{
				if(res === 'follow'){
					this.listCatch = {}
					this.getList(this.activeIndex)
				}
			})
		},
		watch:{
			tabList (){
				if(this.tabList.length === 0) return
				this.listCatch = {}
				this.getList(this.activeIndex)
			}
		},
		methods:{
			loadMore (){
				// console.log('向上拉动~~')
				// this.page ++
				// if(this.loading == 'noMore') return
				this.load[this.activeIndex].page ++
				// if(this.listCatch)
				this.getList(this.activeIndex)
				// console.log(this.page)
			},
			//切换选项卡以及内容
			change (e){
				// console.log(e)
				let {current} = e.detail
				// console.log(this.tabList[current].name)
				//防止避免过多请求导致性能的降低
				if(!this.listCatch[current] || this.listCatch[current].length === 0){
					this.loading = "loading"
					this.getList(current)
				}
				this.$emit('change',current)	
				
			},
			//获取list的数据
			getList (current){
				//判断this.load[current] 是否存在，tablist可以监听
				if(!this.load[current]){
					this.load[current] = {
						page:1
					}
				}
				console.log(this.load[current].page)
				// console.log(this.page)
				this.$api.get_list({
					name:this.tabList[current].name,
					page:this.load[current].page,
					pageSize:this.pageSize
				})
				.then(res =>{
					// console.log(res)
					// this.listData = res.data
					// this.listCatch = res.data
					//将旧值重新添加到this.listCatch中，下拉加载的时候才会重新复制到页面，会随着原先页面添加进去
					if(res.data.length === 0){
						this.loading = "noMore"
						return
					}
					let oldList = this.listCatch[current] || []
					oldList.push(...res.data)
					this.$set(this.listCatch,current,oldList)
					this.loading = this.listCatch[this.activeIndex].length < 4 ? "noMore" :"loading"
					console.log(this.listCatch[this.activeIndex].length)
				})
			}
		}
	}
</script>

<style lang="scss">
	.list-swiper{
		height:100%;
		.list-swiper-item{
			height:100%;
		}
	}
</style>
