'use strict';
const db = uniCloud.database()
const dbCmd = db.command
exports.main = async (event, context) => {
	//event为客户端上传的参数
	// console.log('event : ', event)
	const {
		user_id,
		article_id
	} = event
	 let user = await db.collection('user').doc(user_id).get()
	 let thumbs_up_article_ids = user.data[0].thumbs_up_article_ids
	 let thumbs_ids = null
	 if(thumbs_up_article_ids.includes(thumbs_ids)){
		 return {
			 code: 200,
			 msg: '您已经点过赞了'
		 }
	 } else {
		 thumbs_ids = dbCmd.addToSet(thumbs_ids)
	 }
	 await db.collection('user').doc(user_id).update({
	 	thumbs_up_article_ids: thumbs_ids
	 })
	 
	 await db.collection('article').doc(article_id).update({
	 	// inc 原子操作 ，减少一次请求
	 	thumbs_up_count:dbCmd.inc(1)
	 })
	
	//返回数据给客户端
	return {
		code:200,
		msg:'点赞成功'
	}
};
