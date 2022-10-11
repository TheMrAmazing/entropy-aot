export async function get(url) {
	try {
		let res = await fetch(url, {
			method: 'GET',
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Accept-Encoding': 'gzip, deflate, br'
			}
		})
		let ret = await res.json()
		return ret
	}
	catch (e) {
		console.error(`GET ERROR: ${url}
${e}`)
		return undefined
	}
}
export async function post(url, body) {
	try {
		let res = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json, text/plain, */*',
				'Accept-Encoding': 'gzip, deflate, br'
			},
			body: JSON.stringify(body)
		})
		return await res.json()
	}
	catch (e) {
		console.error(`POST ERROR: ${url}
${e}`)
		return undefined
	}
}
