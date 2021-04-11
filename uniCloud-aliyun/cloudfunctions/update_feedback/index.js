'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	// console.log('event : ', event)
	const {
		user_id,
		content='',
		imageFiles=[]
	} = event
	await db.collection('feedback').add({
		content:content,
		imageFiles:imageFiles,
		user_id:user_id
	})
	//返回数据给客户端
	return {
		code:200,
		msg:'数据更新成功'
	}
};
