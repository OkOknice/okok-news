export const parseIntTime = (time) =>{
	const format = '{y}-{m}-{d} {h}:{i}:{s}'
	let date = null
	if(typeof time === 'string'){
		time = parseInt(time)
	}
	
	date = new Date(time)
	let formatObj = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds()
	}
	const strTime = format.replace(/{(y|m|d|h|i|s)+}/g, (result, key) => {
		let value = formatObj[key]
		if (result.length > 0 && value < 10) {
			value = '0' + value
		}
		return value
	})
	return strTime
}