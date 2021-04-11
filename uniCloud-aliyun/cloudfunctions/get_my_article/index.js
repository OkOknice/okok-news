'use strict';
const db = uniCloud.database()
const $ = db.command.aggregate
const dbCmd = db.command
exports.main = async (event, context) => {
	//event为客户端上传的参数
	// console.log('event : ', event)
	const {
		user_id
	} = event
	
	let user = await db.collection('user').doc(user_id).get()
	user = user.data[0]
	
	let list = await db.collection('article')
		.aggregate()
		.addFields({
			is_like:$.in(['$_id',user.article_likes_ids])
		})
		.match({
			id:dbCmd.in(user.article_ids)
		})
		.end()
	//返回数据给客户端
	return {
		code:200,
		mag:"请求数据成功",
		data:list.data
	}
};
