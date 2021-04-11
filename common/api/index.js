import {get_label} from './list.js'

const requireAPi = require.context(//该方法就是将目录的所有文件汇总起来
	".",
	false,
	/.js$/
)
// console.log(requireAPi.keys())
let module = {}
requireAPi.keys().forEach((key,index) =>{
	// console.log(key)
	if(key === './index.js') return
	// console.log(requireAPi(key))
	// ES6方法：将两个对象合并
	Object.assign(module,requireAPi(key))
	// console.log(module)
})

// export default {
// 	get_label
// }
//最终返回一个合并好的对象，里面包含了所有的方法
export default module