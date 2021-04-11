import store from '../store/index.js'
export default function $http (options){
	const {url,data} = options
	const myObj = {
		user_id:store.state.userInfo._id,
		...data
	}
	return new Promise((resolve,reject) =>{
		uniCloud.callFunction({
			name:url ,//与请求的云函数的名字相对应
			data:myObj
		}).then(res =>{
			if(res.result.code === 200){
				resolve(res.result)
			} else {
				reject(res.result)
			}
		}).catch((err) =>{
			reject(err)
		})
	})
}