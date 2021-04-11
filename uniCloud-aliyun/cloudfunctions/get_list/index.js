'use strict';
const db = uniCloud.database()
const $ = db.command.aggregate
exports.main = async (event, context) => {
	//event为客户端上传的参数
	// console.log('event : ', event)
	let {user_id,name,page=1,pageSize=10} = event
	//使用聚合函数，使数据更加精细化
	let matchObj = {}
	if(name !== "全部"){
		matchObj = {classify:name}
	}
	const userInfo = await db.collection('user').doc(user_id).get()
	const article_likes_ids = userInfo.data[0].article_likes_ids
	let list = await db.collection('article').aggregate()
	//追加字段
	.addFields({
		is_like:$.in(["$_id",article_likes_ids])
	})
	.match(matchObj)
	.project({
		content:false,	//true 表示可以返回，false表示不可以返回
	})
	.skip(pageSize*(page - 1))
	.limit(pageSize)
	.end()

	//分类获取数据
	// let list = await db.collection('article').field({
	// 	content:false
	// }).get()
	// console.log(list)
	//返回数据给客户端
	return {
		code:200,
		msg:"请求数据成功！！！",
		data:list.data
	}
};
